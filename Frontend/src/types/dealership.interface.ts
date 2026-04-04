import internal from "stream"
import { IDealer, IModulePermission, ISection } from "./dealer.interface"


export interface IOneDealership {
    _id: string
    dealer:  string
    status: string
    name: string
    slug: string
    tagline: string
    logo: any
    profileImg: any
    createdAt: string
    updatedAt: string
}
export interface IDealership {
    _id: string
    deletedAt: any
    dealer: Partial<IDealer> | string
    address: any
    basicInfomation: IBasicInfomation
    advancesInfomation: IAdvancesInfomation
    hoursOfOperations: IHoursOfOperations
    status: string
    name: string
    slug: string
    tagline: string
    logo: any
    profileImg: any
    website: string
    privacyPolicyURL: string
    comments: string
    welcomeMessage: string
    appConfig: {
        theme: any,
        layouts: ISection[]
    }
    modules: IModulePermission[]
    createdAt: string
    updatedAt: string
    timezone: string
    isPulseBookingSystemEnabled: boolean
    defaultSlotsCount: number
    durationOfASlot: number
    slotPerDuration: number
    holidays: []
    overrideSpecialSlots: [],
    isCustomMakeModel: boolean,
    isCustomFontEnabled: boolean
    fontConfig?: [];

}



export interface IBasicInfomation {
    sales: UserInfo
    service: UserInfo
    parts: UserInfo
    feedback: UserInfo
    quote: UserInfo
    manager: UserInfo
    general: UserInfo
    roadside: UserInfo
    app: UserInfo
}

export interface UserInfo {
    name: string
    phone: string
    email: string
}


export interface IAdvancesInfomation {
    collision: UserInfo
    supplier: UserInfo
    social: ISocial
    onlineBookingUrl: string
}


export interface ISocial {
    facebook: string
    twitter: string
    youtube: string
    instagram: string
    pintrest: string
    blog: string
    linkedin: string
    tiktok: string
}



export interface IHoursOfOperations {
    monday: string | undefined
    tuesday: string | undefined
    wednesday: string | undefined
    thursday: string | undefined
    friday: string | undefined
    saturday: string | undefined
    sunday: string | undefined
    status: string | undefined
}

export interface IBookingDealershipConfig {
    isPulseBookingSystemEnabled: boolean
    defaultSlotsCount: number
    durationOfASlot: number
}