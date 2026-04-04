export interface IMake {
    _id: string
    name: string
    slug: string
    parent?: string
    status: string
    dealer: string
    dealership: string
    createdAt: string
    updatedAt: string
    deletedAt: string
}


export interface CreateIMake {
    name: string
    dealership: string
    parent?:string
}