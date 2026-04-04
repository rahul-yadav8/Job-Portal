
export interface IDashboardCount {
    dealerships: string
    dealers: string
    customers: string
    bookings: IDashboardBookingData[]
}
export interface IDashboardBookingData {
    activeBookings: string
    totalBookings: string
}

export interface IDashboardBookingStats {
     total: string
    percentage: {
        inprogress: string
        booked: string
        completed: string
        cancelled: string
        rejected: string
    }
    count: {
        inprogress: string
        booked: string
        completed: string
        cancelled: string
        rejected: string
    }
}

export interface IDashboardFeedbackStats {
    total: string
    positive: string
    negative: string
    pending: string
}
export type IDashboardOverallStats = IDashboardStatsData[]; // just an array

export interface IDashboardStatsData {
    month: string;
    customers: number;
    bookings: number;
    feedbacks: number;
}

