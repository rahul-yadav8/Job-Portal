import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { stringify } from 'qs'
import { useReducer } from 'react'

const ApiRoutes = {
  base: '/api/v1/company',
  create: '/api/v1/company',
  delete: (id: string) => `/api/v1/company/${id}`,
  update: (id: string) => `/api/v1/company/${id}`,
}

type IManageCompany = {
  id: string
  title: string
  description: string
  location: string
  salary?: string
  status: 'open' | 'closed'
  created_at: string
}

export type StateType = {
  manageCompanyList: IManageCompany[]
  selectedCompany: IManageCompany | null
}

const initialState: StateType = {
  manageCompanyList: [],
  selectedCompany: null,
}

const reducer = (
  state: StateType,
  action: {
    type: string
    payload?: any
  }
) => {
  const { type, payload } = action

  switch (type) {
    case 'GET_MANAGE_COMPANY_LIST':
      return {
        ...state,
        manageCompanyList: payload?.data || [],
      }

    case 'ADD_MANAGE_COMPANY':
      return {
        ...state,
        manageCompanyList: [payload, ...state.manageCompanyList],
      }

    case 'UPDATE_MANAGE_COMPANY':
      return {
        ...state,
        manageCompanyList: state.manageCompanyList.map((company) =>
          company.id === payload.id ? { ...company, ...payload } : company
        ),
      }

    case 'UPDATE_MANAGE_COMPANY_STATUS':
      return {
        ...state,
        manageCompanyList: state.manageCompanyList.map((company) =>
          company.id === payload.id ? { ...company, status: payload.status } : company
        ),
      }

    default:
      return state
  }
}

export const { useContext: useCompany, Provider: CompanyProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  // =========================
  // GET COMPANIES
  // =========================
  const getManageCompanies = (
    query: { [key: string]: any } = { query: '' },
    callback?: (data: any) => void
  ) => {
    const queryStr = stringify(query)

    APIService.get(`${ApiRoutes.base}?${queryStr}`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({
          type: 'GET_MANAGE_COMPANY_LIST',
          payload: res,
        })

        callback?.(res)
      })
      .catch((error: any) => {
        callback?.(null)
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })
      })
  }

  // =========================
  // CREATE COMPANY
  // =========================
  const createManageCompany = (data: Partial<IManageCompany>, callback?: (error: any, data: any) => void) => {
    APIService.post(ApiRoutes.create, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data

        dispatch({
          type: 'ADD_MANAGE_COMPANY',
          payload: response?.data,
        })

        toast({
          title: 'Success',
          description: 'Company created successfully',
        })

        callback?.(null, response)
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        callback?.(error, null)
      })
  }

  // =========================
  // UPDATE COMPANY
  // =========================
  const updateManageCompany = (
    id: string,
    data: Partial<IManageCompany>,
    callback?: (data: any) => void
  ): Promise<void> => {
    return APIService.patch(ApiRoutes.update(id), data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data

        dispatch({
          type: 'UPDATE_MANAGE_COMPANY',
          payload: response?.data,
        })

        toast({
          title: 'Success',
          description: 'Company updated successfully',
        })

        callback?.(response)
        return response
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        throw error
      })
  }

  // =========================
  // UPDATE COMPANY STATUS
  // =========================
  const updateManageCompanyStatus = (id: string, data: any, callback?: (error: any, data: any) => void) => {
    APIService.patch(ApiRoutes.delete(id), data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({
          type: 'UPDATE_MANAGE_COMPANY_STATUS',
          payload: {
            id,
            status: data.status,
          },
        })

        toast({
          title: 'Success',
          description:
            data.status === 'closed' ? 'Company closed successfully' : 'Company opened successfully',
        })

        callback?.(null, res.data)
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        callback?.(error, null)
      })
  }

  return {
    state,
    actions: {
      getManageCompanies,
      createManageCompany,
      updateManageCompany,
      updateManageCompanyStatus,
    },
  }
})
