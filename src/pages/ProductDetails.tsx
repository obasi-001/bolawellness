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




    if (!product) {
        return (
            <section className="py-5">
                <div className="container">
                    <h1>Product not found</h1>
                </div>
            </section>
        )
    }

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

    if (error) {
        return (
            <section className="py-5">
                <div className="container text-center">
                    <p className="text-danger">{error}</p>
                </div>
            </section>
        )
    }

    return (
        <section className="py-5">
            <div className="container">
                <div className="row g-4">
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
                                alt={product.name}
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
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

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
                            <span className="fw-semibold">
                                {product.stockStatus}
                            </span>
                        </p>
                        <button
                            type="button"
                            className="btn btn-primary mt-3"
                            disabled={product.stockStatus === 'out-of-stock' || product.stockQuantity <= 0}
                            onClick={() => cart?.addToCart(product)}
                        >
                            {product.stockStatus === 'out-of-stock' || product.stockQuantity <= 0
                                ? 'Out of Stock'
                                : 'Add to Cart'}
                        </button>
                        {product.attributes.length > 0 && (
                            <div className="mt-4">
                                <h2 className="h5">Product Details</h2>

                                <ul className="list-unstyled">
                                    {product.attributes.map((attribute) => (
                                        <li key={attribute.name}>
                                            <strong>{attribute.name}:</strong> {attribute.value}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
                                alt={product.images[selectedImage].alt}
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