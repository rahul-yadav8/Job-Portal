import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslations } from 'use-intl'
import { useAuth } from '@/routes'
import { useNavigate } from 'react-router-dom'
import { useProfile } from '@/pages/profile/profileContext'
import { useEffect, useState } from 'react'
import profileDropdown from '@/assets/nav/More.svg'
import userProfile from '@/assets/nav/user_profile.svg'
import DropArrow from '@/assets/nav/Drop Down.svg'
import flag_english from '@/assets/nav/image 15.svg'
// import bellIcon from '@/assets/nav/bell_icon.svg'

import { Flex } from '@chakra-ui/react'
// import { SearchInput } from './ui/SearchInput'

export function UserNav() {
  // const [searchTerm, setSearchTerm] = useState('')

  const t = useTranslations('userNav')
  const navigate = useNavigate()
  const {
    actions: { logout },
  } = useAuth()

  const {
    state: { profileList },
    actions: { getAll },
  } = useProfile()

  useEffect(() => {
    getAll()
  }, [])

  console.log('profileList', profileList)

  const firstName = profileList?.firstName || 'User'
  const lastName = profileList?.lastName || ''
  const email = profileList?.email || 'user@example.com'

  const handleNavigate = () => {
    navigate('/profile')
  }
  const handleNavigateDealer = () => {
    const dealerID = localStorage.getItem('dealerID')
    navigate(`/dealers/${dealerID}`)
  }

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value)
  // }

  return (
    <div className='flex flex-1 justify-end gap-4'>
      {/* <SearchInput
        width='388px'
        value={searchTerm}
        onChange={handleSearchChange}
        onClear={() => setSearchTerm('')}
      />

      <Flex className='relative'>
        <img src={bellIcon} alt='bell icon' />
        <span className=' absolute right-0 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F93C65] text-xs font-bold text-sidebar-primary-foreground'>
          0
        </span>
      </Flex> */}

      {/*<DropdownMenu>*/}
      {/*  <DropdownMenuTrigger asChild>*/}
      {/*    <Flex className='items-center gap-3 '>*/}
      {/*      <Flex className='items-center gap-2 '>*/}
      {/*        <img src={flag_english} alt='flag img' />*/}
      {/*        <span className='text-sm font-semibold text-[#646464]'>English</span>*/}
      {/*      </Flex>*/}

      {/*      <img src={DropArrow} className='h-1.5 w-2.5' alt='profile-dropdown' />*/}
      {/*    </Flex>*/}
      {/*  </DropdownMenuTrigger>*/}
      {/*  <DropdownMenuContent className='w-56' align='end' forceMount>*/}
      {/*    <DropdownMenuGroup>*/}
      {/*      <DropdownMenuItem>English</DropdownMenuItem>*/}
      {/*      /!*<DropdownMenuItem>French</DropdownMenuItem>*!/*/}
      {/*    </DropdownMenuGroup>*/}
      {/*  </DropdownMenuContent>*/}
      {/*</DropdownMenu>*/}
      <img
        src={profileList?.profilePicture || userProfile}
        alt='profile'
        className='h-10 w-10 rounded-full border border-gray-300 object-cover'
        onError={(e) => (e.currentTarget.src = userProfile)}
      />
      <div className='flex flex-col space-y-1'>
        <p className='text-sm font-bold text-[#404040]'>{`${firstName} ${lastName}`}</p>
        <p className='text-xs leading-none text-[#565656] text-muted-foreground'>{email}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <img src={profileDropdown} alt='profile-dropdown' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleNavigate}>{t('profile')}</DropdownMenuItem>
            <DropdownMenuItem onClick={handleNavigateDealer}>Dealer</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (confirm('Are you sure you want to logout?')) {
                  logout()
                }
              }}
            >
              {t('log_out')}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
