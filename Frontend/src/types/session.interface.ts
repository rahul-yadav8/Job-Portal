
export interface ISession {
  user: ISessionUser
  token: ISessionToken
}

export interface ISessionUser {
  _id: string
  lastName: string
  firstName: string
}

interface ISessionToken {
  accessToken: string
  refreshToken: string
  expiresInSec: number
}
