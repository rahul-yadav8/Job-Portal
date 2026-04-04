import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'
import { stringify } from 'qs'
import { IMEDetails, IProfileList } from '@/types/profile.interface'

const ApiRoutes = {
  base: '/api/v1/auth',
  forgotPasswordBase: '/sessions',
}
export type StateType = {
  profileList: IProfileList[]
  UserDetails: IMEDetails[]
}

const initialState: StateType = {
  profileList: [],
  UserDetails: [],
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
    case 'GET_LIST':
      return {
        ...state,
        profileList: payload.user,
      }
    case 'GET_SELECT_LIST':
      return {
        ...state,
        profileList: payload.user,
      }
    case 'SET_USER_DETAILS':
      localStorage.setItem('org_id', payload.org_id || '')
      return {
        ...state,
        UserDetails: payload,
      }
    default:
      return state
  }
}
export const { useContext: useProfile, Provider: ProfileProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  const getAll = (
    query: { [key: string]: any } = { limit: 10000000 },
    mininal?: boolean,
    callback?: (data: any) => void
  ) => {
    if (mininal) {
      query = {
        ...query,
        all: true,
      }
    }
    const queryStr = stringify(query)
    APIService.get(`${ApiRoutes.base}?${queryStr}`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response: any = res.data
        dispatch({ type: !mininal ? 'GET_LIST' : 'GET_SELECT_LIST', payload: response })
        if (typeof callback === 'function') {
          callback(response)
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast({
            title: 'Error',
            variant: 'destructive',
            description: error?.message,
          })
        }
      })
  }

  const updateProfile = (data: any, callback?: (error: any, data: any) => void) => {
    APIService.put(`${ApiRoutes.base}`, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response: any = res.data
        toast({
          title: 'Success',
          variant: 'default',
          description: 'Profile Updated successfully',
        })
        if (typeof callback === 'function') {
          callback(null, response)
        }
      })
      .catch((error: any) => {
        if (typeof error === 'object' && error.status) {
          toast({
            title: 'Error',
            variant: 'destructive',
            description: error?.message,
          })
        }
        if (typeof callback === 'function') {
          callback(error, null)
        }
      })
  }

  const forgotPassword = (data: { email: string }, callback?: (response: any, error?: any) => void) => {
    if (!data.email) {
      callback?.(null, { message: 'Email is required' })
      return
    }

    APIService.post(
      `${ApiRoutes.forgotPasswordBase}/forgot-password`,
      { email: data.email },
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        if (res?.status === 204 || !res?.data) {
          toast({
            title: 'Email Sent Successfully',
            variant: 'default',
            description: 'Please check your inbox.',
          })
          callback?.({ message: 'Password reset email sent!' }, null)
          return
        }
        callback?.(null, { message: 'Unexpected response from server' })
        toast({
          title: 'Unexpected Error',
          variant: 'destructive',
          description: 'An unexpected error occurred.',
        })
      })
      .catch((error: any) => {
        console.error('API Error:', error)
        callback?.(null, error)
        toast({
          title: 'Forgot Password Failed',
          variant: 'destructive',
          description: error?.message || 'An error occurred while requesting the password reset.',
        })
      })
  }

  const getCurrentDetails = (callback?: (data: any) => void) => {
    APIService.get(`${ApiRoutes.base}/me`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data || {}
        dispatch({ type: 'SET_USER_DETAILS', payload: response })
        if (typeof callback === 'function') {
          callback(response)
        }
      })
      .catch((error: any) => {
        console.log(error, 'error')

        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.detail,
        })
      })
  }

  return {
    state,
    actions: {
      getAll,
      updateProfile,
      forgotPassword,
      getCurrentDetails,
    },
  }
})
