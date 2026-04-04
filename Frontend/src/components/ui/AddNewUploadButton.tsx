import fileUploadIcon from '@/assets/filter/fileupload-icon.svg'
import { Box } from '@chakra-ui/react/box'
interface AddNewUploadButtonProps {
  onClick?: () => void
}

export const AddNewUploadButton = ({ onClick }: AddNewUploadButtonProps) => (
  <Box>
    <div
      onClick={onClick}
      role='button'
      className='inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[20px] bg-violet-500 px-3'
    >
      <img className='h-3.5 w-3.5' src={fileUploadIcon} alt='add new upload' />
    </div>
  </Box>
)