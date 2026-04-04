import { IUser } from './user.interface'

export interface ISectionItem {
  slug: string
  icon?: string
  img?: string
  displayTitle: string
  description: string
  deeplinkEnabled: boolean
  deeplinkType: 'in-app' | 'webpage' | 'open-app' | 'phonenumber' | 'flash'
  deeplink: string
  items: ISectionItem[]
}

export interface ISection {
  sectionType: 'banner' | 'menu'
  displayType: 'half' | 'full' | 'small'
  layoutType?: 'right-three' | 'left-three' | 'half' | 'small' | 'full'
  deeplinkEnabled: boolean
  deeplinkType: 'in-app' | 'webpage'
  deeplink: string
  displayTitle: string
  items: ISectionItem[]
}

export interface IDealer {
  _id: string
  deletedAt: any
  name: string
  slug: string
  status: 'active' | 'inactive' | 'draft'
  appId: string
  createdAt: string
  updatedAt: string
  owner: IUser | string
  enableBookingForAll: boolean
  enabledBookingDealerships: string[]
  isPulseBookingEngine: boolean
  modules: IModulePermission[]
  defaultLayout: {
    layouts: ISection[]
  }
}

export interface IDealerDealerships {
  _id: string
  dealer: string
  name: string
  tagline: string
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
  modules: IModulePermission[]
  enableBookingForAll: boolean
  isPulseBookingEngine: boolean
  enabledBookingDealerships: string[]
  defaultLayout: {
    layouts: ISection[]
  }
}

export interface IDealerCustomers {
  _id: string
  dealer: string
  name: string
  slug: string
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
  modules: IModulePermission[]
  defaultLayout: {
    layouts: ISection[]
  }
}

export interface IModulePermission {
  slug: string
  moduleType: string
  isEnabled: boolean
  icon: string
  displayTitle: string
  description: string
  deeplinkEnabled: boolean
  deeplinkType: string
  deeplink: string
  modules: IModulePermission[]
}
