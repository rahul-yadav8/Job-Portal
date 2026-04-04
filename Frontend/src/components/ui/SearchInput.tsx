import { X as IconX } from 'lucide-react'
import searchIcon from '@/assets/filter/Search Icon.svg'

interface SearchInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  width?: string
}

export const SearchInput = ({ value, onChange, onClear, width = '320px' }: SearchInputProps) => (
  <div className='relative w-full' style={{ maxWidth: width }}>
    <div className=' flex items-center gap-3 rounded-[29px] bg-slate-100 px-4 py-2.5'>
      <img src={searchIcon} className='h-3.5 w-3.5 flex-shrink-0' alt='search' />
      <input
        className='flex-grow bg-transparent  text-sm text-[#202224] outline-none placeholder:text-[#606060]'
        placeholder='Search'
        value={value}
        onChange={onChange}
      />
      {value && (
        <div className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-slate-100'>
          <IconX size={16} onClick={onClear} />
        </div>
      )}
    </div>
  </div>
)
