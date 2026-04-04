import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer, LocalStorage } from '@/services'
import { ISession, ISessionUser } from '@/types/session.interface'
import { getFirstRouteByRole } from '@/utils/roleConfig'
import { useReducer } from 'react'

const ApiRoutes = {
  base: `/api/auth`,
}

export type StateType = {
  user?: ISessionUser
}

const initialState: StateType = {
  user: undefined,
}

const reducer = (
  state: StateType,
  action: {
    type: string
    payload?: any
  }
) => {
  const { type, payload } = action

  console.log(payload, 'payload')
  switch (type) {
    case 'LOGIN':
      const { token, user } = payload

      // ✅ store correct token
      LocalStorage.write('access_token', token)

      // ❌ remove these (not coming from backend)
      // LocalStorage.write('refresh_token', token.refresh_token)
      // LocalStorage.write('role_type', token.app_role)

      LocalStorage.write('role_type', user.role)

      return {
        ...state,
        user,
      }
    default:
      return state
  }
}

export const { useContext: useSession, Provider: SessionProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  const login = async (
    data: { email: string; password: string },
    callback?: (data?: { session: ISession } | null, error?: any) => void
  ) => {
    try {
      const res: any = await APIService.post(
        `${ApiRoutes.base}/login`,
        data,
        import.meta.env.VITE_API_ENDPOINT
      )

      const response = res.data

      const user = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
        avatar: response.avatar,
        companyName: response.companyName,
        companyDescription: response.companyDescription,
        companyLogo: response.companyLogo,
        resume: response.resume,
      }

      dispatch({
        type: 'LOGIN',
        payload: {
          token: response.token,
          user,
        },
      })

      toast({
        title: 'Login Successful',
        variant: 'default',
        description: 'You have successfully logged in.',
      })

      callback && callback({ session: response }, null)

      setTimeout(() => {
        window.location.replace(getFirstRouteByRole(response.role))
      }, 100)
    } catch (error: any) {
      console.log('LOGIN ERROR:', error)

      callback && callback(null, error)

      toast({
        title: 'Invalid Credentials',
        variant: 'destructive',
        description: 'The credentials provided are invalid',
      })
    }
  }

  const forgotPassword = (data: { email: string }, callback?: (response: any, error?: any) => void) => {
    if (!data.email) {
      callback?.(null, { message: 'Email is required' })
      return
    }

    APIService.post(
      `${ApiRoutes.base}/forgot-password?email=${data.email}`,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        if (res?.status === 200 || !res?.data) {
          toast({
            title: 'Email Sent Successfully',
            variant: 'default',
            description: 'Please check your inbox.',
          })
          callback?.({ message: 'Password reset email sent!' }, null)
          return
        }
      })
      .catch((error: any) => {
        console.error('API Error:', error)
        callback?.(null, error)
        toast({
          title: 'Forgot Password Failed',
          variant: 'destructive',
          description: error?.detail,
        })
      })
  }

  const reset = (
    data: { password: string; resetHash: string },
    callback?: (data?: any, error?: any) => void
  ) => {
    APIService.post(
      `${ApiRoutes.base}/reset-password/${data.resetHash}?new_password=${data.password}`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        toast({
          title: 'Password Updated',
          variant: 'default',
          description: res.message || 'Please login to continue.',
        })

        callback?.({ message: 'Password reset email sent!' }, null)
        return
      })

      .catch((error: any) => {
        console.error('API Error:', error)
        callback?.(null, error)
        toast({
          title: 'Forgot Password Failed',
          variant: 'destructive',
          description: error?.detail || 'An error occurred while requesting the password reset.',
        })
      })
  }

  const create = (
    data: { password: string; inviteToken: string },
    callback?: (data?: any, error?: any) => void
  ) => {
    APIService.post(`${ApiRoutes.base}/register`, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        if (res?.status === 204 || !res?.data) {
          toast({
            title: 'Password Updated',
            variant: 'default',
            description: 'Please login to continue.',
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

  const acceptInvite = (
    data: {
      first_name: string
      last_name: string
      password: string
      inviteToken: string
    },
    callback?: (data?: any, error?: any) => void
  ) => {
    const payload = {
      first_name: data.first_name.trim().toLowerCase(),
      last_name: data.last_name.trim().toLowerCase(),
      password: data.password,
    }

    APIService.post(
      `${ApiRoutes.base}/accept-invite/${data.inviteToken}`,
      payload,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        // if (res?.status === 204 || !res?.data) {
        toast({
          title: 'Invite Accepted',
          variant: 'default',
          description: 'Please login to continue.',
        })
        callback?.({ message: 'Invite accepted!' }, null)
        return
        // }
        // callback?.(null, { message: 'Unexpected response from server' })
        // toast({
        //   title: 'Unexpected Error',
        //   variant: 'destructive',
        //   description: 'An unexpected error occurred.',
        // })
      })
      .catch((error: any) => {
        console.error('API Error:', error)
        callback?.(null, error)
        toast({
          title: 'Accept Invite Failed',
          variant: 'destructive',
          description: error?.message || 'An error occurred while accepting the invite.',
        })
      })
  }

  return {
    state,
    actions: {
      login,
      forgotPassword,
      reset,
      create,
      acceptInvite,
    },
  }
})
