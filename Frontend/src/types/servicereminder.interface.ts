export interface IServiceReminder {
    _id: string
    customer: ISCustomer[]
    dealer: ISDealer[]
    dealership: ISDealership[]
    registrationNumber: string
    modelName: string
    serviceDueDate: string
    mobileNumber: string
}

export interface ISCustomer {
    id: string
    name: string
}
export interface ISDealer {
    id: string
    name: string
}
export interface ISDealership {
    id: string
    name: string
}