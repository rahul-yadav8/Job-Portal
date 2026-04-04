export interface IServiceReminder {
  _id: string
  customer: {
    id: string
    name: string
    email: string
  }
  dealer: {
    id: string
    name: string
  }
  notificationSentOn: {
    createdAt: string
  }
  registrationNumber: string
  makeName: string
  modelName: string
  serviceDueDate: string
  mobileNumber: string
  createdAt: string
  updatedAt: string
  booking: {
    id: string
    status: string
    date: string
    slot: string
    bookingId: string
  }
  createdBy: {
    firstName: string
    lastName: string
  }
}
