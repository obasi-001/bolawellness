export type ProductAttribute = {
  name: string
  value: string
}

export type ProductImage = {
  id: string
  url: string
  alt: string
  isPrimary: boolean
}

export type Product = {
  id: string
  name: string
  slug: string
  description?: string
  categoryId?: string
  price: number
  stockQuantity: number
  stockStatus: 'in-stock' | 'out-of-stock'
  images: ProductImage[]
  attributes: ProductAttribute[]
  isPublished: boolean
}