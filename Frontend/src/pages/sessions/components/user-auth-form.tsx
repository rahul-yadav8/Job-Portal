import { HTMLAttributes, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/custom/button'
import { cn } from '@/utils'
import { useSession } from '../sessionContext'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { Box, Flex } from '@chakra-ui/react'

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(6, {
      message: 'Password must be at least 6 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const {
    actions: { login },
  } = useSession()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail')
    const storedPassword = localStorage.getItem('rememberedPassword')

    if (storedEmail && storedPassword) {
      form.setValue('email', storedEmail)
      form.setValue('password', storedPassword)
      setRememberMe(true)
    }
  }, [])

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', data.email)
      localStorage.setItem('rememberedPassword', data.password)
    } else {
      localStorage.removeItem('rememberedEmail')
      localStorage.removeItem('rememberedPassword')
    }

    login(data, (data, error) => {
      if (!error) {
        console.log('Logged in successfully')
      }
      setIsLoading(false)
    })
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Flex className='flex-col gap-4'>
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      id='password'
                      label='Password'
                      type='password'
                      placeholder='*****************'
                      value={field.value}
                      onChange={field.onChange}
                      eyeIcon={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Flex>

          <Box className='mt-2 text-right'>
            <Link
              to='/forgot-password'
              className='cursor-pointer text-sm font-normal text-[#09090B] underline'
            >
              Forgot password?
            </Link>
          </Box>
          <Button
            className='mt-4 h-10 w-full justify-center rounded-[6px] bg-primary text-sm font-medium text-sidebar-primary-foreground'
            loading={isLoading}
          >
            Login
          </Button>

          <Box className='mt-4 text-center text-sm font-normal text-[#09090B]'>
            Don&apos;t have an account?{' '}
            <Link
              to='/register'
              className='cursor-pointer text-sm font-normal text-[#09090B] underline hover:text-primary'
            >
              Sign Up
            </Link>
          </Box>
        </form>
      </Form>
    </div>
  )
}
