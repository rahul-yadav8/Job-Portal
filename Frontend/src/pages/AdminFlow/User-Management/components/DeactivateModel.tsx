import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { checkUserTypeMessage, getUserTypeStyle } from '@/utils/constants'
import { Box } from '@chakra-ui/react'
import { RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'

export type deactivateProps = {
  handleDeactivate: (name: string) => void
  selectedUser: any
}

export default function DeactivateModel({ handleDeactivate, selectedUser }: deactivateProps) {
  const [name, setName] = useState('')

  const handleDelete = () => {
    if (name.toLowerCase() === selectedUser?.full_name.toLowerCase()) {
      handleDeactivate(name)
    } else {
      toast({
        title: 'Error',
        description: 'Name does not match. Please type the correct name to proceed',
      })
    }
  }

  return (
    <div className='flex flex-col pb-4'>
      <Box className='flex flex-col gap-2'>
        <p>{`To Confirm, type ${selectedUser?.full_name} in the box below`}</p>
        <Input
          placeholder='Type Here...'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='p-3'
        />
      </Box>
      <Button
        className={`mt-8 h-[40px] w-[128px] self-end rounded-[6px]  text-sm font-medium text-[#FAFAFA] ${getUserTypeStyle(selectedUser.status)}`}
        //   loading={isLoading}
        rightSection={
          selectedUser?.status === 'active' ? <Trash2 size={16} /> : <RotateCcw className='h-4 w-4' />
        }
        onClick={() => handleDelete()}
      >
        {checkUserTypeMessage(selectedUser.status)}
      </Button>
    </div>
  )
}
