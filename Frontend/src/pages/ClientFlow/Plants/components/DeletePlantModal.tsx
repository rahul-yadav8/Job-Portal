import { useState } from 'react'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Box } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import { checkUserTypeMessage, getUserTypeStyle } from '@/utils/constants'

export default function DeletePlantModal({
  selectedPlant,
  handleDeleteOrganization,
}: {
  selectedPlant: any
  handleDeleteOrganization: any
}) {
  const [inputValue, setInputValue] = useState('')

  const handleDelete = () => {
    if (inputValue === selectedPlant?.name) {
      handleDeleteOrganization(inputValue)
    } else {
      toast({
        title: 'Plant Name Mismatch',
        description: 'Plant name does not match. Please type the correct Plant name to proceed.',
      })
    }
  }
  return (
    <div className='flex flex-col pb-4'>
      <Box className='flex flex-col gap-1'>
        <p>To Confirm, type "{selectedPlant?.name}" in the box below</p>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Type here...'
        />
      </Box>
      <Button
        className={`mt-8 h-[40px] w-[128px] self-end rounded-[6px]  text-sm font-medium text-[#FAFAFA]  ${getUserTypeStyle(selectedPlant?.status)}`}
        onClick={handleDelete}
      >
        {checkUserTypeMessage(selectedPlant?.status)}
      </Button>
    </div>
  )
}
