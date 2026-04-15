import Assets from '@/assets/sidebar/Assets'
import AssetsGroup from '@/assets/sidebar/Assets-group'
import Dashboard from '@/assets/sidebar/Dashboard'
import ManageUsers from '@/assets/sidebar/ManageUsers'
import Organization from '@/assets/sidebar/Organization'
import AssetsLayout from '@/pages/ClientFlow/Assets/AssetsLayout'
import PlantsLayout from '@/pages/ClientFlow/Plants/PlantsLayout'
import UserLayout from '@/pages/ClientFlow/ManageUser/UserLayout'
import OrganizationLayout from '@/pages/AdminFlow/organization/OrganizationLayout'
import OrgLayout from '@/pages/AdminFlow/orgUsers/OrgLayout'
import Database from '@/assets/sidebar/Database'
import UserManagementLayout from '@/pages/AdminFlow/User-Management/UserManagementLayout'
import { Role } from '@/utils/roleConfig'
import PlantsIcon from '@/assets/sidebar/Plants'
import JobsLayout from '@/pages/UserFlow/Jobs/JobsLayout'
import RulesLayout from '@/pages/UserFlow/Rules/RulesLayout'
import Jobs from '@/assets/sidebar/Jobs'
import DashboardLayout from '@/pages/AdminFlow/dashboard/DashboardLayout'
import PredictionsLayout from '@/pages/UserFlow/Predictions/PredictionsLayout'
import Job from '@/pages/Job/Job'
import ManageJobLayout from '@/pages/Companies/CompaniesLayout'
import CompanyProfile from '@/pages/CompanyProfile/CompanyProfile'
import ProfileDetails from '@/pages/profile/ProfileDetail'
import CompaniesLayout from '@/pages/Companies/CompaniesLayout'

export interface AppRoute {
  title: string
  path: string
  element: JSX.Element
  icon?: JSX.Element
  iconActive?: JSX.Element
  roles: Role[]
  showInSidebar?: boolean
  placement?: string
}

export const APP_ROUTES: AppRoute[] = [
  {
    title: 'Dashboard',
    path: '/dashboard/*',
    element: <DashboardLayout />,
    icon: <Dashboard color='#333' />,
    iconActive: <Dashboard color='#fff' />,
    roles: ['employer'],
    showInSidebar: true,
    placement: 'top',
  },
  {
    title: 'Jobs',
    path: '/job/*',
    element: <Job />,
    icon: <PlantsIcon color='#333' />,
    iconActive: <PlantsIcon color='#fff' />,
    roles: ['employer'],
    showInSidebar: true,
    placement: 'top',
  },

  {
    title: 'Companies',
    path: '/companies/*',
    element: <CompaniesLayout />,
    icon: <ManageUsers color='#333' />,
    iconActive: <ManageUsers color='#fff' />,
    roles: ['employer'],
    showInSidebar: true,
    placement: 'top',
  },

  // {
  //   title: 'Plants',
  //   path: '/plants',
  //   element: <PlantsLayout />,
  //   icon: <PlantsIcon color='#333' />,
  //   iconActive: <PlantsIcon color='#fff' />,
  //   roles: ['tenant-admin'],
  //   showInSidebar: true,
  //   placement: 'top',
  // },

  // {
  //   title: 'Plant Details',
  //   path: '/plants/:id',
  //   element: <PlantsLayout />,
  //   roles: ['tenant-admin'],
  //   showInSidebar: false,
  //   placement: 'top',
  // },

  // {
  //   title: 'Assets',
  //   path: '/assets/*',
  //   element: <AssetsLayout />,
  //   icon: <Assets color='#333' />,
  //   iconActive: <Assets color='#fff' />,
  //   roles: ['tenant-admin', 'standard-user'],
  //   showInSidebar: true,
  //   placement: 'top',
  // },

  // {
  //   title: 'Manage Users',
  //   path: '/users',
  //   element: <UserLayout />,
  //   icon: <ManageUsers color='#333' />,
  //   iconActive: <ManageUsers color='#fff' />,
  //   roles: ['tenant-admin'],
  //   showInSidebar: true,
  //   placement: 'top',
  // },
  // {
  //   title: 'Manage Users',
  //   path: '/users/:id',
  //   element: <UserLayout />,
  //   icon: <ManageUsers color='#333' />,
  //   iconActive: <ManageUsers color='#fff' />,
  //   roles: ['tenant-admin'],
  //   showInSidebar: false,
  //   placement: 'top',
  // },

  // {
  //   title: 'Organization',
  //   path: '/organizations/*',
  //   element: <OrganizationLayout />,
  //   icon: <Organization color='#333' />,
  //   iconActive: <Organization color='#fff' />,
  //   roles: ['super-admin'],
  //   showInSidebar: true,
  //   placement: 'top',
  // },

  // {
  //   title: 'Organization Users',
  //   path: '/org-users/*',
  //   element: <OrgLayout />,
  //   icon: <ManageUsers color='#333' />,
  //   iconActive: <ManageUsers color='#fff' />,
  //   roles: ['super-admin'],
  //   showInSidebar: true,
  //   placement: 'top',
  // },

  // {
  //   title: 'Rules',
  //   path: '/rules/*',
  //   element: <RulesLayout />,
  //   icon: <AssetsGroup color='#333' />,
  //   iconActive: <AssetsGroup color='#fff' />,
  //   roles: ['standard-user'],
  //   showInSidebar: true,
  //   placement: 'top',
  // },

  // {
  //   title: 'Jobs',
  //   path: '/jobs/*',
  //   element: <JobsLayout />,
  //   icon: <Jobs color='#333' />,
  //   iconActive: <Jobs color='#fff' />,
  //   roles: ['standard-user'],
  //   showInSidebar: true,
  //   placement: 'top',
  // },

  // {
  //   title: 'Predictions',
  //   path: '/predictions/*',
  //   element: <PredictionsLayout />,
  //   icon: <ManageUsers color='#333' />,
  //   iconActive: <ManageUsers color='#fff' />,
  //   roles: ['standard-user'],
  //   showInSidebar: true,
  //   placement: 'top',
  // },

  // {
  //   title: 'Reports & Exports',
  //   path: '/reports/*',
  //   element: <OrganizationLayout />,
  //   icon: <ManageUsers color='#333' />,
  //   iconActive: <ManageUsers color='#fff' />,
  //   roles: ['standard-user'],
  //   showInSidebar: true,
  //   placement: 'top',
  // },
  // {
  //   title: 'User Management',
  //   path: '/user-management/*',
  //   element: <UserManagementLayout />,
  //   icon: <Database color='#333' />,
  //   iconActive: <Database color='#fff' />,
  //   roles: ['super-admin'],
  //   showInSidebar: true,
  //   placement: 'bottom',
  // },
]
