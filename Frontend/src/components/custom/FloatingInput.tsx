import * as React from 'react'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import eyeOpenIcon from '@/assets/eye_open.svg'
import eyeCloseIcon from '@/assets/eye_closed.svg'
import { Img } from '@chakra-ui/react'
import { cn } from '@/lib/utils'

interface FloatingInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  eyeIcon?: boolean
  className?: string
  disabled?: boolean
  maxLength?: number
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  eyeIcon = false,
  className,
  disabled = false,
  maxLength,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const inputType = eyeIcon ? (isPasswordVisible ? 'text' : 'password') : type

  return (
    <div className='relative flex w-full flex-col gap-[6px]'>
      <Label htmlFor={id} className='text-sm font-medium text-foreground'>
        {label}
      </Label>

      <Input
        id={id}
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          'placeholder:text-placeholder flex h-[42px] font-geist text-sm font-normal tracking-tight text-foreground placeholder:text-sm placeholder:font-normal placeholder:leading-6 focus:border-2 focus:border-primary focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:text-secondary-foreground',
          className
        )}
        disabled={disabled}
      />

      {eyeIcon && type === 'password' && (
        <span
          role='button'
          className='absolute right-1.5 top-7 cursor-pointer p-3'
          onClick={() => setIsPasswordVisible((prev) => !prev)}
        >
          <Img src={isPasswordVisible ? eyeCloseIcon : eyeOpenIcon} alt='Toggle visibility' />
        </span>
      )}
    </div>
  )
}
