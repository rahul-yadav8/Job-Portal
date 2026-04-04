import { useEffect, useRef, useState } from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'
import { Dot, SquarePen, Trash2 } from 'lucide-react'
import { Button } from '@/components/custom/button'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import RightDrawer from '@/components/ui/RightDrawer'
import { useNavigate } from 'react-router-dom'
import InviteDrawer from './components/InviteDrawer'
import DeleteUserModal from './components/DeleteUserModal'
import profile from '@/assets/profile.svg'
import { useManageUsers } from './UserContext'
import { useAuth } from '@/routes'
import { getStatusColor } from '@/utils/helpers'

export default function UserDetails({ id }: { id: string }) {
  const navigation = useNavigate()
  const {
    state: { UserDetails },
  } = useAuth()

  const {
    state: { RolesList },
    actions: { getUsers, toggleActivityStatus, updateUser, getRoles },
  } = useManageUsers()

  const navigate = useNavigate()
  const btnRef = useRef(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [open, setOpen] = useState(false)
  const [UserInfo, setUserInfo] = useState<any>(null)

  const BackNavigation = () => {
    navigate(`/users`)
  }

  useEffect(() => {
    if (!UserDetails?.org_id) return

    getUsers(
      UserDetails.org_id,
      {},
      (data) => {
        setUserInfo(data)
      },
      id
    )
    getRoles(UserDetails.org_id, () => {})
  }, [UserDetails.org_id, id])

  const Deactivate = async (value) => {
    await updateUser(
      UserDetails.org_id,
      UserInfo.id,
      { status: UserInfo?.status === 'active' ? 'inactive' : 'active' },
      () => {
        getUsers(UserDetails.org_id, {}, () => {}, id)
        navigation(`/users`)
        setOpen(false)
      }
    )
  }

  const UpdateUserDetails = (values: any) => {
    updateUser(UserDetails.org_id, UserInfo.id, values, () => {
      getUsers(
        UserDetails.org_id,
        {},
        (data) => {
          setUserInfo(data)
          onClose()
        },
        id
      )
    })
  }

  return (
    <>
      <Box className='flex flex-col gap-1.5'>
        <Box className='flex items-center gap-1.5 text-2xl font-medium leading-5'>
          <p className='cursor-pointer text-[#71717A]' onClick={BackNavigation}>
            Manage Users
          </p>{' '}
          <span className=' text-[#09090B]'> / {UserInfo?.full_name || ''}</span>
        </Box>
        <p className='text-base font-normal leading-5 text-[#71717A]'>
          Invite new users to join your organization
        </p>
      </Box>

      <div className='flex flex-col gap-6'>
        <Box className='p-6 mt-8 border rounded-lg'>
          <Box className='flex justify-between'>
            <Box className='flex items-center gap-3'>
              <img src={profile} className='w-12 h-12 rounded-full' />
              <div className='flex flex-col gap-2'>
                <p className='text-[28px] font-semibold leading-5 text-[#09090B]'>
                  {UserInfo?.full_name || 'Guest'}
                </p>
                <p className='text-base font-medium leading-5 text-[#71717A]'>{UserInfo?.email || ''}</p>
              </div>
            </Box>
            <Box className='flex items-center gap-3'>
              <Button
                variant='outline'
                className='px-4 py-2 text-sm text-[#09090B] hover:bg-white/80'
                rightSection={<SquarePen size={16} />}
                onClick={() => onOpen()}
              >
                Edit Details
              </Button>
              <div
                className={`flex justify-center rounded-[8px] p-1.5  ${getStatusColor(UserInfo?.status)} capitalize`}
              >
                {UserInfo?.status || ''}
              </div>
            </Box>
          </Box>
        </Box>

        {/* <Box className='p-6 border'>
          <p className='text-textBase text-[20px] font-medium leading-5'>Recent Activity</p>
          <hr className='my-5 text-[#E4E4E7]' />
          <Box className='flex flex-col gap-5'>
            <div>
              <p className='text-sm font-semibold leading-6 text-textBase'>
                Modified project “Q4 Financials” configuration
              </p>
              <p className='text-subText text-[12px] font-normal leading-6'>Oct 21, 2023 at 10:30AM</p>
            </div>
            <div>
              <p className='text-sm font-semibold leading-6 text-textBase'>
                Modified project “Q4 Financials” configuration
              </p>
              <p className='text-subText text-[12px] font-normal leading-6'>Oct 21, 2023 at 10:30AM</p>
            </div>
            <div>
              <p className='text-sm font-semibold leading-6 text-textBase'>
                Modified project “Q4 Financials” configuration
              </p>
              <p className='text-subText text-[12px] font-normal leading-6'>Oct 21, 2023 at 10:30AM</p>
            </div>
          </Box>
        </Box> */}
        {UserInfo?.status !== 'invited' && (
          <Box className='flex items-center justify-between p-6 border rounded-lg'>
            <Box className='flex flex-col gap-[10px]'>
              <p
                className={`text-base font-medium capitalize leading-5 ${UserInfo?.status === 'active' ? 'text-destructive' : 'text-green-500'}`}
              >
                {UserInfo?.status == 'active'
                  ? `Deactivate ${UserInfo?.full_name}`
                  : `Activate ${UserInfo?.full_name}`}
              </p>
              <p className='text-sm font-medium leading-5 text-[#71717A]'>
                This will permanently {UserInfo?.status == 'active' ? `Deactivate ` : `Activate `}
                the User and all the related details
              </p>
            </Box>
            <Button
              className={` mt-2 h-[40px] w-[128px] self-end rounded-[6px]  text-sm font-medium text-[#FAFAFA] ${UserInfo?.status == 'active' ? 'bg-destructive hover:bg-destructive/80' : 'bg-green-500 hover:bg-green-500/80'}`}
              onClick={() => setOpen(true)}
            >
              {UserInfo?.status == 'active' ? `Deactivate` : `Activate`}
            </Button>
          </Box>
        )}
      </div>
      <Button
        variant='outline'
        onClick={BackNavigation}
        className='mt-6 h-[40px] w-[65px] self-end px-4 py-2 text-sm  text-[#09090B] hover:bg-red-50'
      >
        Back
      </Button>

      {open && (
        <ConfirmDeleteModal
          isOpen={open}
          onClose={() => setOpen(false)}
          width='407px'
          title={UserInfo.status === 'active' ? 'Deactivate User' : 'Activate user'}
          description={`This will ${UserInfo.status === 'active' ? 'Deactivate' : 'Activate'} the user.`}
        >
          <DeleteUserModal
            userName={UserInfo?.full_name || ''}
            handleDeleteOrganization={Deactivate}
            status={UserInfo.status}
          />
        </ConfirmDeleteModal>
      )}

      <RightDrawer
        isOpen={isOpen}
        onClose={onClose}
        btnRef={btnRef}
        title='Edit User'
        description='Send an email invitation to a user.'
      >
        <InviteDrawer
          isEdit={true}
          defaultValues={{
            role_slug: UserInfo?.role,
            email: UserInfo?.email,
            first_name: UserInfo?.first_name,
            last_name: UserInfo?.last_name,
          }}
          RolesList={RolesList}
          onSubmit={UpdateUserDetails}
        />
      </RightDrawer>
    </>
  )
}
