import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'
import { stringify } from 'qs'
import { IAssets } from '@/types/tenant.interface'

const ApiRoutes = {
  base: `/api/v1/orgs/`,
  module: 'assets',
}

export type StateType = {
  allAssets: IAssets[]
  allPlants: any[]
  selectedAsset: IAssets | null
}

const initialState: StateType = {
  allAssets: [],
  allPlants: [],
  selectedAsset: null,
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
    case 'GET_ALL_ASSETS':
      return {
        ...state,
        allAssets: payload,
      }

    case 'GET_ALL_PLANTS':
      return {
        ...state,
        allPlants: payload,
      }
    case 'GET_SELECTED_ASSET':
      return {
        ...state,
        selectedAsset: payload,
      }

    default:
      return state
  }
}

export const { useContext: useAsset, Provider: AssetProvider } = ContextContainer(() => {
  const { toast } = useToast()

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  const getAllPlants = (callback?: (data: any) => void) => {
    APIService.get(
      `${ApiRoutes.base}${localStorage.getItem('org_id')}/plants/`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response: any = res?.data

        dispatch({ type: 'GET_ALL_PLANTS', payload: response })

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

  const getAllAssets = (plantId: string, query: { [key: string]: any }, callback?: (data: any) => void) => {
    const queryStr = stringify(query)
    const filters = queryStr ? `?${queryStr}` : ''

    APIService.get(
      `${ApiRoutes.base}${localStorage.getItem('org_id')}/plants/${plantId}/assets/${filters}`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    ).then((res: any) => {
      const response = res.data
      dispatch({ type: 'GET_ALL_ASSETS', payload: response })

      if (typeof callback === 'function') {
        callback(response)
      }
    })
  }

  const createAsset = (plantId: string, data: any, callback?: (data: any) => void) => {
    APIService.post(
      `${ApiRoutes.base}${localStorage.getItem('org_id')}/plants/${plantId}/assets/`,
      data,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response = res.data

        toast({
          title: 'Asset Created',
          variant: 'default',
          description: 'Asset created successfully',
        })

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

  const updateAsset = (plantId: string, assetsId: string, payload: any, callback?: (data: any) => void) => {
    APIService.put(
      `${ApiRoutes.base}${localStorage.getItem('org_id')}/plants/${plantId}/assets/${assetsId}`,
      payload,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response = res.data

        toast({
          title: 'Asset Updated',
          variant: 'default',
          description: 'Asset updated successfully',
        })

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

  const getAssetById = (plantId: string, assetsId: string, callback?: (data: any) => void) => {
    APIService.get(
      `${ApiRoutes.base}${localStorage.getItem('org_id')}/plants/${plantId}/assets/${assetsId}`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )

      .then((res: any) => {
        const response = res.data

        dispatch({
          type: 'GET_SELECTED_ASSET',
          payload: response,
        })
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

  const handleDeactivateAsset = (
    plantsId: string,
    assetId: string,
    payload: any,
    callback?: (data: any) => void
  ) => {
    APIService.patch(
      `${ApiRoutes.base}${localStorage.getItem('org_id')}/plants/${plantsId}/${ApiRoutes.module}/${assetId}/status`,
      payload,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        toast({
          title: 'Asset Deactivated',
          variant: 'default',
          description: 'Asset deactivated successfully',
        })

        if (typeof callback === 'function') {
          callback(res.data)
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

  return {
    state,
    actions: {
      getAllAssets,
      createAsset,
      handleDeactivateAsset,
      getAllPlants,
      getAssetById,
      updateAsset,
    },
  }
})
