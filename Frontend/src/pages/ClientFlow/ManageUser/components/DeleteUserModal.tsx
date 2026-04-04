import { useState } from 'react'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Box } from '@chakra-ui/react'
import { Trash2 } from 'lucide-react'

export default function DeleteUserModel({
  userName,
  status,
  handleDeleteOrganization,
}: {
  userName: string
  status: string
  handleDeleteOrganization: any
}) {
  const [inputValue, setInputValue] = useState('')

  const handleDelete = () => {
    if (inputValue === userName) {
      handleDeleteOrganization()
    } else {
      toast({
        title: 'Plant Name Mismatch',
        description: 'User name does not match. Please type the correct User name to proceed.',
      })
    }
  }
  return (
    <div className='flex flex-col pb-4'>
      <Box className='flex flex-col gap-1'>
        <p>To Confirm, type "{userName}" in the box below</p>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Type here...'
        />
      </Box>
      <Button
        className={`mt-8 h-[40px] w-[128px] self-end rounded-[6px]  text-sm font-medium text-[#FAFAFA] ${status === 'active' ? '!border-destructive bg-destructive hover:bg-destructive/80' : 'bg-green-500 hover:bg-green-500/80'}`}
        onClick={handleDelete}
      >
        {status === 'active' ? 'Deactivate' : 'Activate'}
      </Button>
    </div>
  )
}
