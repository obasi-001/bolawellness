import {
    collection,
    doc,
    serverTimestamp,
    writeBatch,
} from 'firebase/firestore'

import { db } from './firestore'
import type {
    Order,
    OrderItem,
} from '../types/order'

type CreateOrderData = {
    userId: string
    customer: Order['customer']
    cartItems: {
        product: {
            id: string
            name: string
            price: number
            images: {
                url: string
                isPrimary: boolean
            }[]
        }
        quantity: number
    }[]
}


export function createOrderItems(
    cartItems: {
        product: {
            id: string
            name: string
            price: number
            images: {
                url: string
                isPrimary: boolean
            }[]
        }
        quantity: number
    }[],
): OrderItem[] {
    return cartItems.map((item) => {
        const primaryImage = item.product.images.find(
            (image) => image.isPrimary,
        )

        return {
            productId: item.product.id,
            productName: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            imageUrl: primaryImage?.url || item.product.images[0]?.url || '',
        }
    })
}

function generateOrderNumber(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''

    for (let i = 0; i < 5; i++) {
        code += characters.charAt(
            Math.floor(Math.random() * characters.length),
        )
    }

    return `ORD-${code}`
}

export async function createOrder(data: CreateOrderData) {
    const orderRef = doc(collection(db, 'orders'))

    const items = createOrderItems(data.cartItems)

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    )

    const orderNumber = generateOrderNumber()

    const order: Order = {
        id: orderRef.id,
        userId: data.userId,
        customer: data.customer,
        items,
        orderNumber,
        pricing: {
            subtotal,
            deliveryFee: 0,
            total: subtotal,
        },
        delivery: {
            fee: 0,
        },
        payment: {
            status: 'unpaid',
        },
        status: 'pending',
        deliveryStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    const batch = writeBatch(db)

    batch.set(orderRef, {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    })

    await batch.commit()

    return order
}