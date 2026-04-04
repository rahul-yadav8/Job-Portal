import { HTMLAttributes, useState, useEffect } from 'react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { Button } from '@/components/custom/button'
import { cn } from '@/utils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectField } from '@/components/custom/SelectField'
import { allTimezones } from 'react-timezone-select'

interface PlantsDrawerProps extends HTMLAttributes<HTMLDivElement> {
  isEdit?: boolean
  isLoading?: boolean
  defaultValues?: {
    plantName?: string
    location?: string
    timeZone?: string
  }
  onSubmit?: (values: Partial<FormValues>) => void
}
const plantRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/

const formSchema = z.object({
  plantName: z
    .string()
    .min(1, 'Plant name is required')
    .regex(plantRegex, 'Only letters allowed, no special characters, and only single spaces between words'),

  location: z
    .string()
    .min(1, 'Location is required')
    .regex(plantRegex, 'Only letters allowed, no special characters, and only single spaces between words'),

  timeZone: z.string().min(1, 'Time zone is required'),
})
type FormValues = z.infer<typeof formSchema>

export default function PlantsDrawer({
  className,
  isEdit = false,
  isLoading,
  defaultValues,
  onSubmit,
  ...props
}: PlantsDrawerProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    delayError: 500,
    defaultValues: {
      plantName: '',
      location: '',
      timeZone: '',
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const handleSubmit = async (values: FormValues) => {
    try {
      let payload: Partial<FormValues> = values

      if (isEdit) {
        payload = {
          location: values.location,
          timeZone: values.timeZone,
        }
      }

      await onSubmit?.(payload)
    } catch (error) {
      console.log(error)
    }
  }

  const timezoneOptions = Object.entries(allTimezones).map(([value, label]) => ({
    label,
    value,
  }))

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className='flex flex-col gap-4'>
            {/* Plant Name */}
            <FormField
              control={form.control}
              name='plantName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      id='plantName'
                      type='text'
                      label='Plant Name'
                      placeholder='Enter Plant Name'
                      disabled={isEdit}
                      {...field}
                      maxLength={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name='location'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FloatingInput
                      id='location'
                      label='Location'
                      placeholder='Enter Location'
                      {...field}
                      maxLength={30}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Zone */}

            <FormField
              control={form.control}
              name='timeZone'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectField
                      label='TimeZone'
                      placeholder='Select'
                      items={timezoneOptions}
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}

            <Button
              type='submit'
              loading={isLoading}
              disabled={!form.formState.isValid || isLoading}
              className='mt-2 self-end rounded-[6px] bg-primary text-sm font-medium text-[#FAFAFA]'
            >
              {isLoading ? (isEdit ? 'Saving...' : 'Creating...') : isEdit ? 'Save Changes' : 'Create Plant'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
