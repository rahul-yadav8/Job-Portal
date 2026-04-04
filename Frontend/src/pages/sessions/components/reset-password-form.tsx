import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/utils'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSession } from '../sessionContext'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { Box } from '@chakra-ui/react'
import useSearchQuery from '@/hooks/useSearchQuery'

interface ResetPasswordFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
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

export default function ResetPasswordForm({ className, ...props }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    actions: { reset },
  } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { query, updateQuery } = useSearchQuery<{ token: string }>()
  const navigate = useNavigate()

  if (!query.token) {
    return <div>No reset token provided. Please check your email link.</div>
  }

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    if (data.password !== data.confirmPassword) {
      setIsLoading(false)
      return form.setError('confirmPassword', {
        message: 'Passwords do not match',
      })
    }

    if (query.token) {
      reset({ password: data.password, resetHash: query.token as string }, (response, error) => {
        setIsLoading(false)
        navigate('/login')
      })
    } else {
      setIsLoading(false)
      console.error('Invalid reset token')
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
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
                      placeholder='Enter your new password'
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
                      placeholder='Confirm your new password'
                      eyeIcon={true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='mt-6 h-[40px] w-full justify-center  rounded-[6px] text-sm font-medium text-[#FAFAFA]'
              loading={isLoading}
            >
              Reset Password
            </Button>
            <Box className='text-center text-sm font-medium text-[#09090B]'>
              Remember Password?{' '}
              <Link to='/login' className='cursor-pointer text-sm font-normal text-[#09090B] underline'>
                Login
              </Link>
            </Box>
          </div>
        </form>
      </Form>
    </div>
  )
}
