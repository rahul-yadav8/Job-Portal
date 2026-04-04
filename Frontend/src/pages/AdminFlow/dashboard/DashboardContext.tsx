import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'

// =========================
// API ROUTES
// =========================
const ApiRoutes = {
  dashboardStats: '/api/v1/dashboard/stats',
  dashboardActivity: '/api/v1/dashboard/activity',
}

// =========================
// TYPES
// =========================
type DashboardStats = {
  totalUsers: number
  totalOrganizations: number
  activeOrganizations: number
  inactiveOrganizations: number
}

type Activity = {
  id: string
  message: string
  created_at: string
}

export type StateType = {
  stats: DashboardStats | null
  activityList: Activity[]
  loading: boolean
}

// =========================
// INITIAL STATE
// =========================
const initialState: StateType = {
  stats: null,
  activityList: [],
  loading: false,
}

// =========================
// REDUCER
// =========================
const reducer = (state: StateType, action: { type: string; payload?: any }) => {
  const { type, payload } = action

  switch (type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: payload,
      }

    case 'SET_STATS':
      return {
        ...state,
        stats: payload,
      }

    case 'SET_ACTIVITY':
      return {
        ...state,
        activityList: payload || [],
      }

    default:
      return state
  }
}

// =========================
// CONTEXT
// =========================
export const { useContext: useDashboard, Provider: DashboardProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, initialState)

  // =========================
  // GET DASHBOARD STATS
  // =========================
  const getDashboardStats = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const res: any = await APIService.get(
        ApiRoutes.dashboardStats,
        undefined,
        import.meta.env.VITE_API_ENDPOINT
      )

      dispatch({
        type: 'SET_STATS',
        payload: res.data,
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error?.message,
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // =========================
  // GET ACTIVITY LIST
  // =========================
  const getActivity = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const res: any = await APIService.get(
        ApiRoutes.dashboardActivity,
        undefined,
        import.meta.env.VITE_API_ENDPOINT
      )

      dispatch({
        type: 'SET_ACTIVITY',
        payload: res.data,
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        variant: 'destructive',
        description: error?.message,
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return {
    state,
    actions: {
      getDashboardStats,
      getActivity,
    },
  }
})
