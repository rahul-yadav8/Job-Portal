
export interface IProfileList {
  user: IProfile[]
}

export interface IProfile {
  _id: string
  status: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
}


export interface IMEDetails {
  "id": string
  "email": string
  "name": string | null
  "avatar_url": string | null,
  "first_name": string | null,
  "last_name": string | null,
  "app_role": null | string,
  "user_role": null | string,
  "org_role": 'super-admin' | 'tenant-admin' | 'org-admin' | 'user' | null,
  "org_id": string | null,
  "status": "active" | "inactive" | null,
}
