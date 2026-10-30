export type OrderStatus =
  | 'pending'
  | 'delivery-agreement'
  | 'awaiting-payment'
  | 'payment-submitted'
  | 'approved'
  | 'processing'
  | 'delivered'
  | 'cancelled'


export type PaymentStatus =
  | 'unpaid'
  | 'proof-submitted'
  | 'confirmed'
  | 'rejected'  

export type DeliveryStatus =
  | 'pending'
  | 'agreed'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered' 

export type OrderItem = {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl: string
}  

export type OrderCustomer = {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  note?: string
}

export type OrderDelivery = {
 fee: number
  note?: string
}

export type OrderPayment = {
  status: PaymentStatus
  proofUrl?: string
}

export type OrderPricing = {
  subtotal: number
  deliveryFee: number
  total: number
}

export type Order = {
  id: string
  userId: string
  customer: OrderCustomer
  items: OrderItem[]
  orderNumber: string
  pricing: OrderPricing
  delivery: OrderDelivery
  payment: OrderPayment
  status: OrderStatus
  deliveryStatus: DeliveryStatus
  createdAt: string
  updatedAt: string
}