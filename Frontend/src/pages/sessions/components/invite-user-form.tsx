import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/custom/button'
import { cn } from '@/utils'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { Box } from '@chakra-ui/react/box'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Flex } from '@chakra-ui/react'
import { Upload, UserRoundCheck, IdCardLanyard } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '../sessionContext'

interface InviteUserForm extends HTMLAttributes<HTMLDivElement> {}

const formSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  phone: z
    .string()
    .min(10, { message: 'Phone must be at least 10 digits' })
    .regex(/^[0-9]+$/, { message: 'Only numbers allowed' }),
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[#?!@$%^&*-]/, { message: 'Password must contain at least one special character' }),
  avatar: z
    .any()
    .refine((file) => file instanceof File, {
      message: 'Profile picture is required',
    })
    .refine((file) => file?.size <= 10 * 1024 * 1024, {
      message: 'Max file size is 10MB',
    })
    .refine((file) => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file?.type), {
      message: 'Only JPG, PNG, WEBP, SVG allowed',
    }),
  role: z.enum(['jobseeker', 'employer'], {
    errorMap: () => ({ message: 'Role is required' }),
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function InviteUserForm({ className, ...props }: InviteUserForm) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeRole, setActiveRole] = useState<'jobseeker' | 'employer' | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const {
    actions: { register, uploadImage },
  } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      avatar: undefined,
      role: undefined,
    },
  })

  const navigate = useNavigate()
  const { reset } = form

  async function onSubmit(data: FormValues) {
    setIsLoading(true)

    try {
      const imageUrl = await uploadImage(data.avatar)

      const payload = {
        fullname: `${data.first_name} ${data.last_name}`,
        phone: data.phone,
        email: data.email,
        password: data.password,
        role: data.role,
        avatar: imageUrl,
      }

      const res = await register(payload)

      if (res) {
        reset()
        setPreview(null)
        setActiveRole(null)

        navigate('/login', { replace: true })
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
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
                      {...field}
                      className=''
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
                      <FloatingInput id='firstName' label='First Name' placeholder='John' {...field} />
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
                      <FloatingInput id='lastName' label='Last Name' placeholder='Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <FloatingInput
                      id='phone'
                      type='tel'
                      label='Phone Number'
                      placeholder='123456789'
                      {...field}
                      value={field.value ?? ''}
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
                <FormItem className='space-y-1'>
                  <FormControl>
                    <FloatingInput
                      id='password'
                      label='Password'
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
              name='avatar'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Box className='flex flex-col gap-[6px]'>
                      <label className='text-sm font-medium text-foreground'>Profile Picture</label>
                      <input
                        type='file'
                        accept='image/*'
                        id='profileUpload'
                        className='hidden'
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          const previewUrl = URL.createObjectURL(file)

                          field.onChange(file)

                          // store preview separately (we'll add state)
                          setPreview(previewUrl)
                        }}
                      />

                      <label
                        htmlFor='profileUpload'
                        className='flex w-full cursor-pointer items-center gap-2'
                      >
                        <Avatar className='h-10 w-10'>
                          <AvatarImage src={preview || ''} />
                          <AvatarFallback className='bg-[#333] font-bold text-sidebar-primary-foreground'>
                            R
                          </AvatarFallback>
                        </Avatar>

                        <div className='flex flex-1 gap-2 overflow-hidden rounded-md bg-[#f0f0f0] px-3 py-2'>
                          <Upload className='h-4 w-4' />
                          <span className='truncate text-sm font-medium'>
                            {field.value ? 'Upload Image' : 'Upload'}
                          </span>
                        </div>
                      </label>
                    </Box>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <Box className='flex flex-col gap-[6px]'>
                      <label htmlFor='name' className='text-sm font-medium text-foreground'>
                        I am a *
                      </label>
                      <Flex className='flex justify-between'>
                        {/* JobSeeker */}
                        <Box
                          className={`${activeRole === 'jobseeker' ? 'border-primary bg-sidebar' : ''} flex h-[120px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border`}
                          onClick={() => {
                            setActiveRole('jobseeker')
                            field.onChange('jobseeker')
                          }}
                        >
                          <UserRoundCheck className='h-8 w-8' />
                          <p className='text-sm font-medium'>Jobseeker</p>
                          <p className='text-normal text-[10px]'>Looking for opportunity</p>
                        </Box>
                        {/* employer */}
                        <Box
                          className={`${activeRole === 'employer' ? 'border-primary bg-sidebar' : ''} flex h-[120px] w-[150px] cursor-pointer flex-col items-center justify-center rounded-lg border`}
                          onClick={() => {
                            setActiveRole('employer')
                            field.onChange('employer')
                          }}
                        >
                          <IdCardLanyard className='h-8 w-8' />
                          <p className='text-sm font-medium'>Employer</p>
                          <p className='text-normal text-[10px]'>Hiring talented professionals</p>
                        </Box>
                      </Flex>
                    </Box>
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

            <Box className='mt-4 text-center text-sm font-normal text-[#09090B]'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='cursor-pointer text-sm font-normal text-[#09090B] underline hover:text-primary'
              >
                Login
              </Link>
            </Box>
          </div>
        </form>
      </Form>
    </div>
  )
}
