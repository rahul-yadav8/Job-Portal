import filterIcon from '@/assets/filter/filter-icon.svg'
import { Box } from '@chakra-ui/react/box'
interface FilterButtonProps {
  onClick?: () => void
}

export const FilterButton = ({ onClick }: FilterButtonProps) => (
  <Box>
    <div
      onClick={onClick}
      role='button'
      className='inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-[20px] bg-slate-100 px-3'
    >
      <img className='h-3.5 w-3.5' src={filterIcon} alt='filter' />
    </div>
  </Box>
)
