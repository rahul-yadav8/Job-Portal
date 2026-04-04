import { OrgUsersProvider } from './OrgContext'
import OrgUsers from './OrgUsers'

export default function OrgLayout() {
  return (
    <OrgUsersProvider>
      <OrgUsers />
    </OrgUsersProvider>
  )
}
