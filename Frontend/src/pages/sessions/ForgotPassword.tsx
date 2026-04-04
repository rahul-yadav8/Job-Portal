import { ForgotForm } from './components/forgot-form'
import mail from '@assets/auth/mail.svg'

export default function ForgotPassword() {
  return (
    <>
      <div className='flex justify-center'>
        <div className='flex h-[56px] w-[56px] items-center gap-2.5 rounded-2xl border border-solid border-white p-4 shadow-[0_8px_14.4px_0_rgba(33,164,229,0.10)] [background:rgba(255,255,255,0.70)]'>
          {/* <Logout /> */}
          <img src={mail} alt='Motion Grid Logo' className='h-8 w-8' draggable={false} />
        </div>
      </div>
      <div className='mb-8 mt-6 flex flex-col items-center justify-center gap-3'>
        <h1 className='text-center text-[32px] font-medium leading-6 text-[#0F172A]'>Forget Password</h1>
        <p className='text-sm font-normal text-[#4B5563]'>Enter your registered email</p>
      </div>
      <ForgotForm />
    </>
  )
}
