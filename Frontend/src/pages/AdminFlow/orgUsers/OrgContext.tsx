import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'
import { stringify } from 'qs'

const ApiRoutes = {
  initial: `/api/v1/organizations`,
  base: `/api/v1/organizations/org-users`,
  deactivateOrgUser: (orgId: string, userId: string) =>
    `/api/v1/organizations/${orgId}/users/${userId}/deactivate`,
  reInvite: (orgId: string) => `/api/v1/organizations/${orgId}/reinvite-tenant-admin`,
}

export type OrgUser = {
  user_id: string
  name?: string
  email?: string
  org_role?: string
  organization_id?: string
  organization_name?: string
  status?: string
  created_at?: string
}

export type StateType = {
  orgUsers: OrgUser[]
}

const initialState: StateType = {
  orgUsers: [],
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
    case 'SET_ORG_USERS':
      return {
        ...state,
        orgUsers: payload,
      }

    default:
      return state
  }
}

export const { useContext: useOrgUsers, Provider: OrgUsersProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  // get the users list
  const getOrgUsers = (query: { [key: string]: any } = { query: '' }, callback?: (data: any) => void) => {
    const queryStr = stringify(query, {
      arrayFormat: 'repeat',
    })

    APIService.get(`${ApiRoutes.base}?${queryStr}`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data || []
        dispatch({ type: 'SET_ORG_USERS', payload: response })

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

  // for delete the org user
  const deleteOrgUser = (orgId: string, userId: string, callback?: (data: any) => void) => {
    APIService.delete(
      ApiRoutes.deactivateOrgUser(orgId, userId),
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response = res.data || {}

        dispatch({
          type: 'REMOVE_ORG_USER',
          payload: userId, // remove by user_id
        })

        toast({
          title: 'Success',
          description: 'Organization user deactivated successfully',
        })

        callback?.(response)
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        callback?.(error)
      })
  }
  const toggleActivity = (orgId: string, userId: string, callback?: (data: any) => void) => {
    APIService.patch(
      `${ApiRoutes.initial}/${orgId}/users/${userId}/status`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response = res.data || {}
        toast({
          title: 'User Status Updated',
          description: `The organization user has been updated successfully.`,
        })

        callback?.(response)
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        callback?.(error)
      })
  }

  // for reinvite the user
  const reInviteOrgUser = (orgId: string, callback?: (data: any) => void) => {
    APIService.post(ApiRoutes.reInvite(orgId), undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data || {}

        toast({
          title: 'Re-invite Sent',
          description: 'The re-invite email has been sent successfully.',
        })

        callback?.(response)
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.detail,
        })

        callback?.(error)
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

  return {
    state,
    actions: {
      getOrgUsers,
      deleteOrgUser,
      reInviteOrgUser,
      updateUser,
      toggleActivity,
    },
  }
})
