import { httpsCallable } from 'firebase/functions'

import { functions } from './functions'
import type { Order } from '../types/order'

type CreateOrderData = {
    userId: string
    customer: Order['customer']
    cartItems: {
        product: {
            id: string
        }
        quantity: number
    }[]
}

type CreateOrderResponse = {
    success: boolean
    orderId: string
    orderNumber: string
    subtotal: number
    createdAt: string
    updatedAt: string
}

export async function createOrder(data: CreateOrderData) {
    const createOrderCallable = httpsCallable<
        {
            customer: Order['customer']
            items: {
                productId: string
                quantity: number
            }[]
        },
        CreateOrderResponse
    >(functions, 'createOrder')

    const result = await createOrderCallable({
        customer: data.customer,

        items: data.cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
        })),
    })

    return result.data
}