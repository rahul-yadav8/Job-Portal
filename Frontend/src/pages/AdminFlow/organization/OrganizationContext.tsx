import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { stringify } from 'qs'
import { useReducer } from 'react'

const ApiRoutes = {
  base: '/api/v1/organizations',
  create: '/api/v1/organizations',
  delete: (id: string) => `/api/v1/organizations/${id}`,
  getAllOrganizationUsers: (id: string) => `/api/v1/organizations/${id}`,
  update: (id: string) => `/api/v1/organizations/${id}`,
}

type IOrganization = {
  id: string
  organization: string
  slug: string
  created_at: string
  status: 'active' | 'inactive'
}

export type StateType = {
  organizationList: IOrganization[]
  organizationUsers: any[]
  selectedOrganization: any | null
}

const initialState: StateType = {
  organizationList: [],
  organizationUsers: [],
  selectedOrganization: null,
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
        organizationList: payload?.data || [],
      }

    case 'UPDATE_ORGANIZATION_STATUS':
      return {
        ...state,
        organizationList: Array.isArray(state.organizationList)
          ? state.organizationList.map((org) =>
              org.id === payload.id ? { ...org, status: payload.status } : org
            )
          : [],
      }

    case 'GET_ORGANIZATION_USERS':
      return {
        ...state,
        selectedOrganization: payload,
        organizationUsers: payload?.users || [],
      }

    default:
      return state
  }
}

export const { useContext: useOrganization, Provider: OrganizationProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  // =========================
  // GET ORGANIZATIONS
  // =========================
  const getAll = (query: { [key: string]: any } = { query: '' }, callback?: (data: any) => void) => {
    const queryStr = stringify(query)
    APIService.get(`${ApiRoutes.base}?${queryStr}`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({
          type: 'GET_LIST',
          payload: res,
        })

        if (typeof callback === 'function') {
          callback(res)
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

  // =========================
  // CREATE ORGANIZATION
  // =========================
  const createOrganization = (
    data: {
      organization: string
      email: string
    },
    callback?: (error: any, data: any) => void
  ) => {
    APIService.post(ApiRoutes.create, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response: any = res.data

        toast({
          title: 'Success',
          description: 'Organization created successfully',
        })

        if (typeof callback === 'function') {
          callback(null, response)
        }
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        if (typeof callback === 'function') {
          callback(error, null)
        }
      })
  }

  // =========================
  // UPDATE ORGANIZATION
  // =========================
  const updateOrganization = (
    id: string,
    data: { organization: string },
    callback?: (data: any) => void
  ): Promise<void> => {
    return APIService.patch(ApiRoutes.update(id), data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data

        dispatch({
          type: 'ADD_ORGANIZATION',
          payload: response?.data,
        })

        toast({
          title: 'Success',
          description: 'Organization updated successfully',
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
  // DELETE ORGANIZATION
  // =========================
  const organizationStatusUpdate = (id: string, data: any, callback?: (error: any, data: any) => void) => {
    APIService.patch(ApiRoutes.delete(id), data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({
          type: 'UPDATE_ORGANIZATION_STATUS',
          payload: {
            id: id,
            status: data.status,
          },
        })

        toast({
          title: 'Success',
          description:
            data.status === 'inactive'
              ? 'Organization deactivated successfully'
              : 'Organization activated successfully',
        })

        if (typeof callback === 'function') {
          callback(null, res.data)
        }
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        if (typeof callback === 'function') {
          callback(error, null)
        }
      })
  }

  // get all organization users details
  const getAllOrganizationUsers = (id: string, callback?: (error: any, data: any) => void) => {
    APIService.get(ApiRoutes.getAllOrganizationUsers(id), undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({
          type: 'GET_ORGANIZATION_USERS',
          payload: res.data,
        })

        if (typeof callback === 'function') {
          callback(null, res.data)
        }
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        if (typeof callback === 'function') {
          callback(error, null)
        }
      })
  }
  return {
    state,
    actions: {
      getAll,
      createOrganization,
      organizationStatusUpdate,
      getAllOrganizationUsers,
      updateOrganization,
    },
  }
})
