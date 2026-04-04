export interface IOrderParts {
  _id: string
  customer: {
    id: string
    name: string
    email: string
    phoneNumber: string
  }
  dealer: string
  dealership: {
    id: string
    name: string
  }
  vehicleDetail: IVehicleDetail[]
  name: string
  phone: string
  vehicleBrand: string
  vehicleModel: string
  partsNumber: string
  partsDescription: string
  createdAt: string
}

interface IVehicleDetail {
  licensePlate: string
  model: string
  make: string
}
