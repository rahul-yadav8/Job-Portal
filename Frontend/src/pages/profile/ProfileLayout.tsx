import { Box } from '@chakra-ui/react'
import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import { DealerProvider } from '../dealers/dealerContext'
import ProfileList from './ProfileList'
import ProfileDetails from './ProfileDetail'
import { ProfileProvider } from './profileContext'
import { DealershipProvider } from '../dealerships/dealershipContext'

const ProfileLayout: React.FC = () => {
  return (
    <ProfileProvider>
      <DealershipProvider>
        <Box className='user-main' id='user-main' height={'100%'}>
          <Routes>
            <Route path='/*' element={<ProfileDetails />} />
          </Routes>
          <Outlet />
        </Box>
      </DealershipProvider>
    </ProfileProvider>
  )
}

export default ProfileLayout
