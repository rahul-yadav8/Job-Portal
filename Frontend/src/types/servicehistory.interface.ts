export interface IServiceHistory {
  _id: string
  deletedAt: string
  invoiceDate: string
  invoiceAmount: string
  invoiceNumber: string
  vehicleLicensePlate: string
  odometer: string
  model: string
  serviceDescription: string
  customer: {
    id: string
    name: string
    email: string
    phoneNumber: string
  }
  dealership: {
    id: string
    name: string
  }
  dealer: {
    id: string
    name: string
  }
  booking: {
    bookingId: string
  }
  createdAt: string
  updatedAt: string
}
