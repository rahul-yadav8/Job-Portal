import { useEffect, Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '.'
import { ProtectedLayout } from '@/templates'
import { toast } from '@/components/ui/use-toast'
import { APP_ROUTES } from '@/data/sidelinks'
import { getFirstRouteByRole, Role } from '@/utils/roleConfig'

const SessionLayout = lazy(() => import('../pages/sessions/SessionLayout'))
const AccessDenied = lazy(() => import('../pages/sessions/AccessDenied'))
const NotFound = lazy(() => import('../pages/sessions/NotFound'))

export const RootRoutes = () => {
  const {
    state: { hasSession, role_type },
  } = useAuth()

  useEffect(() => {
    if (!hasSession) {
      console.log('Session Expired!')
      toast({
        title: 'Session expired',
        description: 'Please login again to continue.',
      })
    } else if (!role_type) {
      toast({
        title: 'Invalid role',
        description: 'Please contact support.',
      })
    }
  }, [hasSession, role_type])

  if (!hasSession || !role_type) {
    return (
      <Suspense>
        <SessionLayout />
      </Suspense>
    )
  }
  const firstRoute = getFirstRouteByRole(role_type as Role)

  return (
    <Suspense>
      <Routes>
        <Route path='/' element={<Navigate to={firstRoute} replace />} />
        {/* public routes */}
        <Route path='/access-denied' element={<AccessDenied />} />
        <Route path='/not-found' element={<NotFound />} />
        {/* dynamic routes based on role */}
        <Route element={<ProtectedLayout />}>
          {APP_ROUTES.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                route.roles.includes(role_type as Role) ? (
                  route.element
                ) : (
                  <Navigate to='/access-denied' replace />
                )
              }
            />
          ))}
        </Route>
        <Route path='*' element={<Navigate to='/not-found' replace />} />
      </Routes>
    </Suspense>
  )
}
