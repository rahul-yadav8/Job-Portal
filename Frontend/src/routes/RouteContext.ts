import { useReducer } from 'react'
import { APIService, ContextContainer } from '@services'
import { LocalStorage } from '@services'
import { toast } from '@/components/ui/use-toast'
import { IMEDetails } from '@/types/profile.interface'

export type StateType = {
  hasSession: boolean
  role_type?: string
  UserDetails: IMEDetails[]
}

const ApiRoutes = {
  base: `/api/auth`,
}

const initialState: StateType = {
  hasSession: false,
  role_type: undefined,
  UserDetails: [],
}

const reducer = (
  state: StateType,
  action: {
    type: string
    payload?: any
  }
) => {
  const { type } = action
  switch (type) {
    case 'LOGIN':
      return { ...state, hasSession: true }
    case 'SET_USER_DETAILS': {
      const { payload } = action
      return { ...state, UserDetails: payload }
    }
    case 'LOGOUT':
      LocalStorage.clear()
      window.location.replace('/login')
      return { ...state, hasSession: false }
    default:
      return state
  }
}

export const { useContext: useAuth, Provider: AuthProvider } = ContextContainer(() => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    hasSession: !!LocalStorage.read('access_token'),
    role_type: LocalStorage.read('role_type'),
  })

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

  const logout = (callback?: (data?: any, error?: any) => void) => {
    APIService.get(`${ApiRoutes.base}/logout`, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({ type: 'LOGOUT' })
        toast({
          title: 'Logged Out Successfully',
          variant: 'default',
          description: 'Please login to continue.',
        })
        callback?.({ message: 'Logged out successfully!' }, null)
        return
      })
      .catch((error: any) => {
        console.error('API Error:', error)
        callback?.(null, error)
        toast({
          title: 'Logout Failed',
          variant: 'destructive',
          description: error?.message || 'An error occurred while logging out.',
        })
      })
  }

  return {
    state,
    actions: {
      getCurrentDetails,
      logout,
    },
  }
})
