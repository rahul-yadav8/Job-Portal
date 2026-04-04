import { IconDownload } from '@tabler/icons-react'
import { Box } from '@chakra-ui/react/box'

interface FilterButtonProps {
  onClick?: () => void
  label?: string
}

export const DownloadButton = ({ onClick, label }: FilterButtonProps) => (
  <Box flexShrink={0}>
    <div
      onClick={onClick}
      role='button'
      className='inline-flex h-[38px] cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-[20px] bg-violet-500 px-3'
    >
      <IconDownload color='white' className='h-3.5 w-3.5' />
      {label && (
        <span className='whitespace-nowrap text-xs font-medium text-sidebar-primary-foreground'>{label}</span>
      )}
    </div>
  </Box>
)
