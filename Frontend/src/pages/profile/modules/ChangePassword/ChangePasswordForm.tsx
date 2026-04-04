import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/custom/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '../../profileContext'
import { useSession } from '@/pages/sessions/sessionContext'

// Define the schema for form validation
const formSchema = z.object({
  email: z.string().min(1, { message: 'Please Enter the email address' }),
})

interface ChangePasswordFormProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ChangePasswordForm({ setIsLoading }: ChangePasswordFormProps) {
  const [isFormReady, setFormReady] = useState(false)

  const {
    state: { profileList },
    actions: { getAll, forgotPassword },
  } = useProfile()

  // const {
  //   actions: { forgotPassword },
  // } = useSession()

  useEffect(() => {
    if (profileList.length == 0) getAll({}, true)
  }, [profileList])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  })

  useEffect(() => {
    if (profileList) {
      form.reset({
        email: profileList?.email || '',
      })
      setFormReady(true)
    }
  }, [profileList, form])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    forgotPassword(data)
    console.log('Password Change Data:', data)
    // Simulate an API request
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className='grid w-[50%] gap-6 rounded-[16px] bg-white px-[46px] py-[32px]'>
      <Form {...form}>
        <form id='change-password-form' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-4'>
            {/* Email Address Field */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      className='ncursor-text n cursor-text select-text'
                      readOnly={true}
                      disabled={true}
                      placeholder='Enter email address'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}
