import { Flex, Text } from '@chakra-ui/react'
import { useLocation } from 'react-router'
import { HomeIcon } from '@radix-ui/react-icons'
import { Link } from 'react-router-dom'
import { useAuth } from '@/routes'

export interface HeaderProps {}
export const Header: React.FC<HeaderProps> = (_props: HeaderProps) => {
  const location = useLocation()
  const isHome = location.pathname === '/home'
  const {
    actions: { logout },
  } = useAuth()
  return (
    <Flex
      justifyContent={'space-between'}
      alignItems={'center'}
      padding={'20px'}
      borderBottom={'1px solid #E4E4E7'}
    >
      <Flex gap={'20px'} justifyItems={'center'} alignItems={'center'}>
        {
          <Link to='/'>
            <HomeIcon />
          </Link>
        }
        <Text className='text-[14px] font-medium text-[#18181B]'>
          {isHome ? 'Home' : 'SOS App'}
        </Text>
      </Flex>
      <Flex
        className='cursor-pointer items-center justify-center gap-[20px]'
        onClick={() => {
          if (confirm('Are you sure you want to logout?')) {
            // Save it!
            logout()
          }
        }}
      >
        <Flex className='h-[40px] w-[40px] items-center justify-center rounded-full bg-[#F4F4F5]'>
          <Text className='text-[14px]'>SA</Text>
        </Flex>
        <Text className='cursor-pointer font-semibold text-[#18181B]'>
          Super Admin
        </Text>
      </Flex>
    </Flex>
  )
}
