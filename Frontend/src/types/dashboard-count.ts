export interface IDashboardData {
  bookingsStats: IDashboardBookingStats[]
  feedbackStats: IDashboardFeedbackStats[]
  userStats: IDashboardUserData[]
  serviceReminderStats: IDashboardServiceReminderStatus[]
  dealershipsStats: number
  orderPartsStats: IDasboardOrderParts[]
}
export interface IDashboardBookingStats {
  count: number
  status: string
}

export interface IDashboardFeedbackStats {
  count: number
  status: string
}

export interface IDashboardUserData {
  count: number
  role: string
}
export interface IDashboardServiceReminderStatus {
  count: number
  status: string
}
export interface IDasboardOrderParts {
  topOrderedParts: ItopOrderedParts[]
  totalOrders: number
}
export interface ItopOrderedParts {
  count: number
  partsNumber: string
}