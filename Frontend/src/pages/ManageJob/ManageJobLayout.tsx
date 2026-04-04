import ManageJob from './ManageJob'
import { ManageJobProvider } from './ManageJobContext'

export default function ManageJobLayout() {
  return (
    <ManageJobProvider>
      <ManageJob />
    </ManageJobProvider>
  )
}
