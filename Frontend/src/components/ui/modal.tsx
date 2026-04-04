import { Flex } from '@chakra-ui/react'
import React from 'react'

interface ModalProps {
  isOpen: boolean
  showStatus?: boolean
  onClose?: () => void
  title?: string
  subTitile?: string
  height?: string
  width?: string
  status?: string
  className?: string
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subTitile = 'Please Fill out following details',
  height = '600px',
  width = '600px',
  status,
  showStatus = false,
  className,
  children,
}) => {
  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-stone-300/80 backdrop-blur-[2px]'
      onClick={onClose}
    >
      <div
        className={`relative max-h-[90vh] overflow-y-auto rounded-lg bg-white p-8 shadow-lg dark:bg-background ${className || ''}`}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        <Flex className='justify-between'>
          <Flex className='flex-col'>
            {/* Title */}
            {title && (
              <h2 className='justify-start self-stretch text-2xl font-bold text-neutral-800 '>{title}</h2>
            )}
            {/* subTitile */}
            {subTitile && (
              <h2 className='text-placeholder justify-start self-stretch text-xs font-semibold capitalize not-italic '>
                {subTitile}
              </h2>
            )}
          </Flex>
          {showStatus && (
            <span className='text-sm font-semibold leading-tight text-neutral-800'>
              Status -
              <span
                className={`ml-2.5 inline-block rounded-md px-[16px] py-[10px] text-center text-[14px] ${
                  status === 'completed'
                    ? 'bg-color-light_green text-color-green'
                    : 'bg-color-light_red text-color-red'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </span>
          )}
        </Flex>
        {/* Modal Content */}
        <div className='mt-4 '>{children}</div>
      </div>
    </div>
  )
}

export default Modal
