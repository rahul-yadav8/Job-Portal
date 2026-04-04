import { CompanyProfileProvider } from './CompanyProfileContext'
import CompanyProfile from './CompanyProfile'

export default function CompanyProfileLayout() {
  return (
    <CompanyProfileProvider>
      <CompanyProfile />
    </CompanyProfileProvider>
  )
}
