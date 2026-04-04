import Access from '@/assets/Pages/Access.png'
import { Button } from '@/components/custom/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function AccessDenied() {
  const navigate = useNavigate()

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }
  return (
    <div className='flex h-screen flex-col items-center justify-center gap-4 bg-background'>
      <img src={Access} alt='Access Denied' className='w-fit md:h-[500px]' />
      <span className='text-clip text-center text-sm font-medium leading-4 text-muted-foreground md:text-2xl'>
        Access Denied! You don't have permission to access this resource
      </span>
      <Button onClick={handleBack} size='lg'>
        <ArrowLeft />
        Go Back
      </Button>
    </div>
  )
}
