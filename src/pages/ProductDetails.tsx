import { useParams } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'

import { getProductBySlug } from '../services/productService'
import type { Product } from '../types/product'
import { CartContext } from '../context/CartContext'

function ProductDetails() {
    const { slug } = useParams()

    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [selectedImage, setSelectedImage] = useState(0)

    const cart = useContext(CartContext)

    useEffect(() => {
        async function loadProduct() {
            if (!slug) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError('')

                const fetchedProduct = await getProductBySlug(slug)

                setProduct(fetchedProduct)
                setSelectedImage(0)
            } catch (error) {
                console.error('Error loading product:', error)
                setError('Unable to load this product. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        loadProduct()
    }, [slug])

    // Check whether this product is already in the cart
    const isAlreadyInCart =
        cart?.cartItems.some(
            (item) => item.product.id === product?.id
        ) ?? false

    // Check product availability
    const isUnavailable =
        !product ||
        product.stockStatus !== 'in-stock' ||
        product.stockQuantity <= 0 ||
        product.isAvailableForPurchase === false

    // Add product only once
    const handleAddToCart = () => {
        if (
            !cart ||
            !product ||
            isAlreadyInCart ||
            isUnavailable
        ) {
            return
        }

        cart.addToCart(product)
    }

    // Loading state
    if (loading) {
        return (
            <section className="py-5">
                <div className="container text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>

                    <p className="mt-3">Loading product...</p>
                </div>
            </section>
        )
    }

    // Error state
    if (error) {
        return (
            <section className="py-5">
                <div className="container text-center">
                    <p className="text-danger">{error}</p>
                </div>
            </section>
        )
    }

    // Product not found
    if (!product) {
        return (
            <section className="py-5">
                <div className="container">
                    <h1>Product not found</h1>
                </div>
            </section>
        )
    }

    return (
        <section className="py-5">
            <div className="container">
                <div className="row g-4">

                    {/* Product Images */}
                    <div className="col-lg-6">
                        <button
                            type="button"
                            className="border-0 bg-transparent p-0 w-100"
                            data-bs-toggle="modal"
                            data-bs-target="#productImageModal"
                        >
                            <img
                                src={
                                    product.images[selectedImage]?.url ||
                                    product.images[0]?.url ||
                                    '/placeholder.png'
                                }
                                alt={
                                    product.images[selectedImage]?.alt ||
                                    product.name
                                }
                                className="img-fluid rounded w-100"
                            />
                        </button>

                        {product.images.length > 1 && (
                            <div className="d-flex gap-2 mt-3">
                                {product.images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        className="border-0 bg-transparent p-0"
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img
                                            src={image.url}
                                            alt={image.alt}
                                            className="img-fluid rounded"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Information */}
                    <div className="col-lg-6">
                        <h1>{product.name}</h1>

                        {product.description && (
                            <p className="mt-3">
                                {product.description}
                            </p>
                        )}

                        <p className="fs-4 fw-semibold mt-4">
                            ₦{product.price.toLocaleString()}
                        </p>

                        <p>
                            Stock status:{' '}
                            <span
                                className={`fw-semibold ${
                                    isUnavailable
                                        ? 'text-danger'
                                        : 'text-success'
                                }`}
                            >
                                {isUnavailable ? 'Out of Stock' : 'In Stock'}
                            </span>
                        </p>

                        {/* Add to Cart */}
                        <div className="mt-3">

                            <button
                                type="button"
                                className={`btn w-100 ${
                                    isAlreadyInCart
                                        ? 'btn-success'
                                        : 'btn-primary'
                                }`}
                                onClick={handleAddToCart}
                                disabled={
                                    !cart ||
                                    isAlreadyInCart ||
                                    isUnavailable
                                }
                            >
                                {isAlreadyInCart
                                    ? 'Added to Cart ✓'
                                    : isUnavailable
                                        ? 'Unavailable'
                                        : 'Add to Cart'}
                            </button>

                            {/* Remove from Cart */}
                            {isAlreadyInCart && (
                                <button
                                    type="button"
                                    className="btn btn-outline-danger w-100 mt-2"
                                    onClick={() =>
                                        cart?.removeFromCart(product.id)
                                    }
                                >
                                    Remove from Cart
                                </button>
                            )}

                        </div>

                        {/* Product Attributes */}
                        {product.attributes.length > 0 && (
                            <div className="mt-4">
                                <h2 className="h5">Product Details</h2>

                                <ul className="list-unstyled">
                                    {product.attributes.map((attribute) => (
                                        <li key={attribute.name}>
                                            <strong>
                                                {attribute.name}:
                                            </strong>{' '}
                                            {attribute.value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Image Modal */}
            <div
                className="modal fade"
                id="productImageModal"
                tabIndex={-1}
                aria-labelledby="productImageModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h2
                                className="modal-title fs-5"
                                id="productImageModalLabel"
                            >
                                {product.name}
                            </h2>

                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body text-center">
                            <img
                                src={
                                    product.images[selectedImage]?.url ||
                                    product.images[0]?.url ||
                                    '/placeholder.png'
                                }
                                alt={
                                    product.images[selectedImage]?.alt ||
                                    product.name
                                }
                                className="img-fluid rounded"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetails