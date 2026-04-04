import VectorIcon from '@/assets/Vector.svg'
import { Box } from '@chakra-ui/react/box'
interface FeedbackButtonProps {
  onClick?: () => void
}

export const FeedbackButton = ({ onClick }: FeedbackButtonProps) => (
  <Box>
    <div
      onClick={onClick}
      role='button'
      className='inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[20px] bg-violet-500 px-3'
    >
      <img className='h-3.5 w-3.5' src={VectorIcon} alt='add new' />
    </div>
  </Box>
)
