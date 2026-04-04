import Job from './Job'
import { JobProvider } from './JobContext'

export default function JobLayout() {
  return (
    <JobProvider>
      <Job />
    </JobProvider>
  )
}
