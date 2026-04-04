import { Box } from '@chakra-ui/react'
import { Button } from '@/components/custom/button'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form'
import { FloatingInput } from '@/components/custom/FloatingInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useAsset } from '../AssetsContext'
import { useSearchParams } from 'react-router-dom'
import { SelectField } from '@/components/custom/SelectField'
import { ActivationStatus, CriticalityOption, formatDateForAPI, pumpTypeOption } from '@/utils/constants'
import DateRangeFilter from '@/components/custom/DateRangeFilter'

const assetsRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/
const serialNumberRegex = /^[0-9]+(?: [0-9]+)*$/
const modelRegex = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Asset name is required')
    .regex(assetsRegex, 'Only letters allowed, no special characters, and only single spaces between words'),
  type: z.string().min(1, 'Asset Type is required'),
  manufacturer: z
    .string()
    .min(1, 'Manufacturer is required')
    .regex(assetsRegex, 'Only letters allowed, no special characters, and only single spaces between words'),
  model: z
    .string()
    .min(1, 'Model is required')
    .regex(modelRegex, 'Only letters, numbers and single spaces are allowed'),
  serial_number: z
    .string()
    .min(1, 'Serial Number is required')
    .regex(
      serialNumberRegex,
      'Only number allowed, no special characters, and only single spaces between words'
    ),
  criticality: z.string().min(1, 'Criticality is required'),
  installation_date: z
    .date({ required_error: 'Installation Date is required' })
    .nullable()
    .refine((val) => val !== null, {
      message: 'Installation Date is required',
    }),
  location: z
    .string()
    .min(1, 'Plant Location is required')
    .regex(assetsRegex, 'Only letters allowed, no special characters, and only single spaces between words'),
  status: z.string().min(1, 'Status is required'),
  // extra_metadata: z.string().optional(),
  // mtbf_threshold: z.string().min(1, 'MTBF Threshold is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function CreateEditAssets() {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  const location = useLocation()
  const assetData = location.state?.assetData
  const isEditMode = !!assetData

  const {
    actions: { createAsset, updateAsset },
  } = useAsset()

  const selectedPlant = searchParams.get('plantId')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    delayError: 500,
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
    navigate(`/assets`)
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

    if (isEditMode) {
      updateAsset(selectedPlant, assetData.id, payload, () => {
        setLoading(false)
        navigate('/assets')
      })
    } else {
      createAsset(selectedPlant, payload, () => {
        setLoading(false)
        navigate('/assets')
      })
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Box className='flex flex-col gap-1.5'>
            <Box className='flex items-center gap-1.5 text-2xl font-medium leading-5'>
              <p className='cursor-pointer text-[#71717A]' onClick={BackNavigation}>
                Assets Overview
              </p>
              <span className=' text-[#09090B]'> / {!isEditMode ? 'Create' : 'Edit'} Asset</span>
            </Box>
            <p className='text-base font-normal leading-5 text-[#71717A]'>
              {!isEditMode ? 'Create' : 'Edit'} any assets
            </p>
          </Box>

          <Box className='p-6 mt-8 border rounded-lg'>
            <p className='text-[20px] font-medium leading-5 text-foreground'>General Information</p>
            <hr className='my-5 text-[#E4E4E7]' />

            <div className='grid grid-cols-3 gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        id='name'
                        label='Asset Name'
                        placeholder='Enter Asset Name'
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
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectField
                        label='Asset Type'
                        placeholder='Select Asset Type'
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

              <FormField
                control={form.control}
                name='manufacturer'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        id='manufacturer'
                        label='Manufacturer'
                        placeholder='Enter Manufacturer'
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
                name='model'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        id='model'
                        label='Model'
                        placeholder='Enter Model'
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
                name='serial_number'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        id='serial_number'
                        label='Serial Number'
                        placeholder='Enter Serial Number'
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
                name='criticality'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectField
                        label='Criticality'
                        placeholder='Select criticality'
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

              {/* <FormField
                control={form.control}
                name='installation_date'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        id='installation_date'
                        label='Installation Date'
                        placeholder='Enter Installation Date'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name='installation_date'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DateRangeFilter
                        label='Select Date'
                        value={field.value || null}
                        onChange={(date) => field.onChange(date)}
                        variant='input'
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
                        label='Plant Location'
                        placeholder='Enter Plant Location'
                        {...field}
                        maxLength={30}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name='extra_metadata'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingInput
                        id='extra_metadata'
                        label='metaData'
                        placeholder='Enter metaData'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectField
                        label='Status'
                        placeholder='Select status'
                        items={ActivationStatus}
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                        className='w-full'
                        fontStyles='!font-normal'
                        // isDisabled={isEdit}
                        maxLength={30}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Box>

          <Box className='p-6 mt-6 border rounded-lg'>
            <p className='text-[18px] font-medium leading-5 text-foreground'>Reliability Configuration</p>
            <hr className='my-5 text-black' />

            <Box className='flex flex-col gap-1'>
              <p className='text-sm font-medium leading-5 text-[#4B5563]'>MTBF Threshold</p>

              {/* <FormField
                control={form.control}
                name='mtbfThreshold'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder='Enter MTBF threshold' className='w-[346px]' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <Input placeholder='Enter MTBF threshold' className='w-[346px]' />
            </Box>
          </Box>

          <Box className='flex justify-between mt-6'>
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
                  ? 'Update Asset'
                  : 'Create Asset'}
            </Button>
          </Box>
        </form>
      </Form>
    </>
  )
}
