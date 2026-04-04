import { IconX } from '@tabler/icons-react'
import searchIcon from '@/assets/filter/Search Icon.svg'

interface ISearchProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  placeholder?: string
}

export function Search({ searchTerm, setSearchTerm, placeholder }: ISearchProps) {
  return (
    <div className='relative flex h-[38px] w-full items-center gap-3 rounded-[6px] border border-[#E4E4E7] px-4'>
      <img src={searchIcon} className='h-3.5 w-3.5' alt='search' />

      <input
        className='text-placeholder w-full bg-transparent text-[14px] outline-none'
        placeholder={placeholder || 'Search by name...'}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <IconX
          onClick={() => setSearchTerm('')}
          className='absolute right-3 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700'
        />
      )}
    </div>
  )
}
