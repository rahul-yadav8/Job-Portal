import { format } from 'date-fns'

export const ActivationStatus = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'invited', label: 'Invited' },
]

export const pumpTypeOption = [
  { label: 'Pump', value: 'Pump' },
  { label: 'Compressor', value: 'Compressor' },
  { label: 'Turbine', value: 'Turbine' },
  { label: 'Fan', value: 'Fan' },
]
export const CriticalityOption = [
  { label: 'Critical', value: 'Critical' },
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' },
]

export const roleOptions = [
  { label: 'Standard User', value: 'standard-user' },
  { label: 'Tenant Admin', value: 'tenant-admin' },
]

export const createOrganizationOptions = (data: any[] = []) => {
  if (!Array.isArray(data)) return []

  const uniqueMap = new Map()

  data.forEach((item) => {
    if (item?.organization_id && item?.organization_name) {
      uniqueMap.set(item.organization_id, item.organization_name.trim())
    }
  })

  return Array.from(uniqueMap.entries()).map(([id, name]) => ({
    label: name,
    value: id,
  }))
}

export const createPlantOptions = (data: any[] = []) => {
  if (!Array.isArray(data)) return []

  const uniqueMap = new Map()

  data.forEach((item) => {
    if (item?.id && item?.name) {
      uniqueMap.set(item.id, item.name.trim())
    }
  })

  return Array.from(uniqueMap.entries()).map(([id, name]) => ({
    label: name,
    value: id,
  }))
}

export const checkUserTypeMessage = (status: string) => (status === 'active' ? 'Deactivate' : 'Activate')

export const getUserTypeStyle = (status: string) =>
  status === 'active' ? 'bg-destructive hover:bg-destructive/80' : 'bg-green-500 hover:bg-green-500/80'

export const formatDateForAPI = (date?: Date | null): string | null => {
  if (!date) return null
  return format(date, 'yyyy-MM-dd')
}
