'use client'

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'

type RightDrawerProps = {
  isOpen: boolean
  onClose: () => void
  btnRef?: React.RefObject<any>

  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode

  width?: string | number
}

export default function RightDrawer({
  isOpen,
  onClose,
  btnRef,
  title,
  description,
  children,
  footer,
  width = '384px',
}: RightDrawerProps) {
  return (
    <Drawer isOpen={isOpen} placement='right' onClose={onClose} finalFocusRef={btnRef}>
      <DrawerOverlay />

      <DrawerContent w={width} maxW={width}>
        <DrawerCloseButton />

        {(title || description) && (
          <DrawerHeader className='flex flex-col gap-1.5'>
            {title && <p className='text-[18px] font-semibold leading-5 text-[#09090B]'>{title}</p>}

            {description && <p className='text-sm font-normal leading-5 text-[#71717A]'>{description}</p>}
          </DrawerHeader>
        )}

        <DrawerBody>{children}</DrawerBody>

        {footer}
      </DrawerContent>
    </Drawer>
  )
}
