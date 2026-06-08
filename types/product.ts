export type Product = {
  id: number
  name: string
  price: number
  image: string
  images?: string[]
  description?: string
}

export type ProductInput = {
  id: number
  name: string
  price: number
  image: string
  images?: string[]
  description?: string
  /** Nuevo modelo flexible */
  param1?: string
  param2?: string
  /** Compatibilidad con datasets anteriores */
  category?: string
  subCategory?: string
}
