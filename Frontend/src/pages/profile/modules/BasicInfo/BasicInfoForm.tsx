import { z } from 'zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Card, Flex, Grid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useProfile } from '../../profileContext'
import { PreviewUpload } from '@/components/custom/PreviewUpload'
import { useDealership } from '@/pages/dealerships/dealershipContext'
import { useParams } from 'react-router-dom'

const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First Name must be at least 2 characters.' })
    .max(50, { message: 'First Name must not exceed 50 characters.' }),
  lastName: z
    .string()
    .min(2, { message: 'Last Name must be at least 2 characters.' })
    .max(50, { message: 'Last Name must not exceed 50 characters.' }),
  phoneNumber: z
    .string()
    .min(10, { message: 'Phone must be at least 10 characters.' })
    .max(15, { message: 'Phone must not exceed 15 characters.' }),
  secondaryPhoneNumber: z.union([
    z
      .string()
      .max(20, { message: 'Phone number too long' })
      .regex(/^\+\d{1,3}(?:[\s.-]?\d{3,5}){1,3}$/, {
        message: 'Invalid phone number. Please enter a valid number with country code.',
      }),
    z.literal(''),
    z.undefined(),
  ]),
  email: z.string().email({ message: 'Must be a valid email address.' }),
  profilePicture: z.union([z.string().nonempty({ message: 'Logo is required.' }), z.literal('')]),
})

const userProfileSchema = z.object({
  user: profileSchema,
})

type userProfileValues = z.infer<typeof userProfileSchema>

interface BasicInfoFormProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function BasicInfoForm({ setIsLoading }: BasicInfoFormProps) {
  const {
    state: { profileList },
    actions: { getAll, updateProfile },
  } = useProfile()

  const {
    actions: { getFileSignedURL },
  } = useDealership()

  console.log('list2', profileList)
  // const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null)
  const [isFormReady, setFormReady] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const params = useParams()
  // Initialize form
  const form = useForm<userProfileValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      user: { firstName: '', lastName: '', phoneNumber: '', email: '', profilePicture: '' },
    },
    mode: 'onChange',
  })

  useEffect(() => {
    if (profileList.length == 0) getAll({}, true)
  }, [profileList])

  useEffect(() => {
    if (profileList) {
      form.reset({
        user: {
          firstName: profileList?.firstName || '',
          lastName: profileList?.lastName || '',
          phoneNumber: profileList?.phoneNumber || '',
          secondaryPhoneNumber: profileList?.secondaryPhoneNumber || '',
          email: profileList?.email || '',
          profilePicture: profileList?.profilePicture || '',
        },
      })
      setFormReady(true)
    }
  }, [profileList, form])

  function onSubmit(data: userProfileValues) {
    //update

    const updateVal = {
      firstName: data?.user?.firstName,
      lastName: data?.user?.lastName,
      phoneNumber: data?.user?.phoneNumber,
      secondaryPhoneNumber: data?.user?.secondaryPhoneNumber,
      email: data?.user?.email,
      profilePicture: data?.user?.profilePicture,
    }
    setIsLoading(true)
    console.log('Update Profile - ', updateVal)
    updateProfile(updateVal, () => {
      setIsLoading(false)
    })
    getAll()
  }

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validExtensions = ['image/png', 'image/jpeg']
    if (!validExtensions.includes(file.type)) {
      setFileError('Only PNG and JPG files are allowed.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size must not exceed 5MB.')
      return
    }

    setFileError(null)
    setUploadingLogo(true)

    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    const userId = localStorage.getItem('userId')
    const sanitizedFileName = file.name.replace(/[^\w.-]/g, '_')
    const timestamp = Date.now()
    const fileKey = `dealers/${userId}/logo/${timestamp}_${sanitizedFileName}`

    console.log('fileKey', fileKey)

    getFileSignedURL(fileKey, file.type, (error: any, signedURLResponse: any) => {
      if (error) {
        console.error('Error fetching signed URL:', error)
        setFileError('Failed to fetch the signed URL.')
        setUploadingLogo(false)
        return
      }

      uploadFileToSignedURL(file, signedURLResponse.asset.signedURL)
        .then(() => {
          const fullUrl = `${import.meta.env.VITE_STATIC_ENDPOINT}/${signedURLResponse.asset.objectURL}`
          form.setValue('user.profilePicture', fullUrl)
          console.log(typeof signedURLResponse.asset.objectURL, signedURLResponse.asset.objectURL)
        })
        .catch((err) => {
          console.error('Error uploading file:', err)
          setFileError('Failed to upload the file.')
        })
        .finally(() => {
          setUploadingLogo(false)
        })
    })
  }

  const uploadFileToSignedURL = async (file: File, signedURL: string) => {
    const response = await fetch(signedURL, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    })
    if (!response.ok) {
      throw new Error('Failed to upload file to signed URL.')
    }
  }

  console.log('uploadingLogo', uploadingLogo)
  if (!isFormReady) {
    return <div>Loading form...</div>
  }

  return (
    <>
      <Grid className='h-[100%] w-[50%]'>
        <Flex className='scrollbar w-full rounded-[16px] bg-white px-[46px] py-[32px] '>
          <Box className='w-[inherit]'>
            <Form {...form}>
              <form id='basic-info-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                  control={form.control}
                  name='user.firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> First Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Firstname' type='text' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='user.lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder='Lastname' type='text' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='user.phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder='Phone Number' type='text' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='user.secondaryPhoneNumber'
                  render={({ field }) => (
                    <FormItem className='w-full space-y-1'>
                      <FormLabel>Additional Phone Number</FormLabel>

                      <FormControl>
                        <Input placeholder='Additional Phone Number' type='text' {...field} />
                      </FormControl>
                      <FormDescription>Optional</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='user.email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder='Email' type='email' {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='user.profilePicture'
                  render={({ field }) => (
                    <div className='flex flex-col items-start'>
                      <PreviewUpload
                        value={field.value}
                        onChange={handleLogoFileChange}
                        name={field.name}
                        previewUrl={logoPreview || field.value || '/default-logo.png'}
                        accept='.png,.jpg,.jpeg'
                        label='Upload Logo'
                        sublabel='(.png, .jpg, .jpeg)'
                        loading={uploadingLogo}
                        onClear={() => {
                          form.setValue('user.profilePicture', '')
                          setLogoPreview(null)
                        }}
                      />
                      {uploadingLogo && <p className='mt-1 text-sm'>Uploading...</p>}
                      {fileError && <FormDescription className='text-red-500'>{fileError}</FormDescription>}
                      {!fileError && <FormDescription>File size &lt; 2MB</FormDescription>}
                    </div>
                  )}
                />
              </form>
            </Form>
          </Box>
        </Flex>
      </Grid>
    </>
  )
}
