import React from 'react'
import Navbar from '@/components/custom/Navbar'
import { Box, Flex } from '@chakra-ui/react'

interface PageLayoutProps {
  title: string
  description?: string
  action?: React.ReactNode

  filters?: React.ReactNode

  children: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, description, action, filters, children }) => {
  return (
    <Flex className='flex flex-col gap-4'>
      <Navbar title={title} description={description} action={action} />

      {filters && <Flex justifyContent={'space-between'}>{filters}</Flex>}

      <Box>{children}</Box>
    </Flex>
  )
}

export default PageLayout
