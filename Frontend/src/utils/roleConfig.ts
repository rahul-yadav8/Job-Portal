import { APP_ROUTES } from '@/data/sidelinks'

export type Role = 'employer' | 'jobseeker'

export const getSidebarByRole = (role?: Role) => {
  if (!role) return []

  return APP_ROUTES.filter((link) => link.roles.includes(role))
}

export const getFirstRouteByRole = (role?: Role) => getSidebarByRole(role)[0]?.path.replace('/*', '') ?? '/'

export const getAdminType = (role?: Role) => {
  if (role === 'employer') return 'employer'
  if (role === 'jobseeker') return 'jobseeker'
  return null
}
