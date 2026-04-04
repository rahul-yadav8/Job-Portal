import ContentSection from '../../components/ContentSection'
import { Button } from '@/components/custom/button'
import ChangePasswordForm from './ChangePasswordForm'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function ChangePasswordInfo() {
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigate()

  return (
    <div className='mb-10 flex h-full flex-1 flex-col gap-4 '>
      <div className='rounded-[16px] bg-white px-8 py-4'>
        <ContentSection title='Change Password' desc='Click on Submit to change your login password here'>
          <></>
        </ContentSection>
      </div>
      <div>
        <ChangePasswordForm setIsLoading={setIsLoading} />
      </div>

      <div className='flex max-w-[50%] items-center justify-end  gap-[15px]'>
        <Button variant='outline' className='w-[160px]' onClick={() => navigation(-1)}>
          Back
        </Button>
        <Button
          type='submit'
          disabled={isLoading}
          loading={isLoading}
          className='w-[160px]'
          form='change-password-form'
        >
          {isLoading ? 'Sending...' : 'Submit'}
        </Button>
      </div>
    </div>
  )
}
