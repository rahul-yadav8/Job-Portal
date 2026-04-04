import { HTMLAttributes, useState } from 'react'
import { cn } from '@/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/custom/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useSession } from '../sessionContext'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

interface ForgotFormProps extends HTMLAttributes<HTMLDivElement> {}
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' })
    .transform((val) => val.toLowerCase()),
})

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    actions: { forgotPassword },
  } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    forgotPassword(data, (response, error) => {
      setIsLoading(false)
    })
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
                <FormItem className='space-y-1'>
                  <FormControl>
                    <FloatingInput
                      id='email'
                      label='Email'
                      type='email'
                      className='lowercase'
                      placeholder='Userid@mail.com'
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className=' h-[40px] w-full justify-center rounded-[8px] bg-primary text-sm font-medium text-sidebar-primary-foreground '
              loading={isLoading}
            >
              Send Reset Link
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
