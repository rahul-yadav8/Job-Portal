import { useState, useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { Button } from '@/components/custom/button'
import { cn } from '@/utils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AssetDrawerProps {
  className?: string
  isEdit?: boolean
  isLoading?: boolean
  defaultValues?: {
    organization?: string
    email?: string
  }
  onSubmit?: (values: FormValues) => Promise<void> | void
}

export default function OrganizationDrawer({
  className,
  isEdit = false,
  defaultValues,
  onSubmit,
  isLoading,
  ...props
}: AssetDrawerProps) {
  type FormValues = z.infer<typeof formSchema>

  const organizationRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/

  const schema = isEdit
    ? z.object({
        organization: z
          .string()
          .min(1, 'Organization name is required')
          .regex(
            organizationRegex,
            'Only letters allowed, no special characters, and only single spaces between words'
          ),
      })
    : z.object({
        organization: z
          .string()
          .min(1, 'Organization name is required')
          .regex(
            organizationRegex,
            'Only letters allowed, no special characters, and only single spaces between words'
          ),

        email: z.string().min(1, 'Email is required').email('Invalid email format'),
      })

  const form = useForm<any>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    delayError: 500,
    defaultValues: {
      organization: '',
      email: '',
      ...defaultValues,
    },
  })

  // update form when editing different plant
  useEffect(() => {
    if (defaultValues) {
      form.reset({
        organization: defaultValues.organization ?? '',
        email: defaultValues.email ?? '',
      })
    }
  }, [defaultValues, form])

  const handleSubmit = async (values: FormValues) => {
    await onSubmit?.(values)
    form.reset()
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='organization'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      id='organization'
                      label='Organization Name'
                      placeholder='Enter Organization Name'
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
              className='mt-2 self-end rounded-[6px] bg-primary text-sm font-medium text-[#FAFAFA]'
            >
              {isLoading
                ? isEdit
                  ? 'Saving...'
                  : 'Creating...'
                : isEdit
                  ? 'Save Changes'
                  : 'Create Organization'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
