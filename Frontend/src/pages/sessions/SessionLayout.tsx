import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { SessionProvider } from './sessionContext'
import Login from './Login'
import { Box } from '@chakra-ui/react'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import logo from '@/assets/auth/logo.svg'
import Register from './Register'

export interface SessionProps {}

export const SessionLayout: React.FC<SessionProps> = (_props: SessionProps) => {
  return (
    <SessionProvider>
      <div className='login-bg relative h-screen w-full'>
        <div className='flex-center h-screen w-full'>
          <Box className='relative z-10 flex h-full w-full flex-col items-center justify-center px-4 sm:px-0'>
            <Box className='flex w-full max-w-[418px] flex-col items-center gap-6 rounded-2xl border-2 border-[rgba(255,255,255,0.91)] bg-[linear-gradient(180deg,rgba(136,219,247,0.32)_0%,rgba(255,255,255,0.32)_45.8%),linear-gradient(180deg,#fff_0%,#fff_100%)] px-6 py-8 shadow-[0_16px_40px_0_rgba(7,59,76,0.08)] backdrop-blur-md sm:gap-10 sm:px-12 sm:py-12'>
              <Box className='w-full max-w-[380px]'>
                <Routes>
                  <Route path='/login' element={<Login />} />
                  <Route path='/forgot-password' element={<ForgotPassword />} />
                  <Route path='/reset-password' element={<ResetPassword />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='*' element={<Navigate to='/login' replace />} />
                </Routes>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </div>
        <div className='absolute left-0 top-0 ml-[47px] mt-[47px]'>
          <Box className='flex '>
            <img src={logo} alt='icon' className='h-[72px] w-[72px] ' />
            <Box className='flex flex-col'>
              <p className='text-[26px] font-semibold'>Job Portal</p>
              <p className='text-[18px] font-normal '>Predictive Maintenance</p>
            </Box>
          </Box>
        </div>
      </div>
    </SessionProvider>
  )
}

export default SessionLayout
