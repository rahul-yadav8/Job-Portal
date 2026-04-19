import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { stringify } from 'qs'
import { useReducer } from 'react'

const ApiRoutes = {
  base: '/api/company',
  upload: '/api/users',
}

type IManageCompany = {
  companyName: string
  description: string
  location: string
  website: string
  logo: string
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
    case 'GET_COMPANY_LIST':
      return {
        ...state,
        manageCompanyList: payload?.data?.company || [],
      }

    case 'ADD_MANAGE_COMPANY':
      return {
        ...state,
        manageCompanyList: [payload, ...state.manageCompanyList],
      }

    case 'UPDATE_MANAGE_COMPANY':
      return {
        ...state,
        manageCompanyList: state.manageCompanyList.map((company: any) =>
          company._id === payload._id ? { ...company, ...payload } : company
        ),
      }

    case 'DELETE_MANAGE_COMPANY':
      return {
        ...state,
        manageCompanyList: state.manageCompanyList.filter((company: any) => company._id !== payload.id),
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
  const getCompanies = (callback?: (data: any) => void) => {
    APIService.get(`${ApiRoutes.base}/list`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({
          type: 'GET_COMPANY_LIST',
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
    APIService.post(`${ApiRoutes.base}/create`, data, import.meta.env.VITE_API_ENDPOINT)
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
  const updateCompany = (
    id: string,
    data: Partial<IManageCompany>,
    callback?: (data: any) => void
  ): Promise<any> => {
    return APIService.put(`${ApiRoutes.base}/${id}`, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res?.data

        dispatch({
          type: 'UPDATE_MANAGE_COMPANY',
          payload: response?.data ?? { id, ...data },
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
  // DELETE COMPANY
  // =========================
  const deleteCompany = (id: string, callback?: (data: any) => void): Promise<any> => {
    return APIService.delete(`${ApiRoutes.base}/${id}`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res?.data

        dispatch({
          type: 'DELETE_MANAGE_COMPANY',
          payload: { id },
        })

        toast({
          title: 'Success',
          description: 'Company deleted successfully',
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

  // upload logo
  const uploadImage = async (file: File, callback?: (data?: any, error?: any) => void) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const res: any = await APIService.post(
        `${ApiRoutes.upload}/upload-image`,
        formData,
        import.meta.env.VITE_API_ENDPOINT
      )
      callback?.(res.data, null)

      return res.data.url
    } catch (error: any) {
      console.log('UPLOAD ERROR:', error)

      callback?.(null, error)

      throw error // IMPORTANT so register flow stops
    }
  }

  return {
    state,
    actions: {
      getCompanies,
      createManageCompany,
      updateCompany,
      uploadImage,
      deleteCompany,
    },
  }
})
