import { IconDownload } from '@tabler/icons-react'

import { Box } from '@chakra-ui/react/box'
interface AddNewUploadButtonProps {
  onClick?: () => void
}

export const DownloadBtn = ({ onClick }: AddNewUploadButtonProps) => (
  <Box>
    <div
      onClick={onClick}
      role='button'
      className='inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[20px] bg-slate-100 px-3'
    >
      <IconDownload color='#606060' className='h-3.5 w-3.5' />
    </div>
  </Box>
)
