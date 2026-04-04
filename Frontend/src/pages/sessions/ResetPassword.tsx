import ResetPasswordForm from './components/reset-password-form'
import Lock from '@assets/auth/Lock.svg'

export default function ResetPassword() {
  return (
    <>
      <div className='flex justify-center'>
        <div className='flex h-[56px] w-[56px] items-center gap-2.5 rounded-2xl border border-solid border-white p-4 shadow-[0_8px_14.4px_0_rgba(33,164,229,0.10)] [background:rgba(255,255,255,0.70)]'>
          {/* <Logout /> */}
          <img src={Lock} alt='Motion Grid Logo' className='h-6 w-6' draggable={false} />
        </div>
      </div>
      <div className='mb-8 mt-6 flex flex-col items-center justify-center gap-3'>
        <h1 className='text-center text-[32px] font-medium leading-6 text-[#0F172A]'>Change Password</h1>
        <p className='text-sm font-normal text-[#4B5563]'>Change your password by filling in the details</p>
      </div>
      <ResetPasswordForm />
    </>
  )
}
