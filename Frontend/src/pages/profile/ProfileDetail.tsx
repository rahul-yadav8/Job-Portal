import PageLayout from '@/templates/PageLayout'
import { Route, Routes, useParams } from 'react-router-dom'
import SidebarNav from './components/SidebarNav'
import { IconTool, IconUser } from '@tabler/icons-react'
import { useProfile } from './profileContext'
import { useEffect, useState } from 'react'
import BasicInfo from './modules/BasicInfo/BasicInfo'
import { Flex, Spinner } from '@chakra-ui/react'
import ChangePasswordInfo from './modules/ChangePassword/ChangepasswordInfo'
export interface IProfileDetailsProps {}

export default function ProfileDetails(props: IProfileDetailsProps) {
  const params = useParams()
  const [loader, SetLoader] = useState(true)
  const {
    state: { profileList },
    actions: { getAll: getAllProfiles },
  } = useProfile()
  useEffect(() => {
    getAllProfiles({}, true)
  }, [])
  useEffect(() => {
    if (profileList.length === 0) {
      SetLoader(true)
    } else {
      SetLoader(false)
    }
  }, [profileList, loader])

  const description = 'Manage Profile details , change password here'

  return (
    <>
      <div className='flex h-full flex-1 flex-col space-y-8 md:space-y-2 lg:flex-row lg:space-x-[30px] lg:space-y-0'>
        <aside className='scrollbar-none sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-[200px] overflow-y-auto'>
          <div className='pb-6'>
            <SidebarNav
              items={sidebarNavItems.map((x) => ({
                ...x,
                href: x.href.replace(':id', params.id ?? ''),
              }))}
            />
          </div>
        </aside>

        <div className='flex flex-1 flex-col p-1 pr-4'>
          <Flex className='justify-between'>
            <PageLayout title={profileList?.firstName ?? '---'} desctiprion={description} />
          </Flex>
          <Routes>
            <Route path='/' element={<BasicInfo />} />
            <Route path='/changepassword' element={<ChangePasswordInfo />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Basic Info',
    icon: <IconUser size={18} />,
    href: '/profile',
  },
  {
    title: 'Change Password',
    icon: <IconTool size={18} />,
    href: '/profile/changepassword',
  },
]
