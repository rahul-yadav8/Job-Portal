import { useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { Button } from '@/components/custom/button'
import { cn } from '@/utils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RightSideDrawerProps } from '@/types/customcomponent.interface'

export default function Invite({
  className,
  isEdit = false,
  defaultValues,
  onSubmit,
  isLoading,
  ...props
}: RightSideDrawerProps) {
  type FormValues = z.infer<typeof schema>

  const schema = isEdit
    ? z.object({
        full_name: z
          .string()
          .min(1, 'Full name is required')
          .regex(/^\S.*$/, 'Full name should not start with a space')
          .regex(/^[^\d].*$/, 'Full name should not start with a number')
          .regex(/^[A-Za-z ]+$/, 'Full name should not contain special characters or numbers'),
      })
    : z.object({
        full_name: z
          .string()
          .min(1, 'Full name is required')
          .regex(/^\S.*$/, 'Full name should not start with a space')
          .regex(/^[^\d].*$/, 'Full name should not start with a number')
          .regex(/^[A-Za-z ]+$/, 'Full name should not contain special characters or numbers'),

        email: z
          .string()
          .trim()
          .toLowerCase()
          .min(1, 'Email is required')
          .refine((val) => /^[a-z0-9._-]+@[a-z0-9-]+\.[a-z]{2,}$/.test(val), 'Invalid email address'),
      })

  const form = useForm<any>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    delayError: 500,
    defaultValues: {
      full_name: '',
      email: '',
      ...defaultValues,
    },
  })

  // update form when editing different plant
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        full_name: defaultValues.full_name ?? '',
        email: defaultValues.email ?? '',
      })
    }
  }, [defaultValues, form])

  const handleSubmit = async (values: FormValues) => {
    try {
      const result = await onSubmit?.(values)
      if (result) form.reset()
    } catch (error) {
      console.log('Error submitting form:', error)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='full_name'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      id='full_name'
                      label='Full Name'
                      placeholder='Enter Full Name'
                      className='p-[10px]'
                      {...field}
                      maxLength={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEdit && (
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        id='email'
                        label='Email Address'
                        placeholder='Enter Email Address'
                        className='p-[10px]'
                        value={field.value || ''}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase()
                          field.onChange(value)
                        }}
                        maxLength={30}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type='submit'
              loading={isLoading}
              disabled={!form.formState.isValid || isLoading}
              className='mt-2 self-end rounded-[6px] bg-primary text-sm font-medium text-[#FAFAFA] disabled:bg-primary/80'
            >
              {isLoading ? (isEdit ? 'Saving...' : 'Inviting...') : isEdit ? 'Save Changes' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

// {
//   isEdit ? 'Save Changes' : 'Send Invite'
// }
