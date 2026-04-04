import { IDealer } from '@/types/dealer.interface.ts'

export interface IServiceReminderLogs {
  _id : string
  dealer: IDealer
  fileName: string
  validationStatus: string
  errors: []
  filePath: string
  createdBy: string
}
