import { ManageUserProvider } from './UserContext'
import User from './User'
import UserDetails from './UserDetails'
import { useRouteQuery } from '@/hooks/useRouteQuery'

export default function UserLayout() {
  const { params } = useRouteQuery()

  const userId = params.id

  return <ManageUserProvider>{userId ? <UserDetails id={userId} /> : <User />}</ManageUserProvider>
}
