import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { checkUserTypeMessage, getUserTypeStyle } from '@/utils/constants'
import { Box } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export type deactivateProps = {
  handleDeleteOrganization: () => void
  selectedOrganization: any
  isLoading: string
}

export default function DeleteOrganizationModel({
  handleDeleteOrganization,
  selectedOrganization,
  isLoading,
}: deactivateProps) {
  const [name, setName] = useState('')

  const handleDelete = async () => {
    if (name === selectedOrganization?.organization) {
      await handleDeleteOrganization()
    } else {
      toast({
        title: 'Error',
        description:
          'Organization name does not match. Please type the correct organization name to proceed.',
      })
    }
  }

  return (
    <div className='flex flex-col pb-4'>
      <Box className='flex flex-col gap-1'>
        <p>To Confirm, type "{selectedOrganization?.organization || ''}" in the box below</p>
        <Input placeholder='Type Here...' value={name} onChange={(e) => setName(e.target.value)} />
      </Box>
      <Button
        className={`mt-8 h-[40px] w-[128px] self-end rounded-[6px] ${getUserTypeStyle(selectedOrganization?.status || '')}  text-sm font-medium text-[#FAFAFA]`}
        onClick={() => handleDelete()}
      >
        {checkUserTypeMessage(selectedOrganization?.status)}
      </Button>
    </div>
  )
}
