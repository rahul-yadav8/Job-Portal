export interface IRole {
    _id: string
    name: string
    slug: string
    status: string
    usedFor: 'pulse' | 'dealer'
    permissions : []
  }
  