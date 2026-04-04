import { JobsProvider } from './Jobs-Context'
import JobsDetails from './JobsDetails'
import Jobs from './Jobs'
import { Route, Routes, useLocation } from 'react-router-dom'
import { parseQueryStrings } from '@/utils/url'
import CreateEditJobs from './CreateEditJobs'

export default function JobsLayout() {
  const location = useLocation()

  const queryParams = parseQueryStrings(location.search)

  return (
    <JobsProvider>
      <Routes>
        <Route path='/' element={queryParams?.jobId ? <JobsDetails /> : <Jobs />} />
        <Route path='/create' element={<CreateEditJobs />} />
        <Route path='/:id/edit' element={<CreateEditJobs />} />
      </Routes>
    </JobsProvider>
  )
}
