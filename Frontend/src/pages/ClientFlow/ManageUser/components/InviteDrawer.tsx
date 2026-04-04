import { HTMLAttributes, useState, useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { Button } from '@/components/custom/button'
import { cn } from '@/utils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectField } from '@/components/custom/SelectField'

interface Role {
  id: string
  name: string
  slug: string
}

interface PlantsDrawerProps extends HTMLAttributes<HTMLDivElement> {
  isEdit?: boolean
  defaultValues?: {
    role_slug?: string
    email?: string
    first_name?: string
    last_name?: string
  }
  RolesList: Role[]
  onSubmit?: (values: Partial<FormValues>) => Promise<void> | void
}

/* ---------- Schemas ---------- */

const organizationRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/

const createSchema = z.object({
  role_slug: z.string().min(1, 'Role is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
})

const editSchema = z.object({
  first_name: z
    .string()
    .min(1, 'Invalid First name')
    .regex(/^\S.*$/, 'First name should not start with a space')
    .regex(/^[^\d].*$/, 'First name should not start with a number')
    .regex(/^[A-Za-z ]+$/, 'First name should not contain special characters or numbers'),
  last_name: z
    .string()
    .min(1, 'Invalid Last name')
    .regex(/^\S.*$/, 'Last name should not start with a space')
    .regex(/^[^\d].*$/, 'Last name should not start with a number')
    .regex(/^[A-Za-z ]+$/, 'Last name should not contain special characters or numbers'),
  role_slug: z.string().min(1, 'Role is required'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .refine((val) => /^[a-z0-9._-]+@[a-z0-9-]+\.[a-z]{2,}$/.test(val), 'Invalid email address'),
})

type FormValues = {
  role_slug: string
  email: string
  first_name?: string
  last_name?: string
}

export default function InviteDrawer({
  className,
  isEdit = false,
  defaultValues,
  RolesList,
  onSubmit,
  ...props
}: PlantsDrawerProps) {
  const [isLoading, setIsLoading] = useState(false)

  const schema = isEdit ? editSchema : createSchema

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    delayError: 500,
    defaultValues: {
      role_slug: '',
      email: '',
      first_name: '',
      last_name: '',
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (!defaultValues) return

    form.reset({
      role_slug: defaultValues.role_slug ?? '',
      email: defaultValues.email ?? '',
      first_name: defaultValues.first_name ?? '',
      last_name: defaultValues.last_name ?? '',
    })
  }, [defaultValues, form])

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true)

      const payload = isEdit ? { first_name: values.first_name, last_name: values.last_name } : values

      await onSubmit?.(payload)
    } finally {
      setIsLoading(false)
    }
  }

  const roleOptions =
    RolesList?.map((role) => ({
      label: role.name,
      value: role.slug,
    })) || []

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='flex flex-col gap-4'>
            {/* First Name + Last Name only in edit */}
            {isEdit && (
              <>
                <FormField
                  control={form.control}
                  name='first_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingInput
                          id='first_name'
                          label='First Name'
                          placeholder='Enter First Name'
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
                  name='last_name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FloatingInput
                          id='last_name'
                          label='Last Name'
                          placeholder='Enter Last Name'
                          {...field}
                          maxLength={30}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='role_slug'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectField
                      label='Role'
                      placeholder='Select Role'
                      items={roleOptions}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                      className='w-full'
                      isDisabled={isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Button */}
            <Button
              type='submit'
              className='mt-2 h-[40px] w-[140px] self-end rounded-[6px] bg-primary text-sm font-medium text-[#FAFAFA] hover:bg-foreground'
              loading={isLoading}
              disabled={!form.formState.isValid || isLoading}
            >
              {isEdit ? 'Save Changes' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
