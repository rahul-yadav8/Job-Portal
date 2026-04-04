import { IDealer } from './dealer.interface'

export interface IFeedbacks {
  _id: string
  dealer: IDealerDetails
  booking: IBookingDetails
  owner: IOwnerDetails
  status: string
  createdAt: string
  dealership: IDealershipDetails
  vehicleDetail: IVehicleDetail[]
  formFields: IFormField[]
  updatedAt: string
  deletedAt: any
}

export type FieldType = 'text' | 'textarea' | 'rating' | 'radio' | 'select' | 'number' | 'multi-select'

export interface IFormField {
  type: FieldType
  label: string
  required: boolean
  options: string[]
  answer: string
}

export interface IFeedbackForm {
  _id: string
  dealer: IDealer
  formName: string
  formFields: IFormField[]
  status: 'active' | 'inactive' | string
}

export interface IBookingDetails {
  _id: string
  bookingId: string
}
export interface IDealerDetails {
  _id: string
  name: string
}

export interface IDealershipDetails {
  _id: string
  name: string
}
export interface IOwnerDetails {
  _id: string
  firstName: string
  email: string
  phoneNumber: string
  lastName: string
}

interface IVehicleDetail {
  licensePlate: string
  model: string
  make: string
}
