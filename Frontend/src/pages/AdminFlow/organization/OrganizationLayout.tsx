import { OrganizationProvider } from './OrganizationContext'
import { useLocation } from 'react-router-dom'
import { parseQueryStrings } from '@/utils/url'
import OrganizationDetails from './OrganizationDetails'
import Organization from './Organization'
export default function OrganizationLayout() {
  const location = useLocation()

  const queryParams = parseQueryStrings(location.search)

  return (
    <OrganizationProvider>
      {queryParams?.organizationId ? <OrganizationDetails /> : <Organization />}
    </OrganizationProvider>
  )
}
