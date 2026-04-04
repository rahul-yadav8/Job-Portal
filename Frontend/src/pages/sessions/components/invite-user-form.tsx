import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/custom/button'
import { cn } from '@/utils'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../sessionContext'
import { FloatingInput } from '@/components/custom/FloatingInput'
import useSearchQuery from '@/hooks/useSearchQuery'

interface InviteUserForm extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[#?!@$%^&*-]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Confirm Password must be at least 6 characters long' })
    .regex(/[A-Z]/, { message: 'Confirm Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Confirm Password must contain at least one number' })
    .regex(/[#?!@$%^&*-]/, { message: 'Confirm Password must contain at least one special character' }),
})

export default function InviteUserForm({ className, ...props }: InviteUserForm) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    actions: { acceptInvite },
  } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })
  const { query, updateQuery } = useSearchQuery<{ email: string; code: string }>()
  const navigate = useNavigate()

  if (!query?.code) {
    return <div>No create token provided. Please check your email link.</div>
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data, 'data')
    setIsLoading(true)

    if (data.password !== data.confirmPassword) {
      setIsLoading(false)
      return form.setError('confirmPassword', {
        message: 'Passwords do not match',
      })
    }

    if (query?.code) {
      acceptInvite(
        {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
          inviteToken: query.code,
        },
        () => {
          setIsLoading(false)
          navigate('/login')
        }
      )
    } else {
      setIsLoading(false)
      console.error('Invalid create token')
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      id='email'
                      label='Email'
                      type='email'
                      placeholder='Userid@mail.com'
                      value={query.email}
                      className=''
                      disabled={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormControl>
                      <FloatingInput
                        id='firstName'
                        label='First Name'
                        placeholder='John'
                        {...field}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormControl>
                      <FloatingInput
                        id='lastName'
                        label='Last Name'
                        placeholder='Doe'
                        {...field}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <FloatingInput
                      id='password'
                      label='New Password'
                      type='password'
                      placeholder='********'
                      eyeIcon={true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <FloatingInput
                      id='password'
                      label='Confirm Password'
                      type='password'
                      placeholder='Re-enter password'
                      eyeIcon={true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='mt-2 w-full justify-center rounded-[6px] bg-primary text-sm font-medium text-[#FAFAFA]'
              loading={isLoading}
            >
              Complete Registration & Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
