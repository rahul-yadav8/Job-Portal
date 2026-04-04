import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'

const ApiRoutes = {
  get: '/api/v1/company-profile',
  create: '/api/v1/company-profile',
  update: (id: string) => `/api/v1/company-profile/${id}`,
}

type ICompanyProfile = {
  id: string
  name: string
  email: string
  description?: string
  website?: string
  logo?: string
  created_at: string
}

export type StateType = {
  companyProfile: ICompanyProfile | null
}

const initialState: StateType = {
  companyProfile: null,
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
    case 'SET_COMPANY_PROFILE':
      return {
        ...state,
        companyProfile: payload,
      }

    case 'UPDATE_COMPANY_PROFILE':
      return {
        ...state,
        companyProfile: {
          ...state.companyProfile,
          ...payload,
        },
      }

    default:
      return state
  }
}

export const { useContext: useCompanyProfile, Provider: CompanyProfileProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  // =========================
  // GET COMPANY PROFILE
  // =========================
  const getCompanyProfile = (callback?: (data: any) => void) => {
    APIService.get(ApiRoutes.get, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({
          type: 'SET_COMPANY_PROFILE',
          payload: res.data,
        })

        callback?.(res.data)
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
  // CREATE COMPANY PROFILE
  // =========================
  const createCompanyProfile = (
    data: Partial<ICompanyProfile>,
    callback?: (error: any, data: any) => void
  ) => {
    APIService.post(ApiRoutes.create, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data

        dispatch({
          type: 'SET_COMPANY_PROFILE',
          payload: response?.data,
        })

        toast({
          title: 'Success',
          description: 'Company profile created successfully',
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
  // UPDATE COMPANY PROFILE
  // =========================
  const updateCompanyProfile = (
    id: string,
    data: Partial<ICompanyProfile>,
    callback?: (data: any) => void
  ): Promise<void> => {
    return APIService.patch(ApiRoutes.update(id), data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data

        dispatch({
          type: 'UPDATE_COMPANY_PROFILE',
          payload: response?.data,
        })

        toast({
          title: 'Success',
          description: 'Company profile updated successfully',
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

  return {
    state,
    actions: {
      getCompanyProfile,
      createCompanyProfile,
      updateCompanyProfile,
    },
  }
})
