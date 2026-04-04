import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Box } from '@chakra-ui/react'
import { Button } from '@/components/custom/button'
import { useLocation, useNavigate } from 'react-router-dom'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus, CriticalityOption, pumpTypeOption } from '@/utils/constants'
import { Textarea } from '@/components/ui/textarea'

const assetsRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/
const serialNumberRegex = /^[0-9]+(?: [0-9]+)*$/
const modelRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/

const textRegex = /^[A-Za-z0-9,.()\- ]+$/

const formSchema = z.object({
  job_title: z.string().min(1, 'Job Title is required').regex(textRegex, 'Invalid characters in Job Title'),

  location: z.string().min(1, 'Location is required').regex(textRegex, 'Invalid characters in Location'),

  category: z.string().min(1, 'Category is required'),

  job_type: z.string().min(1, 'Job Type is required'),

  job_description: z.string().min(1, 'Job Description is required'),

  requirement: z.string().min(1, 'Requirement is required'),

  salary_range: z.string().min(1, 'Salary Range is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateJobModal() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const location = useLocation()
  const assetData = location.state?.assetData
  const isEditMode = !!assetData

  const selectedPlant = searchParams.get('plantId')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    delayError: 500,
    defaultValues: {
      job_title: assetData?.job_title || '',
      location: assetData?.location || '',
      category: assetData?.category || '',
      job_type: assetData?.job_type || '',
      job_description: assetData?.job_description || '',
      requirement: assetData?.requirement || '',
      salary_range: assetData?.salary_range || '',
    },
  })

  const BackNavigation = () => {
    navigate(`/assets`)
  }
  const onSubmit = (values: FormValues) => {
    if (!selectedPlant) {
      return console.log('Plant ID is required')
    }

    // setLoading(true)
    // const payload = {
    //   ...values,
    //   installation_date: formatDateForAPI(values.installation_date),
    //   extra_metadata: { key: 'value' },
    // }

    // if (isEditMode) {
    //   updateAsset(selectedPlant, assetData.id, payload, () => {
    //     setLoading(false)
    //     navigate('/assets')
    //   })
    // } else {
    //   createAsset(selectedPlant, payload, () => {
    //     setLoading(false)
    //     navigate('/assets')
    //   })
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Box className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='job_title'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput
                    id='jobTitle'
                    label='Job Title'
                    placeholder='e.g. Senior Frontend Developer'
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

          <Box className='flex flex-1 justify-between gap-3'>
            <div className='flex-1'>
              <FormField
                control={form.control}
                name='category'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectField
                        label='Category'
                        placeholder='Select Category'
                        items={pumpTypeOption}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        className='w-full font-bold placeholder:text-sm'
                        fontStyles='font-normal'
                        // isDisabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='flex-1'>
              <FormField
                control={form.control}
                name='job_type'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectField
                        label='Job Type'
                        placeholder='Select Job Type'
                        items={CriticalityOption}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        className='w-full'
                        fontStyles='font-normal'
                        // isDisabled={isEdit}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Box>

          <FormField
            control={form.control}
            name='job_description'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    label={'Job Description'}
                    id={'job_description'}
                    placeholder='Describe the role and responsibility'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='requirement'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    label={'Job Description'}
                    id={'job_description'}
                    placeholder='List key qualification and skills'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='salary_range'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput
                    id='salary_range'
                    label='Salary Range'
                    placeholder='Salary Range'
                    {...field}
                    maxLength={30}
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
                ? 'Update Job'
                : 'Create Job'}
          </Button>
        </Box>
      </form>
    </Form>
  )
}
