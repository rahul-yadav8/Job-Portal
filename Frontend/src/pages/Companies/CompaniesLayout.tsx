import Companies from './Companies'
import { CompanyProvider } from './CompanyContext'

export default function CompaniesLayout() {
  return (
    <CompanyProvider>
      <Companies />
    </CompanyProvider>
  )
}
