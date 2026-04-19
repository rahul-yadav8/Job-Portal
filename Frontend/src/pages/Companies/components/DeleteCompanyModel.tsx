import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Box } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

export type deactivateProps = {
  handleDeleteOrganization: () => void
  selectedUser: any
  loading: boolean
}

export default function DeleteCompanyModel({
  handleDeleteOrganization,
  selectedUser,
  loading,
}: deactivateProps) {
  const [name, setName] = useState('')

  const handleDelete = () => {
    if (name === selectedUser) {
      handleDeleteOrganization()
    } else {
      toast({
        title: 'Error',
        description: 'Name does not match. Please type the correct name to proceed',
      })
    }
  }

  return (
    <div className='flex flex-col pb-4'>
      <Box className='flex flex-col gap-1'>
        <p>To Confirm, type "{selectedUser}" in the box below</p>
        <Input placeholder='Type Here...' value={name} onChange={(e) => setName(e.target.value)} />
      </Box>
      <Button
        className={`mt-8 h-[40px] w-[128px] self-end rounded-[6px] text-base font-normal text-[#FAFAFA]`}
        loading={loading}
        variant={'destructive'}
        rightSection={<Trash2 size={16} />}
        onClick={() => handleDelete()}
      >
        {loading ? 'Deleting' : 'Delete'}
      </Button>
    </div>
  )
}
