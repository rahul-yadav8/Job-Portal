import sortIcon from '@/assets/filter/sort-icon.svg'
import { Box } from '@chakra-ui/react/box'
interface SortButtonProps {
  onClick?: () => void
}

export const SortButton = ({ onClick }: SortButtonProps) => (
  <Box>
    <div
      onClick={onClick}
      role='button'
      className='inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[20px] bg-slate-100 px-3'
    >
      <img className='h-3.5 w-3.5' src={sortIcon} alt='sort' />
    </div>
  </Box>
)
