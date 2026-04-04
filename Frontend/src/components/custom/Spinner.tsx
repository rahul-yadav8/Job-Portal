import { IconLoader } from '@tabler/icons-react'

export default function Spinner() {
  return (
    <div className='flex w-full items-center justify-center'>
      <IconLoader className='animate-spin' size={32} />
    </div>
  )
}
