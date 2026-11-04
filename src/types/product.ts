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

export type ProductDiscount = {
    type: 'percentage' | 'fixed'
    value: number
    startDate?: string
    endDate?: string
}

export type ProductDimensions = {
    length?: number
    width?: number
    height?: number
    unit?: 'cm' | 'm'
}

export type ProductSEO = {
    title?: string
    description?: string
    keywords?: string[]
}

export type ProductVariant = {
    id: string
    sku?: string
    options: Record<string, string>
    price: number
    stockQuantity: number
    stockStatus: 'in-stock' | 'out-of-stock'
    images?: ProductImage[]
}

export type Product = {
    id: string
    name: string
    slug: string
    description?: string

    categoryId?: string
    brand?: string
    sku?: string

    dimensions?: ProductDimensions
    weight?: number
    weightUnit?: 'g' | 'kg'

    tags?: string[]
    seo?: ProductSEO

    price: number
    stockQuantity: number
    stockStatus: 'in-stock' | 'out-of-stock'

    images: ProductImage[]
    attributes: ProductAttribute[]

    variants?: ProductVariant[]
    collectionIds?: string[]
    discount?: ProductDiscount

    isAvailableForPurchase?: boolean
    isPublished: boolean
}