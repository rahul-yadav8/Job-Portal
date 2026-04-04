import { IDealer, IDealerDealerships } from "./dealer.interface";

export interface INotification {
  _id: string;
  deletedAt: string;
  owner: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  reference: string;
  dealer: Partial<IDealer>;
  dealership: Partial<IDealerDealerships>;
  createdAt: string;
  updatedAt: string;
  customer: ICustomerNotification;
  additionalData?:{
    booked?: boolean;
    bookingId?: string;
    createdAt?: string;
    
  }
}

interface ICustomerNotification {
  _id: string;
  firstName: string;
   lastName: string;
}

export interface INotificationLogs {
  notifications: INotification[];
  meta: {
    page: string;
    total: number;
  }
}