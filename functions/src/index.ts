import { initializeApp } from 'firebase-admin/app'
import {
    getFirestore,
    FieldValue,
} from 'firebase-admin/firestore'

import { setGlobalOptions } from 'firebase-functions'
import { onCall, HttpsError } from 'firebase-functions/v2/https'

initializeApp()

const db = getFirestore()

setGlobalOptions({
    maxInstances: 10,
})

type CreateOrderRequest = {
    customer: {
        fullName: string
        email: string
        phone: string
        address: string
        city: string
        state: string
        note?: string
    }
    items: {
        productId: string
        quantity: number
    }[]
}

function getDiscountedPrice(
    product: {
        price: number
        discount?: {
            type: 'percentage' | 'fixed'
            value: number
            startDate?: string
            endDate?: string
        }
    },
): number {
    const price = product.price
    const discount = product.discount

    if (!discount) {
        return price
    }

    if (
        !Number.isFinite(discount.value) ||
        discount.value < 0 ||
        (discount.type === 'percentage' && discount.value > 100)
    ) {
        throw new HttpsError(
            'failed-precondition',
            'This product has an invalid discount configuration.',
        )
    }

    const now = Date.now()

    const startDate = discount.startDate
        ? new Date(discount.startDate).getTime()
        : null

    const endDate = discount.endDate
        ? new Date(discount.endDate).getTime()
        : null

    if (
        (startDate !== null && !Number.isFinite(startDate)) ||
        (endDate !== null && !Number.isFinite(endDate))
    ) {
        throw new HttpsError(
            'failed-precondition',
            'This product has invalid discount dates.',
        )
    }

    if (
        (startDate !== null && now < startDate) ||
        (endDate !== null && now > endDate)
    ) {
        return price
    }

    const discountAmount = discount.type === 'percentage'
        ? price * (discount.value / 100)
        : discount.value

    return Math.max(0, price - discountAmount)
}

export const createOrder = onCall(async (request) => {

    // 1. Verify authentication.
    if (!request.auth) {
        throw new HttpsError(
            'unauthenticated',
            'You must sign in before placing an order.',
        )
    }

    const userId = request.auth.uid

    const data = request.data as CreateOrderRequest

    // 2. Validate customer information.
    if (
        !data.customer ||
        !data.customer.fullName?.trim() ||
        !data.customer.email?.trim() ||
        !data.customer.phone?.trim() ||
        !data.customer.address?.trim() ||
        !data.customer.city?.trim() ||
        !data.customer.state?.trim()
    ) {
        throw new HttpsError(
            'invalid-argument',
            'Please provide complete customer information.',
        )
    }

    // 3. Validate cart.
    if (
        !Array.isArray(data.items) ||
        data.items.length === 0
    ) {
        throw new HttpsError(
            'invalid-argument',
            'Your cart is empty.',
        )
    }

    for (const item of data.items) {
        if (
            typeof item.productId !== 'string' ||
            !item.productId.trim() ||
            !Number.isInteger(item.quantity) ||
            item.quantity < 1
        ) {
            throw new HttpsError(
                'invalid-argument',
                'Invalid product or quantity.',
            )
        }
    }

    // 4. Prevent duplicate products.
    const productIds = data.items.map(
        (item) => item.productId,
    )

    if (new Set(productIds).size !== productIds.length) {
        throw new HttpsError(
            'invalid-argument',
            'Your cart contains duplicate products.',
        )
    }

    // 5. Retrieve actual products from Firestore.
    const productSnapshots = await Promise.all(
        data.items.map((item) =>
            db.collection('products').doc(item.productId).get(),
        ),
    )

    // 6. Validate products and build order items.
    const orderItems = data.items.map((item, index) => {
        const productSnapshot = productSnapshots[index]

        if (!productSnapshot.exists) {
            throw new HttpsError(
                'not-found',
                'One or more products could not be found.',
            )
        }

        const product = productSnapshot.data()!

        if (
            product.isPublished !== true ||
            product.isAvailableForPurchase === false
        ) {
            throw new HttpsError(
                'failed-precondition',
                `${product.name} is not available for purchase.`,
            )
        }

        if (
            product.stockStatus !== 'in-stock' ||
            !Number.isInteger(product.stockQuantity) ||
            product.stockQuantity < item.quantity
        ) {
            throw new HttpsError(
                'failed-precondition',
                `Insufficient stock for ${product.name}.`,
            )
        }

        if (
            typeof product.price !== 'number' ||
            !Number.isFinite(product.price) ||
            product.price < 0
        ) {
            throw new HttpsError(
                'failed-precondition',
                `Invalid price for ${product.name}.`,
            )
        }

        const primaryImage = product.images?.find(
            (image: { isPrimary?: boolean }) => image.isPrimary,
        )

        return {
            productId: productSnapshot.id,
            productName: product.name,
            price: getDiscountedPrice(
                product as {
                    price: number
                    discount?: {
                        type: 'percentage' | 'fixed'
                        value: number
                        startDate?: string
                        endDate?: string
                    }
                },
            ),
            quantity: item.quantity,
            imageUrl: primaryImage?.url ||
                product.images?.[0]?.url || '',
        }
    })

    // 7. Calculate subtotal using trusted prices.
    const subtotal = orderItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
    )

    // 8. Create a new order document.
    const orderRef = db.collection('orders').doc()

    const orderNumber = `ORD-${orderRef.id.slice(0, 5).toUpperCase()}`

    const now = new Date().toISOString()

    const orderData = {
        id: orderRef.id,
        userId,
        customer: data.customer,
        items: orderItems,
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

        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
    }

    // Save the order to Firestore.
    await orderRef.create(orderData)

    // Return confirmation to the frontend.
    return {
        success: true,
        orderId: orderRef.id,
        orderNumber,
        subtotal,
        createdAt: now,
        updatedAt: now,
    }
})