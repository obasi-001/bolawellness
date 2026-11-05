import { createContext, useState, useEffect } from 'react'
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

const CART_STORAGE_KEY = 'ecommerce-cart'

// Restore cart from localStorage
function getSavedCart(): CartItem[] {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY)

        if (!savedCart) {
            return []
        }

        const parsedCart: unknown = JSON.parse(savedCart)

        if (!Array.isArray(parsedCart)) {
            return []
        }

        // Check that saved cart data has the expected structure
        return parsedCart.filter(
            (item): item is CartItem =>
                item !== null &&
                typeof item === 'object' &&
                'product' in item &&
                'quantity' in item &&
                typeof item.product === 'object' &&
                item.product !== null &&
                'id' in item.product &&
                typeof item.product.id === 'string' &&
                typeof item.quantity === 'number' &&
                Number.isFinite(item.quantity) &&
                item.quantity >= 1
        )
    } catch (error) {
        console.error('Error restoring cart:', error)
        return []
    }
}

export function CartProvider({ children }: CartProviderProps) {

    // Load saved cart when the application starts
    const [cartItems, setCartItems] = useState<CartItem[]>(getSavedCart)

    // Save cart whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cartItems)
            )
        } catch (error) {
            console.error('Error saving cart:', error)
        }
    }, [cartItems])

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

    // Update product quantity
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

    // Remove product from cart
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