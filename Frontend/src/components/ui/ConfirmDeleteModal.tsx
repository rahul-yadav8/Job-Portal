import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  Divider,
  Box,
} from '@chakra-ui/react'

interface ConfirmActionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  instruction?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  width?: string
}

export default function ConfirmActionModal({
  isOpen,
  onClose,
  title,
  description,
  instruction,
  children,
  footer,
  width = '520px',
}: ConfirmActionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior='inside'>
      <ModalOverlay />

      <ModalContent maxW={width} maxH='80vh' borderRadius='12px'>
        <ModalHeader pb='0'>{title}</ModalHeader>
        <ModalCloseButton />

        <Box px={6}>
          {description && <Text color='gray.500'>{description}</Text>}
          <Divider my={2} />
          {instruction && (
            <Text fontSize='sm' fontWeight='medium' mb={3}>
              {instruction}
            </Text>
          )}
        </Box>

        <ModalBody overflowY='auto'>{children}</ModalBody>

        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  )
}
