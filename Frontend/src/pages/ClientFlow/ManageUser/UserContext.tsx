import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'
import { stringify } from 'qs'

const ApiRoutes = {
  default: `/api/v1`,
  base: `/api/v1/users`,
}

export type UserList = {
  _id: string
  name?: string
  email?: string
  role?: string
}

export type Roles = {
  id: string
  name: string
  slug: string
}

export type StateType = {
  UserList: UserList[]
  RolesList: Roles[]
}

const initialState: StateType = {
  UserList: [],
  RolesList: [],
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
    case 'SET_ROLE_LIST':
      return {
        ...state,
        RolesList: payload,
      }

    default:
      return state
  }
}

export const { useContext: useManageUsers, Provider: ManageUserProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  const getUsers = (
    org_id: string,
    query: { [key: string]: any } = { limit: 100 },
    callback?: (data: any) => void,
    UserId?: string
  ) => {
    const queryStr = stringify(query)
    const filters = queryStr ? `?${queryStr}` : ''

    APIService.get(
      `${ApiRoutes.base}/${org_id}${UserId ? `/${UserId}` : ''}${filters}`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response = res.data
        console.log(res, 'res')

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

  const getRoles = (org_id: string, callback?: (data: any) => void) => {
    APIService.get(`${ApiRoutes.base}/${org_id}/roles`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data
        console.log(res, 'res')

        dispatch({ type: 'SET_ROLE_LIST', payload: response })

        if (typeof callback === 'function') {
          callback(response)
        }
      })
      .catch((error: any) => {
        // if (typeof error === 'object' && error.status) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.detail,
        })
        // }
      })
  }

  const updateUser = (
    org_id: string,
    user_id: string,
    data: { first_name?: string; last_name?: string; status?: string },
    callback?: (data: any) => void
  ) => {
    APIService.patch(`${ApiRoutes.base}/${org_id}/${user_id}`, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data
        console.log(res, 'res')

        dispatch({ type: 'SET_USER_LIST', payload: response })

        if (typeof callback === 'function') {
          callback(response)
        }
      })
      .catch((error: any) => {
        // if (typeof error === 'object' && error.status) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.detail,
        })
        // }
      })
  }

  const SendInvite = (
    org_id: string,
    data: { full_name: string; email: string },
    callback?: (data: any) => void
  ) => {
    APIService.post(`${ApiRoutes.base}/${org_id}/invite`, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data?.users || res.data || []
        console.log(response, 'response')
        dispatch({ type: 'SET_USER_LIST', payload: response })

        if (typeof callback === 'function') {
          callback(response)
          toast({
            title: 'Invitation Sent',
            variant: 'default',
            description: 'The user will receive an email to accept the invitation.',
          })
        }
      })
      .catch((error: any) => {
        console.log(error, 'error')
        // if (typeof error === 'object' && error.status) {
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

  return {
    state,
    actions: {
      getUsers,
      SendInvite,
      reInvite,
      updateUser,
      getRoles,
    },
  }
})
