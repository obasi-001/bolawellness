import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { CartContext } from '../context/CartContext'

function Cart() {
  const cart = useContext(CartContext)

  if (!cart) {
    return null
  }

  const hasUnavailableProducts = cart.cartItems.some(
    (item) =>
      item.product.stockStatus !== 'in-stock' ||
      item.product.stockQuantity <= 0 ||
      item.product.isAvailableForPurchase === false
  )

  return (
    <section className="py-5">
      <div className="container">

        <h1 className="mb-4">
          Cart ({cart.cartCount})
        </h1>

        <Link
          to="/products"
          className="btn btn-outline-primary mb-4"
        >
          <i className="bi bi-arrow-left me-2"></i>
          Continue Shopping
        </Link>

        {cart.cartItems.length === 0 ? (

          <div className="text-center py-5">

            <i className="bi bi-cart-x display-1 text-secondary"></i>

            <h2 className="mt-3">
              Your cart is empty
            </h2>

            <p className="text-body-secondary">
              Browse our products and add something to your cart.
            </p>

            <Link
              to="/products"
              className="btn btn-primary mt-3"
            >
              Browse Products
            </Link>

          </div>

        ) : (

          cart.cartItems.map((item) => {

            const isUnavailable =
              item.product.stockStatus !== 'in-stock' ||
              item.product.stockQuantity <= 0 ||
              item.product.isAvailableForPurchase === false

            const primaryImage =
              item.product.images.find(
                (image) => image.isPrimary
              )?.url ||
              item.product.images[0]?.url ||
              'https://placehold.co/600x600'

            return (
              <div
                key={item.product.id}
                className="card mb-3"
              >
                <div className="card-body">

                  <div className="row align-items-center g-3">

                    {/* Product Image */}
                    <div className="col-3 col-md-2">

                      <img
                        src={primaryImage}
                        alt={item.product.images.find(
                          (image) => image.isPrimary
                        )?.alt || item.product.name}
                        className="img-fluid rounded"
                        style={{
                          width: '100%',
                          aspectRatio: '1 / 1',
                          objectFit: 'contain',
                        }}
                      />

                    </div>

                    {/* Product Information */}
                    <div className="col">

                      <h2 className="h5">
                        {item.product.name}
                      </h2>

                      <p className="mb-1">
                        ₦{item.product.price.toLocaleString()}
                      </p>

                      {/* Stock Status */}
                      <p className="small mb-2">

                        {isUnavailable ? (

                          <span className="text-danger fw-semibold">
                            Currently unavailable
                          </span>

                        ) : (

                          <span className="text-success fw-semibold">
                            In stock
                          </span>

                        )}

                      </p>

                      {isUnavailable && (
                        <div className="alert alert-warning py-2 small">
                          This product is currently unavailable.
                          Please remove it from your cart before checkout.
                        </div>
                      )}

                      {/* Item Total */}
                      <p className="mb-2 fw-semibold">
                        Item Total: ₦{(
                          item.product.price * item.quantity
                        ).toLocaleString()}
                      </p>

                      {/* Quantity and Remove */}
                      <div className="d-flex align-items-center gap-2 flex-wrap">

                        <span>
                          Quantity:
                        </span>

                        <div
                          className="btn-group"
                          role="group"
                          aria-label={`Quantity controls for ${item.product.name}`}
                        >

                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            disabled={
                              isUnavailable ||
                              item.quantity <= 1
                            }
                            onClick={() =>
                              cart.updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                          >
                            −
                          </button>

                          <span className="btn btn-outline-secondary fw-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            disabled={
                              isUnavailable ||
                              item.quantity >= item.product.stockQuantity
                            }
                            onClick={() =>
                              cart.updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                        {/* Remove Product */}
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            cart.removeFromCart(
                              item.product.id
                            )
                          }
                        >
                          <i className="bi bi-trash me-1"></i>
                          Remove
                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              </div>
            )
          })

        )}

        {/* Cart Summary */}
        {cart.cartItems.length > 0 && (

          <div className="mt-4">

            <div className="card">

              <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">

                  <h2 className="h5 mb-0">
                    Subtotal
                  </h2>

                  <h2 className="h4 mb-0">
                    ₦{cart.cartSubtotal.toLocaleString()}
                  </h2>

                </div>

                <p className="text-body-secondary small mt-2">
                  Delivery fees will be discussed and confirmed
                  with the seller before payment.
                </p>

                {hasUnavailableProducts && (

                  <div className="alert alert-warning mt-3 mb-0">
                    Your cart contains unavailable products.
                    Remove them before proceeding to checkout.
                  </div>

                )}

                <div className="text-end mt-3">

                  <Link
                    to="/checkout"
                    className={`btn btn-primary ${hasUnavailableProducts
                        ? 'disabled'
                        : ''
                      }`}
                    aria-disabled={hasUnavailableProducts}
                    onClick={(event) => {
                      if (hasUnavailableProducts) {
                        event.preventDefault()
                      }
                    }}
                  >
                    Proceed to Checkout

                    <i className="bi bi-arrow-right ms-2"></i>
                  </Link>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>
    </section>
  )
}

export default Cart