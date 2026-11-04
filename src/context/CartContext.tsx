import { createContext, useState } from 'react'
import type { CartItem } from '../types/cart'

type CartContextType = {
    cartItems: CartItem[]
    addToCart: (product: CartItem['product']) => void
    updateQuantity: (productId: string, quantity: number) => void
    removeFromCart: (productId: string) => void
    cartCount: number
    cartSubtotal: number
}

export const CartContext = createContext<CartContextType | undefined>(
    undefined
)

type CartProviderProps = {
    children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    // Total number of products in the cart
    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    )

    // Total price of products in the cart
    const cartSubtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    )

    // Add a product only if it is not already in the cart
    const addToCart = (product: CartItem['product']) => {
        if (
            product.stockStatus !== 'in-stock' ||
            product.stockQuantity <= 0 ||
            product.isAvailableForPurchase === false
        ) {
            return
        }

        setCartItems((currentItems) => {
            const existingItem = currentItems.some(
                (item) => item.product.id === product.id
            )

            // Do not increase quantity if the product already exists
            if (existingItem) {
                return currentItems
            }

            return [
                ...currentItems,
                {
                    product,
                    quantity: 1,
                },
            ]
        })
    }

    // Change product quantity from the cart page
    const updateQuantity = (productId: string, quantity: number) => {
        setCartItems((currentItems) =>
            currentItems.map((item) => {
                if (item.product.id !== productId) {
                    return item
                }

                const newQuantity = Math.max(
                    1,
                    Math.min(quantity, item.product.stockQuantity)
                )

                return {
                    ...item,
                    quantity: newQuantity,
                }
            })
        )
    }

    // Remove a product from the cart
    const removeFromCart = (productId: string) => {
        setCartItems((currentItems) =>
            currentItems.filter(
                (item) => item.product.id !== productId
            )
        )
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                updateQuantity,
                removeFromCart,
                cartCount,
                cartSubtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}