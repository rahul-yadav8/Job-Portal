import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'

// =========================
// API ROUTES
// =========================
const ApiRoutes = {
  getPredictions: '/api/v1/predictions',
  getPredictionHistory: '/api/v1/predictions/history',
}

// =========================
// TYPES
// =========================
type Prediction = {
  id: string
  title: string
  value: number
  created_at: string
}

export type StateType = {
  predictions: Prediction[] // current predictions
  history: Prediction[] // past predictions
  loading: boolean
}

// =========================
// INITIAL STATE
// =========================
const initialState: StateType = {
  predictions: [],
  history: [],
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

    case 'SET_PREDICTIONS':
      return {
        ...state,
        predictions: payload || [],
      }

    case 'SET_HISTORY':
      return {
        ...state,
        history: payload || [],
      }

    default:
      return state
  }
}

// =========================
// CONTEXT
// =========================
export const { useContext: usePredictions, Provider: PredictionsProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, initialState)

  // =========================
  // GET CURRENT PREDICTIONS
  // =========================
  const getPredictions = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const res: any = await APIService.get(
        ApiRoutes.getPredictions,
        undefined,
        import.meta.env.VITE_API_ENDPOINT
      )

      dispatch({
        type: 'SET_PREDICTIONS',
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
  // GET PREDICTION HISTORY
  // =========================
  const getPredictionHistory = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const res: any = await APIService.get(
        ApiRoutes.getPredictionHistory,
        undefined,
        import.meta.env.VITE_API_ENDPOINT
      )

      dispatch({
        type: 'SET_HISTORY',
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
      getPredictions,
      getPredictionHistory,
    },
  }
})
