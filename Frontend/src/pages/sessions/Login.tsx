import { UserAuthForm } from './components/user-auth-form'
import Logo from '@assets/auth/loginLogo.svg'

export default function Login() {
  return (
    <>
      <div className='flex justify-center'>
        <div className='flex h-[56px] w-[56px] items-center gap-2.5 rounded-2xl border border-solid border-white p-4 shadow-[0_8px_14.4px_0_rgba(33,164,229,0.10)] [background:rgba(255,255,255,0.70)]'>
          
          <img src={Logo} alt='Motion Grid Logo' className='w-8 h-8' draggable={false} />
        </div>
      </div>
      <div className='flex flex-col items-center justify-center gap-3 mt-6 mb-8'>
        <h1 className='text-center text-[32px] font-medium leading-6 text-[#0F172A]'>Welcome Back!</h1>
        <p className='text-sm font-normal text-[#4B5563]'>
          Please fill in the details to login to your account
        </p>
      </div>
      <UserAuthForm />
    </>
  )
}
