import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'
import { stringify } from 'qs'

const ApiRoutes = {
  base: `/api/v1`,
}

export type UserList = {
  _id: string
  name?: string
  email?: string
  role?: string
}

export type StateType = {
  UserList: UserList[]
}

const initialState: StateType = {
  UserList: [],
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
    case 'SET_USER_LIST':
      return {
        ...state,
        UserList: payload,
      }

    default:
      return state
  }
}

export const { useContext: useUserManagement, Provider: UserManagementProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  const getUsers = (query: { [key: string]: any } = { limit: 100 }, callback?: (data: any) => void) => {
    const queryStr = stringify(query)

    APIService.get(`${ApiRoutes.base}/list?${queryStr}`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data?.users || res.data || []

        dispatch({ type: 'SET_USER_LIST', payload: response })

        if (typeof callback === 'function') {
          callback(response)
        }
      })
      .catch((error: any) => {
        // if (typeof error === 'object' && error.status) {
        callback?.(null)
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })
        // }
      })
  }

  const SendInvite = (data: { full_name: string; email: string }, callback?: (data: any) => void) => {
    APIService.post(`${ApiRoutes.base}/invite`, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data?.users || res.data || []
        console.log(response, 'response')
        dispatch({ type: 'SET_USER_LIST', payload: response })

        if (typeof callback === 'function') {
          callback(response)
          toast({
            title: 'Invited',
            variant: 'default',
            description: 'Invitation Sent Successfully',
          })
        }
      })
      .catch((error: any) => {
        console.log(error, 'error')
        // if (typeof error === 'object' && error.status) {
        callback?.(null)
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.detail,
        })
        // }
      })
  }

  const reInvite = (data: { id: string }, callback?: (data: any) => void) => {
    APIService.post(`${ApiRoutes.base}/${data.id}/re-invite`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        toast({
          title: 'Re-invite Sent',
          description: 'The re-invite email has been sent successfully.',
        })
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

  const deactivateUser = (data: { id: string; name: string }, callback?: (data: any) => void) => {
    APIService.patch(
      `${ApiRoutes.base}/${data.id}/deactivate`,
      { confirmation_name: data.name },
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        toast({
          title: 'User Deactivated',
          description: `The user ${data.name} has been deactivated successfully.`,
        })
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
  const toggleActivityStatus = (callback?: (data: any) => void, userId: string) => {
    APIService.patch(
      `${ApiRoutes.base}/${userId}/status_update`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        if (typeof callback === 'function') {
          callback(res)
        }
        toast({
          title: 'User Status Updated',
          description: 'The user status was updated successfully.',
        })
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
      getUsers,
      SendInvite,
      deactivateUser,
      reInvite,
      toggleActivityStatus,
    },
  }
})
