import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'
import { stringify } from 'qs'
import { IPlants } from '@/types/tenant.interface'

const ApiRoutes = {
  base: `/api/v1/orgs/`,
  module: 'plants',
}

export type StateType = {
  allPlants: IPlants[]
}

const initialState: StateType = {
  allPlants: [],
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
    case 'GET_ALL_PLANTS':
      return {
        ...state,
        allPlants: payload,
      }

    default:
      return state
  }
}

export const { useContext: usePlant, Provider: PlantProvider } = ContextContainer(() => {
  const { toast } = useToast()

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  const getAllPlants = (
    org_id: string,
    query: { [key: string]: any } = { query: '' },
    callback?: (data: any) => void,
    getOnePlant?: string
  ) => {
    const queryStr = stringify(query)
    const filters = queryStr ? `?${queryStr}` : ''

    APIService.get(
      `${ApiRoutes.base}${org_id}/${ApiRoutes.module}/${getOnePlant || ''}${filters}`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response: any = res.data
        console.log(response, 'response')

        dispatch({ type: 'GET_ALL_PLANTS', payload: response })

        if (typeof callback === 'function') {
          callback(response)
        }
      })
      .catch((error: any) => {
        // if (typeof error === 'object' && error.status) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })
        // }
      })
  }

  const createPlants = (
    org_id: string,
    data: { plantName: string; location: string; timeZone: string },
    query: { [key: string]: any } = { limit: 100 },
    callback?: (data: any) => void
  ) => {
    const queryStr = stringify(query)

    console.log('Plant API', queryStr)

    APIService.post(
      `${ApiRoutes.base}${org_id}/${ApiRoutes.module}/`,
      {
        name: data.plantName,
        location: data.location,
        timezone: data.timeZone,
        settings: {
          timezone: data.timeZone,
        },
      },
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response: any = res.data

        // dispatch({ type: 'GET_ALL_PLANTS', payload: response })

        if (typeof callback === 'function') {
          toast({
            title: 'Plant Created',
            variant: 'default',
            description: 'Plant created successfully',
          })
          callback(response)
        }
      })
      .catch((error: any) => {
        // if (typeof error === 'object' && error.status) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })
        // }
      })
  }

  const updatePlant = (
    org_id: string,
    data: { location: string; timeZone: string },
    query: { [key: string]: any } = { limit: 100 },
    callback?: (data: any) => void,
    updatePlantId: string
  ) => {
    const queryStr = stringify(query)

    console.log('Plant API', queryStr)

    APIService.put(
      `${ApiRoutes.base}${org_id}/${ApiRoutes.module}/${updatePlantId}`,
      {
        location: data.location,
        timezone: data.timeZone,
        settings: {
          timezone: data.timeZone,
        },
      },
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response: any = res.data

        if (typeof callback === 'function') {
          toast({
            title: 'Plant Updated!',
            variant: 'default',
            description: 'Plant Updated successfully',
          })
          callback(response)
        }
      })
      .catch((error: any) => {
        // if (typeof error === 'object' && error.status) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })
        // }
      })
  }

  const handleDeactivate = (
    plantId: string,
    data: { confirmation_name: string },
    callback?: (data: any) => void
  ) => {
    APIService.patch(
      `${ApiRoutes.base}${localStorage.getItem('org_id')}/${ApiRoutes.module}/${plantId}/status`,
      { confirmation_name: data.confirmation_name },
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response: any = res.data
        if (typeof callback === 'function') {
          toast({
            title: 'Plant Status',
            variant: 'default',
            description: response?.message,
          })
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
      getAllPlants,
      createPlants,
      updatePlant,
      handleDeactivate,
    },
  }
})
