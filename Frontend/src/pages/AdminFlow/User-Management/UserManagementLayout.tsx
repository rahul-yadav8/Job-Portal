import { UserManagementProvider } from './UsersContext'
import UserManagement from './UserManagement'

export default function UserManagementLayout() {
  return (
    <UserManagementProvider>
      <UserManagement />
    </UserManagementProvider>
  )
}
