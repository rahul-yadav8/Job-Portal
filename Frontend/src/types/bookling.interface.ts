import { string } from 'zod'
import { IAdvancesInfomation, IBasicInfomation, IHoursOfOperations } from './dealership.interface'
import { IUser } from './user.interface'
import { IDealer } from './dealer.interface'

export interface IBooking {
  _id: string
  status: boolean
  customer: string
  dealer: string
  dealership: string
  date: string
  slot: string
  vehicle: string
  make: string
  model: string
  licensePlate: string
  serviceItems: string[]
  comments: string
  bookingId: string
}

export interface IBookingEdit {
  _id: string
  status: boolean
  customer: IBookingCustomer
  dealer: IDealerBooking
  dealership: IDealershipBooking
  date: string
  slot: string
  vehicle: string
  make: string
  model: string
  licensePlate: string
  serviceItems: string[]
  comments: string
  bookingId: string
}

export interface IBookingHistory {
  _id: string
  deletedAt: string
  status: string
  feedbackStatus: string
  date: string
  slot: string
  bookingId: number
  make: string
  model: string
  comments: string
  licensePlate: string
  customer: IBookingCustomer
  dealer: IDealerBooking
  dealership: IDealershipBooking
}
export interface IDealerBooking {
  _id: string
  deletedAt: string
  name: string
  slug: string
  status: 'active' | 'inactive' | 'draft'
  appId: string
  createdAt: string
  updatedAt: string
  owner: IUser | string
}

export interface IDealershipBooking {
  _id: string
  deletedAt: any
  dealer: Partial<IDealer> | string
  address: any
  basicInfomation: IBasicInfomation
  advancesInfomation: IAdvancesInfomation
  hoursOfOperations: IHoursOfOperations
  status: string
  name: string
  slug: string
  tagline: string
  logo: any
  profileImg: any
  website: string
  privacyPolicyURL: string
  comments: string
  welcomeMessage: string
  createdAt: string
  updatedAt: string
}

export interface IBookingCustomer {
  _id: string
  userInvitationStatus: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  dealer: string
}
