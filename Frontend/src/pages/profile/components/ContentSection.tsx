import { Button } from '@/components/custom/button'
import { Separator } from '@/components/ui/separator'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'

interface ContentSectionProps {
  title?: string
  desc?: string
  children: JSX.Element
  extra?: React.ReactNode
}

export default function ContentSection({ title, desc, children, extra }: ContentSectionProps) {
  return (
    <div className='flex flex-1 flex-col'>
      <>
        <Flex className='items-center justify-between'>
          {title ? (
            <div className='flex-none'>
              <h3 className='text-lg font-medium'>{title}</h3>
              <p className='text-sm text-muted-foreground'>{desc}</p>
            </div>
          ) : (
            <Box></Box>
          )}
          {extra ? extra : null}
        </Flex>
        {/* {extra || title ? <Separator className='my-4 flex-none' /> : null} */}
      </>

      <div className='faded-bottom flex-1 overflow-hidden scroll-smooth md:pb-[20px] md:pl-4'>{children}</div>
    </div>
  )
}
