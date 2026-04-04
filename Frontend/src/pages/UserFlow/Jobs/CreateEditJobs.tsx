import { Box, Textarea } from '@chakra-ui/react'
import { Button } from '@/components/custom/button'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus, formatDateForAPI } from '@/utils/constants'
import DateRangeFilter from '@/components/custom/DateRangeFilter'
import { FloatingTextarea } from '@/components/custom/floatingTextarea'
import ScheduleSelector from './components/Schedule'

const formSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  type: z.string().min(1, 'Asset Type is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  model: z.string().min(1, 'Model is required'),
  serial_number: z.string().min(1, 'Serial Number is required'),
  criticality: z.string().min(1, 'Criticality is required'),
  installation_date: z
    .date({ required_error: 'Installation Date is required' })
    .nullable()
    .refine((val) => val !== null, {
      message: 'Installation Date is required',
    }),
  location: z.string().min(1, 'Plant Location is required'),
  status: z.string().min(1, 'Status is required'),
  // extra_metadata: z.string().optional(),
  // mtbf_threshold: z.string().min(1, 'MTBF Threshold is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateEditJobs() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const location = useLocation()
  const assetData = location.state?.assetData
  const isEditMode = !!assetData

  // const {
  //   actions: { createAsset, updateAsset },
  // } = useAsset()

  const selectedPlant = searchParams.get('plantId')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: assetData?.name || '',
      type: assetData?.type || '',
      manufacturer: assetData?.manufacturer || '',
      model: assetData?.model || '',
      serial_number: assetData?.serial_number || '',
      criticality: assetData?.criticality || '',
      installation_date: assetData?.installation_date ? new Date(assetData.installation_date) : null,
      location: assetData?.location || '',
      status: assetData?.status || '',
    },
  })

  const BackNavigation = () => {
    navigate(-1)
  }
  const onSubmit = (values: FormValues) => {
    if (!selectedPlant) {
      return console.log('Plant ID is required')
    }

    setLoading(true)
    const payload = {
      ...values,
      installation_date: formatDateForAPI(values.installation_date),
      extra_metadata: { key: 'value' },
    }

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

  const pumpTypeOption = [
    { label: 'Pump', value: 'Pump' },
    { label: 'Compressor', value: 'Compressor' },
    { label: 'Turbine', value: 'Turbine' },
    { label: 'Fan', value: 'Fan' },
  ]
  const CriticalityOption = [
    { label: 'Critical', value: 'Critical' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ]

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Box className='flex flex-col gap-1.5'>
            <Box className='flex items-center gap-1.5 text-2xl font-medium leading-5'>
              <p className='cursor-pointer text-[#71717A]' onClick={BackNavigation}>
                Jobs Overview
              </p>
              <span className=' text-[#09090B]'> / Create Jobs</span>
            </Box>
            <p className='text-base font-normal leading-5 text-[#71717A]'>
              Configure detection parameters for proactive asset monitoring monitoring and early failure
              warning.
            </p>
          </Box>

          <Box className='mt-8 rounded-lg border p-6'>
            <p className='text-[20px] font-medium leading-5 text-foreground'>Job Identity</p>
            <hr className='my-5 text-[#E4E4E7]' />

            <div className='grid gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput id='name' label='Job Name*' placeholder='Enter Job Name' {...field} />
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
                      <FloatingTextarea
                        id='description'
                        label='Description'
                        placeholder='Enter description'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Box>

          <Box className='mt-6 rounded-lg border p-6'>
            <p className='text-[18px] font-medium leading-5 text-foreground'>Scheduling</p>
            <hr className='my-5 text-black' />

            <Box className='flex flex-col gap-1'>
              <ScheduleSelector />
            </Box>
          </Box>

          <Box className='mt-6 flex justify-between'>
            <Button
              variant='outline'
              type='button'
              onClick={BackNavigation}
              className='h-[40px] w-[65px] text-sm text-[#09090B] hover:bg-red-50'
            >
              Back
            </Button>

            <Button type='submit'>
              {isLoading
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                  ? 'Update Jobs'
                  : 'Create Jobs'}
            </Button>
          </Box>
        </form>
      </Form>
    </>
  )
}
