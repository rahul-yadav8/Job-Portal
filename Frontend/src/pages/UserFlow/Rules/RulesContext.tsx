import { useToast } from '@/components/ui/use-toast'
import { APIService, ContextContainer } from '@/services'
import { useReducer } from 'react'

const ApiRoutes = {
  base: `/api/v1/rules`,
}

export type Rule = {
  id: string
  name: string
  description?: string
  status?: string
}

export type StateType = {
  rulesList: Rule[]
}

const initialState: StateType = {
  rulesList: [],
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
    case 'SET_RULES_LIST':
      return {
        ...state,
        rulesList: payload,
      }

    default:
      return state
  }
}

export const { useContext: useRules, Provider: RulesProvider } = ContextContainer(() => {
  const { toast } = useToast()

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
  })

  // Get Rules
  const getRules = (org_id: string, callback?: (data: any) => void) => {
    APIService.get(
      `${ApiRoutes.base}/${org_id}`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response = res.data

        dispatch({
          type: 'SET_RULES_LIST',
          payload: response,
        })

        if (typeof callback === 'function') {
          callback(response)
        }
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.detail || 'Failed to fetch rules',
        })
      })
  }

  // Create Rule
  const createRule = (
    org_id: string,
    data: { name: string; description?: string },
    callback?: (data: any) => void
  ) => {
    APIService.post(
      `${ApiRoutes.base}/${org_id}`,
      data,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response = res.data

        if (typeof callback === 'function') {
          callback(response)
        }

        toast({
          title: 'Success',
          description: 'Rule created successfully',
        })
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.detail || 'Failed to create rule',
        })
      })
  }

  // Update Rule
  const updateRule = (
    org_id: string,
    rule_id: string,
    data: any,
    callback?: (data: any) => void
  ) => {
    APIService.patch(
      `${ApiRoutes.base}/${org_id}/${rule_id}`,
      data,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response = res.data

        if (typeof callback === 'function') {
          callback(response)
        }

        toast({
          title: 'Success',
          description: 'Rule updated successfully',
        })
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.detail || 'Failed to update rule',
        })
      })
  }

  // Delete Rule
  const deleteRule = (
    org_id: string,
    rule_id: string,
    callback?: (data: any) => void
  ) => {
    APIService.delete(
      `${ApiRoutes.base}/${org_id}/${rule_id}`,
      undefined,
      import.meta.env.VITE_API_ENDPOINT
    )
      .then((res: any) => {
        const response = res.data

        if (typeof callback === 'function') {
          callback(response)
        }

        toast({
          title: 'Success',
          description: 'Rule deleted successfully',
        })
      })
      .catch((error: any) => {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: error?.detail || 'Failed to delete rule',
        })
      })
  }

  return {
    state,
    actions: {
      getRules,
      createRule,
      updateRule,
      deleteRule,
    },
  }
})