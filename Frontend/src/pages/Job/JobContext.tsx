import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { stringify } from 'qs'
import { useReducer } from 'react'

const ApiRoutes = {
  base: '/api/v1/jobs',
  create: '/api/v1/jobs',
  delete: (id: string) => `/api/v1/jobs/${id}`,
  getAllJobs: (id: string) => `/api/v1/jobs/${id}`,
  update: (id: string) => `/api/v1/jobs/${id}`,
}

type IJob = {
  id: string
  title: string
  description: string
  location: string
  salary?: string
  status: 'open' | 'closed'
  created_at: string
}

export type StateType = {
  jobList: IJob[]
  selectedJob: IJob | null
}

const initialState: StateType = {
  jobList: [],
  selectedJob: null,
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
        jobList: payload?.data || [],
      }

    case 'ADD_JOB':
      return {
        ...state,
        jobList: [payload, ...state.jobList],
      }

    case 'UPDATE_JOB':
      return {
        ...state,
        jobList: state.jobList.map((job) => (job.id === payload.id ? { ...job, ...payload } : job)),
      }

    case 'UPDATE_JOB_STATUS':
      return {
        ...state,
        jobList: state.jobList.map((job) =>
          job.id === payload.id ? { ...job, status: payload.status } : job
        ),
      }

    default:
      return state
  }
}

export const { useContext: useJob, Provider: JobProvider } = ContextContainer(() => {
  const { toast } = useToast()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  // =========================
  // GET JOBS
  // =========================
  const getAll = (query: { [key: string]: any } = { query: '' }, callback?: (data: any) => void) => {
    const queryStr = stringify(query)

    APIService.get(`${ApiRoutes.base}?${queryStr}`, undefined, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({
          type: 'GET_LIST',
          payload: res,
        })

        callback?.(res)
      })
      .catch((error: any) => {
        callback?.(null)
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })
      })
  }

  // =========================
  // CREATE JOB
  // =========================
  const createJob = (data: Partial<IJob>, callback?: (error: any, data: any) => void) => {
    APIService.post(ApiRoutes.create, data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data

        dispatch({
          type: 'ADD_JOB',
          payload: response?.data,
        })

        toast({
          title: 'Success',
          description: 'Job created successfully',
        })

        callback?.(null, response)
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        callback?.(error, null)
      })
  }

  // =========================
  // UPDATE JOB
  // =========================
  const updateJob = (id: string, data: Partial<IJob>, callback?: (data: any) => void): Promise<void> => {
    return APIService.patch(ApiRoutes.update(id), data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        const response = res.data

        dispatch({
          type: 'UPDATE_JOB',
          payload: response?.data,
        })

        toast({
          title: 'Success',
          description: 'Job updated successfully',
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
  // UPDATE JOB STATUS
  // =========================
  const updateJobStatus = (id: string, data: any, callback?: (error: any, data: any) => void) => {
    APIService.patch(ApiRoutes.delete(id), data, import.meta.env.VITE_API_ENDPOINT)
      .then((res: any) => {
        dispatch({
          type: 'UPDATE_JOB_STATUS',
          payload: {
            id,
            status: data.status,
          },
        })

        toast({
          title: 'Success',
          description: data.status === 'closed' ? 'Job closed successfully' : 'Job opened successfully',
        })

        callback?.(null, res.data)
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.message,
        })

        callback?.(error, null)
      })
  }

  return {
    state,
    actions: {
      getAll,
      createJob,
      updateJob,
      updateJobStatus,
    },
  }
})
