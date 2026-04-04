import { Box, useDisclosure } from '@chakra-ui/react'
import { Globe, MapPin, SquarePen, Trash2 } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { useEffect, useRef, useState } from 'react'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import DeletePlantModal from './components/DeletePlantModal'
import RightDrawer from '@/components/ui/RightDrawer'
import PlantsDrawer from './components/PlantsDrawer'
import { usePlant } from './PlantsContext'
import { getStatusColor } from '@/utils/helpers'
import { useAuth } from '@/routes'
import { useNavigate } from 'react-router-dom'
import { checkUserTypeMessage, getUserTypeStyle } from '@/utils/constants'

export default function PlantsDetails({ id }: { id: string }) {
  const navigation = useNavigate()
  const btnRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [open, setOpen] = useState(false)
  const [PlantDetails, setPlantDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    actions: { getAllPlants, handleDeactivate, updatePlant },
  } = usePlant()

  const {
    state: { UserDetails },
  } = useAuth()

  useEffect(() => {
    if (!UserDetails?.org_id) return

    getAllPlants(
      UserDetails.org_id,
      {},
      (data) => {
        setPlantDetails(data)
      },
      id
    )
  }, [UserDetails.org_id])

  const plantsData = [
    { title: 'Assets', value: 200 },
    { title: 'Rules', value: 180 },
    { title: 'Jobs', value: '90%' },
    { title: 'Prediction', value: '95%' },
  ]

  const Deactivate = async (value) => {
    await handleDeactivate(id, { confirmation_name: value }, () => {
      navigation(`/plants`)
      setOpen(false)
    })
  }

  const handleUpdatePlants = (values: any) => {
    setIsLoading(true)
    updatePlant(
      UserDetails.org_id || '',
      values,
      {},
      () => {
        onClose()
        getAllPlants(
          UserDetails.org_id || '',
          {},
          (data) => {
            setPlantDetails(data)
          },
          id
        )
        setIsLoading(false)
      },
      id
    )
  }

  return (
    <>
      <Box className='flex flex-col gap-1.5'>
        <p className='text-2xl font-medium leading-5 text-[#71717A]'>
          Plants Overview / <span className=' text-[#09090B]'>{PlantDetails?.name}</span>
        </p>
        <p className='text-base font-medium leading-5 text-[#71717A]'>Overview plant details</p>
      </Box>

      <Box className='p-6 mt-8 border rounded-lg'>
        <Box className='flex justify-between'>
          <Box className='flex flex-col gap-5'>
            <p className='text-[28px] font-semibold leading-5 text-[#09090B]'>{PlantDetails?.name}</p>
            <div className='flex gap-5'>
              <p className='flex items-center gap-2'>
                <MapPin size={16} /> {PlantDetails?.location}
              </p>
              <p className='flex items-center gap-2'>
                <Globe size={16} />
                {PlantDetails?.timezone}
              </p>
            </div>
          </Box>
          <Box className='flex items-center gap-3'>
            <Button
              variant='outline'
              className='h-[40px] px-4 py-2 text-sm  text-[#09090B] hover:bg-red-50'
              rightSection={<SquarePen size={16} />}
              onClick={() => onOpen()}
            >
              Edit Details
            </Button>

            <div
              className={` border capitalize  ${
                PlantDetails?.status === 'active'
                  ? 'bg-green-50  text-green-600'
                  : PlantDetails?.status === 'inactive'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-50 text-gray-600'
              } flex w-fit items-center justify-center rounded-lg px-2 py-1  text-sm font-semibold`}
            >
              {PlantDetails?.status}
            </div>
          </Box>
        </Box>

        <hr className='my-6 text-[#E4E4E7]' />

        <Box className='flex gap-3'>
          {plantsData.map((item) => (
            <Box
              key={item.title}
              className='flex flex-1 flex-col gap-3 rounded-[6px] border border-[#E4E4E7] p-5 '
            >
              <p className='text-sm font-medium leading-5 text-[#71717A]'>{item.title}</p>
              <p className='text-2xl font-semibold leading-5 text-[#09090B]'>{item.value}</p>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className='flex items-center justify-between p-6 mt-6 border rounded-lg'>
        <Box className='flex flex-col gap-[10px]'>
          <p
            className={`text-base font-medium leading-5 ${PlantDetails?.status === 'active' ? 'text-destructive' : 'text-green-500'}`}
          >
            {checkUserTypeMessage(PlantDetails?.status)} Plant
          </p>
          <p className='text-sm font-medium leading-5 text-[#71717A]'>
            This will {checkUserTypeMessage(PlantDetails?.status)} the plant & other related details
          </p>
        </Box>
        <Button
          className={`mt-2 h-[40px] w-[128px] self-end rounded-[6px] bg-destructive text-sm font-medium text-[#FAFAFA]  ${getUserTypeStyle(PlantDetails?.status)}`}
          onClick={() => setOpen(true)}
        >
          {checkUserTypeMessage(PlantDetails?.status)}
        </Button>
      </Box>
      <Box>
        <Button
          variant='outline'
          className='mt-6 h-[40px] w-[65px] self-end px-4 py-2 text-sm  text-[#09090B] hover:bg-red-50'
          onClick={() => navigation(-1)}
        >
          Back
        </Button>
      </Box>

      {open && (
        <ConfirmDeleteModal
          isOpen={open}
          onClose={() => setOpen(false)}
          width='407px'
          title={`${checkUserTypeMessage(PlantDetails?.status)}`}
          description={`This will ${checkUserTypeMessage(PlantDetails?.status)} the plant`}
        >
          <DeletePlantModal selectedPlant={PlantDetails} handleDeleteOrganization={Deactivate} />
        </ConfirmDeleteModal>
      )}

      <RightDrawer
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
        title='Edit Plant'
        description='Edit details of the plant.'
      >
        <PlantsDrawer
          isEdit={true}
          defaultValues={{
            plantName: PlantDetails?.name,
            location: PlantDetails?.location,
            timeZone: PlantDetails?.timezone,
          }}
          onSubmit={handleUpdatePlants}
          isLoading={isLoading}
        />
      </RightDrawer>
    </>
  )
}
