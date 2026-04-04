import { Box } from '@chakra-ui/react'
import { Dot, SquarePen, Trash2 } from 'lucide-react'
import { Button } from '@/components/custom/button'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DeleteAssetModel from './components/DeleteAssetModel'
import { useEffect, useState } from 'react'
import { useAsset } from './AssetsContext'
import { checkUserTypeMessage, getUserTypeStyle } from '@/utils/constants'

const plantsData = [
  { title: 'Rules', value: 180 },
  { title: 'Prediction', value: '95%' },
  { title: 'Tasks', value: '90%' },
]

export default function AssetsDetails() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [searchParams] = useSearchParams()

  const plantId = searchParams.get('plantId')
  const assetsId = searchParams.get('assetId')

  const {
    state: { selectedAsset },
    actions: { getAssetById, handleDeactivateAsset },
  } = useAsset()

  useEffect(() => {
    if (plantId && assetsId) {
      getAssetById(plantId, assetsId, (data) => {})
    }
  }, [plantId, assetsId])

  const BackNavigation = () => {
    navigate(`/assets`)
  }

  const handleDeleteOrganization = async () => {
    if (!selectedAsset?.id || !plantId) return

    const payload = {
      confirmation_name: selectedAsset?.name,
    }

    await handleDeactivateAsset(plantId, selectedAsset?.id, payload, () => {
      navigate(`/assets`)
      setOpen(false)
    })
  }

  return (
    <>
      <Box className='flex flex-col gap-1.5'>
        <Box className='flex items-center gap-1.5 text-2xl font-medium leading-5'>
          <p className='cursor-pointer text-[#71717A]' onClick={BackNavigation}>
            Assets Overview
          </p>{' '}
          <span className=' text-[#09090B]'> / {selectedAsset?.name}</span>
        </Box>
        <p className='text-base font-normal leading-5 text-[#71717A]'>Overview plant details</p>
      </Box>

      <Box className='p-6 mt-8 border rounded-lg'>
        <Box className='flex justify-between'>
          <Box className='flex flex-col gap-5'>
            <p className='text-[28px] font-semibold leading-5 text-[#09090B]'>{selectedAsset?.name}</p>
            <div className='flex items-center text-muted-foreground'>
              <p className='flex items-center'>{selectedAsset?.type}</p>
              <p className='flex items-center'>
                <Dot size={16} />
                Serial: {selectedAsset?.serial_number}
              </p>
            </div>
          </Box>
          <Box className='flex items-center gap-3'>
            <Button
              variant='outline'
              className='h-[40px] px-4 py-2 text-sm  text-[#09090B] hover:bg-red-50'
              rightSection={<SquarePen size={16} />}
              onClick={() =>
                navigate(`/assets/${assetsId}/edit?plantId=${plantId}`, {
                  state: { assetData: selectedAsset },
                })
              }
            >
              Edit Details
            </Button>
            <div
              className={` border capitalize  ${
                selectedAsset?.status === 'active'
                  ? 'bg-green-50  text-green-600'
                  : selectedAsset?.status === 'inactive'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-gray-50 text-gray-600'
              } flex w-fit items-center justify-center rounded-lg px-2 py-1  text-sm font-semibold`}
            >
              {selectedAsset?.status}
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
            className={`text-base font-medium leading-5 ${selectedAsset?.status === 'active' ? 'text-destructive' : 'text-green-500'}`}
          >
            {' '}
            {checkUserTypeMessage(selectedAsset?.status)} Asset
          </p>
          <p className='text-sm font-medium leading-5 text-[#71717A]'>
            This will {checkUserTypeMessage(selectedAsset?.status)} the Asset and all the related details
          </p>
        </Box>

        <Button
          className={`mt-2 h-[40px] w-[128px] self-end rounded-[6px] bg-destructive text-sm font-medium text-[#FAFAFA]  ${getUserTypeStyle(selectedAsset?.status)}`}
          onClick={() => setOpen(true)}
          // loading={isLoading}
        >
          {checkUserTypeMessage(selectedAsset?.status)}
        </Button>
      </Box>
      <Box>
        <Button
          variant='outline'
          onClick={BackNavigation}
          className='mt-6 h-[40px] w-[65px] self-end px-4 py-2 text-sm  text-[#09090B] hover:bg-red-50'
        >
          Back
        </Button>
      </Box>

      {open && (
        <ConfirmDeleteModal
          isOpen={open}
          onClose={() => setOpen(false)}
          width='407px'
          title={checkUserTypeMessage(selectedAsset?.status)}
          description={`This will ${checkUserTypeMessage(selectedAsset?.status)} the Asset and all the related details.`}
        >
          <DeleteAssetModel
            handleDeleteOrganization={handleDeleteOrganization}
            selectedAsset={selectedAsset}
          />
        </ConfirmDeleteModal>
      )}
    </>
  )
}
