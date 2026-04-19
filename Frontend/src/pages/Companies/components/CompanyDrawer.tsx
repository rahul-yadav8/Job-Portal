import { useState, useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { Button } from '@/components/custom/button'
import { cn } from '@/utils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Upload } from 'lucide-react'

interface CompanyDrawerProps {
  className?: string
  isLoading?: boolean
  defaultValues?: {
    companyName?: string
    description?: string
    website?: string
    location?: string
    logo?: string
  }
  onSubmit?: (values: any) => Promise<void> | void
}

export default function CompanyDrawer({
  className,
  defaultValues,
  onSubmit,
  isLoading,
  ...props
}: CompanyDrawerProps) {
  type FormValues = z.infer<typeof formSchema>
  const [preview, setPreview] = useState<string | null>(null)
  const isEditMode = !!defaultValues

  // const assetsRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/
  // const serialNumberRegex = /^[0-9]+(?: [0-9]+)*$/
  // const modelRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/

  const textRegex = /^[A-Za-z0-9,.()\- ]+$/

  const createCompanySchema = (isEdit: boolean) =>
    z.object({
      companyName: z
        .string()
        .min(1, 'Company name is required')
        .regex(textRegex, 'Invalid characters in company name'),

      location: z.string().min(1, 'Location is required').regex(textRegex, 'Invalid characters in location'),

      website: z.string().min(1, 'Website is required').url('Invalid website URL'),

      description: z.string().min(1, 'Description is required'),

      logo: isEdit
        ? z
            .any()
            .optional()
            .refine((file) => !file || file instanceof File, {
              message: 'Invalid file',
            })
            .refine((file) => !file || file.size <= 10 * 1024 * 1024, {
              message: 'Max file size is 10MB',
            })
            .refine(
              (file) =>
                !file || ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type),
              { message: 'Only JPG, PNG, WEBP, SVG allowed' }
            )
        : z
            .instanceof(File, { message: 'Logo is required' })
            .refine((file) => file.size <= 10 * 1024 * 1024, {
              message: 'Max file size is 10MB',
            })
            .refine(
              (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'].includes(file.type),
              {
                message: 'Only JPG, PNG, WEBP, SVG allowed',
              }
            ),
    })
  const form = useForm({
    resolver: zodResolver(createCompanySchema(isEditMode)),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      companyName: '',
      location: '',
      website: '',
      description: '',
      logo: undefined,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        companyName: defaultValues.companyName ?? '',
        location: defaultValues.location ?? '',
        website: defaultValues.website ?? '',
        description: defaultValues.description ?? '',
        logo: undefined,
      })
      setPreview(defaultValues.logo ?? null)
    } else {
      form.reset({
        companyName: '',
        location: '',
        website: '',
        description: '',
        logo: undefined,
      })
    }
  }, [defaultValues])

  const handleSubmit = async (values: FormValues) => {
    console.log('values', values)
    await onSubmit?.(values)
    form.reset()
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Box className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='companyName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      id='company_name'
                      label='Company Name'
                      placeholder='e.g. google'
                      {...field}
                      maxLength={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      id='location'
                      label='Location'
                      placeholder='e.g. New York, NY'
                      {...field}
                      maxLength={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='website'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      id='website'
                      label='Website'
                      placeholder='e.g.https://google.com'
                      {...field}
                      maxLength={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='logo'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Box className='flex flex-col gap-[6px]'>
                      <label className='text-sm font-medium text-foreground'>Logo</label>
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
                        className='flex items-center w-full gap-2 cursor-pointer'
                      >
                        <Avatar className='w-10 h-10'>
                          <AvatarImage src={preview || ''} />
                          <AvatarFallback className='bg-[#333] font-bold text-sidebar-primary-foreground'>
                            R
                          </AvatarFallback>
                        </Avatar>

                        <div className='flex flex-1 gap-2 overflow-hidden rounded-md bg-[#f0f0f0] px-3 py-2'>
                          <Upload className='w-4 h-4' />
                          <span className='text-sm font-medium truncate'>
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
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      label={'Company Description'}
                      id={'company_description'}
                      placeholder='Describe the role and responsibility'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Box>

          <Box className='mt-6'>
            <Button type='submit' className='w-full'>
              {isLoading
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                  ? 'Update Company'
                  : 'Create Company'}
            </Button>
          </Box>
        </form>
      </Form>
    </div>
  )
}
