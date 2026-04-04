import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { checkUserTypeMessage, getUserTypeStyle } from '@/utils/constants'
import { Box } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface assetsDeleteProps {
  handleDeleteOrganization: () => void
  selectedAsset: any
}

export default function DeleteAssetModel({ handleDeleteOrganization, selectedAsset }: assetsDeleteProps) {
  const [name, setName] = useState('')

  const handleDelete = () => {
    if (name === selectedAsset?.name) {
      handleDeleteOrganization()
    } else {
      toast({
        title: 'Error',
        description: 'Asset name does not match. Please type the correct asset name to proceed.',
      })
    }
  }

  return (
    <div className='flex flex-col pb-4'>
      <Box className='flex flex-col gap-1'>
        <p>To Confirm, type {selectedAsset?.name} in the box below</p>
        <Input placeholder='Type Here...' value={name} onChange={(e) => setName(e.target.value)} />
      </Box>

      <Button
        className={`mt-8 h-[40px] w-[128px] self-end rounded-[6px] bg-destructive text-sm font-medium text-[#FAFAFA]  ${getUserTypeStyle(selectedAsset?.status)}`}
        onClick={handleDelete}
      >
        {checkUserTypeMessage(selectedAsset?.status)}
      </Button>
    </div>
  )
}
