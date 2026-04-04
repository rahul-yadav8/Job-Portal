export interface IBanners {
  _id: string
  imageUrl: string
  name: string
  redirectionUrl: string
  duration: {
    from: string
    to: string
  }
  status: 'active' | 'inactive'
  dealer: string
  dealership: { id: string; name: string }
}
