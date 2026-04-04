import { Drawer, DrawerContent } from '@/components/ui/RightDrawer'
import { Box, Flex, Grid } from '@chakra-ui/react'
import { Card } from '@/components/ui/card'
import { IconX } from '@tabler/icons-react'
import { IProfile } from '@/types/profile.interface'

export interface IProfileDrawerProps {
  open?: boolean
  onClose?: () => void
  initialData?: Partial<IProfile>
}
export default function ProfileDrawer({ open = false, onClose }: IProfileDrawerProps) {
  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className='h-[90vh]'>
        <Box>
          <IconX
            className='foreground absolute right-4 top-4 h-6 w-6 cursor-pointer text-muted'
            onClick={onClose}
          />
        </Box>
        <Grid gridAutoFlow={'column'} className='h-[inherit] grid-cols-1 gap-5 p-[20px] md:grid-cols-2'>
          <Box className={`hidden bg-[url('assets/loginbg.png')] md:block`}></Box>
        </Grid>
      </DrawerContent>
    </Drawer>
  )
}
