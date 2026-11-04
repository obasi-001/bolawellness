import { Link } from 'react-router-dom'
import { useContext } from 'react'

import type { Product } from '../../types/product'
import { CartContext } from '../../context/CartContext'

type ProductCardProps = {
    product: Product
}

function ProductCard({ product }: ProductCardProps) {
    const cart = useContext(CartContext)

    // Check whether this product is already in the cart
    const isAlreadyInCart =
        cart?.cartItems.some(
            (item) => item.product.id === product.id
        ) ?? false

    // Get the primary product image
    const primaryImage =
        product.images.find((image) => image.isPrimary) ||
        product.images[0]

    // Add product to cart only if it is not already there
    const handleAddToCart = () => {
        if (
            !cart ||
            isAlreadyInCart ||
            product.stockStatus !== 'in-stock' ||
            product.isAvailableForPurchase === false
        ) {
            return
        }

        cart.addToCart(product)
    }

    const isUnavailable =
        product.stockStatus !== 'in-stock' ||
        product.isAvailableForPurchase === false

    return (
        <div className="card h-100 shadow-sm">

            {/* Product information */}
            <Link
                to={`/products/${product.slug}`}
                className="text-decoration-none text-body"
            >
                <img
                    src={primaryImage?.url || '/placeholder.png'}
                    alt={primaryImage?.alt || product.name}
                    className="card-img-top"
                    style={{
                        height: '220px',
                        objectFit: 'contain',
                        padding: '12px',
                    }}
                />

                <div className="card-body">

                    <h2 className="h6 fw-bold">
                        {product.name}
                    </h2>

                    <p
                        className="text-muted small mb-2"
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {product.description || 'No description available.'}
                    </p>

                    <h3 className="h6 fw-bold mb-2">
                        ₦{product.price.toLocaleString()}
                    </h3>

                    <span
                        className={`badge ${isUnavailable ? 'bg-danger' : 'bg-success'
                            }`}
                    >
                        {isUnavailable ? 'Out of Stock' : 'In Stock'}
                    </span>

                </div>
            </Link>

            {/* Add to Cart button */}
            <div className="card-body pt-0">

                <button
                    type="button"
                    className={`btn w-100 ${isAlreadyInCart ? 'btn-success' : 'btn-primary'
                        }`}
                    onClick={handleAddToCart}
                    disabled={!cart || isAlreadyInCart || isUnavailable}
                >
                    {isAlreadyInCart
                        ? 'Added to Cart ✓'
                        : isUnavailable
                            ? 'Unavailable'
                            : 'Add to Cart'}
                </button>

                {isAlreadyInCart && (
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm w-100 mt-2"
                        onClick={() => cart?.removeFromCart(product.id)}
                    >
                        Remove from Cart
                    </button>
                )}

            </div>

        </div>
    )
}

export default ProductCard