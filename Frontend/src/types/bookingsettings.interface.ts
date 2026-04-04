
// PulseBookingEngineConfig.ts

export interface PulseBookingEngineConfig {
    isPulseBookingEngine: boolean; // Indicates if Pulse Booking Engine is enabled
    enableBookingForAll: boolean;  // Flag to enable booking for all dealerships
    enabledBookingDealerships: string[]; // List of dealership IDs where booking is enabled
}
  
export interface BookingCreate {
    customer: string
    date: string
    slot: string
    make: string
    model: string
    licensePlate: string
    createdBy: string
    vehicle: string
    serviceItems: string[]
    comments: string
    dealer: string
    dealership: string
}