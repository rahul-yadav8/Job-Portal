import Not from '@/assets/Pages/NotFound.png'
import { Button } from '@/components/custom/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
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
      <img src={Not} alt='Access Denied' className='w-fit md:h-[500px]' />
      <Button onClick={handleBack} size='lg'>
        <ArrowLeft />
        Go Back
      </Button>
    </div>
  )
}
