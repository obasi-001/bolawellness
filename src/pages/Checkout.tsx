import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { createOrder } from '../services/orderService'

function Checkout() {
    const cart = useContext(CartContext)
    const auth = useContext(AuthContext)
    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [orderNote, setOrderNote] = useState('')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!cart) {
        return null
    }

    // Check whether the cart contains unavailable products
    const hasUnavailableProducts = cart.cartItems.some(
        (item) =>
            item.product.stockStatus !== 'in-stock' ||
            item.product.stockQuantity <= 0 ||
            item.product.isAvailableForPurchase === false ||
            item.quantity > item.product.stockQuantity
    )

    // Handle checkout form submission
    const handleContinue = async () => {
        setError('')
        setSuccess('')

        if (!auth?.user) {
            navigate('/login', {
                state: { from: '/checkout' },
            })
            return
        }

        if (cart.cartItems.length === 0) {
            setError('Your cart is empty.')
            return
        }

        if (success) {
            return (
                <section className="py-5">
                    <div className="container text-center">

                        <i className="bi bi-check-circle-fill display-1 text-success"></i>

                        <h1 className="h3 mt-3">
                            Order placed successfully!
                        </h1>

                        <p className="text-body-secondary">
                            Your order number is:
                        </p>

                        <h4 className="text-primary">
                            {success}
                        </h4>

                        <p>
                            We will contact you to confirm delivery arrangements
                            before payment.
                        </p>

                        <Link to="/account" className="btn btn-primary mt-3">
                            Go to My Account
                        </Link>

                    </div>
                </section>
            )
        }

        if (hasUnavailableProducts) {
            setError('Your cart contains unavailable products or quantities exceeding available stock.')
            return
        }

        if (!fullName.trim()) {
            setError('Please enter your full name.')
            return
        }

        if (!email.trim()) {
            setError('Please enter your email address.')
            return
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!emailPattern.test(email.trim())) {
            setError('Please enter a valid email address.')
            return
        }

        if (!phone.trim()) {
            setError('Please enter your phone number.')
            return
        }

        const phoneDigits = phone.replace(/\D/g, '')

        if (phoneDigits.length < 7 || phoneDigits.length > 15) {
            setError('Please enter a valid phone number.')
            return
        }

        if (!address.trim() || !city.trim() || !state.trim()) {
            setError('Please complete your delivery address, city and state.')
            return
        }

        try {
            setIsSubmitting(true)

            const order = await createOrder({
                userId: auth.user.uid,

                customer: {
                    fullName: fullName.trim(),
                    email: email.trim(),
                    phone: phone.trim(),
                    address: address.trim(),
                    city: city.trim(),
                    state: state.trim(),
                    note: orderNote.trim(),
                },

                cartItems: cart.cartItems,
            })

            // Clear the cart only after successful order creation.
            cart.cartItems.forEach((item) => {
                cart.removeFromCart(item.product.id)
            })

            setSuccess(order.orderNumber)

        } catch (error) {
            console.error('Order creation failed:', error)

            setError(
                error instanceof Error
                    ? error.message
                    : 'Unable to place your order. Please try again.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    // Empty cart protection
    if (cart.cartItems.length === 0) {
        return (
            <section className="py-5">
                <div className="container text-center">

                    <i className="bi bi-cart-x display-1 text-secondary"></i>

                    <h1 className="h3 mt-3">
                        Your cart is empty
                    </h1>

                    <p className="text-body-secondary">
                        Add products to your cart before proceeding to checkout.
                    </p>

                    <Link
                        to="/products"
                        className="btn btn-primary mt-3"
                    >
                        Browse Products
                    </Link>

                </div>
            </section>
        )
    }

    return (
        <section className="py-5">
            <div className="container">

                <h1 className="mb-4">
                    Checkout
                </h1>

                <div className="row g-4">

                    {/* Customer Information */}
                    <div className="col-lg-7">

                        <div className="card">
                            <div className="card-body">

                                <h2 className="h4 mb-4">
                                    Customer Information
                                </h2>

                                {!auth?.user && (
                                    <div className="alert alert-info">
                                        Please <Link
                                            to="/login"
                                            state={{ from: '/checkout' }}
                                        >
                                            sign in
                                        </Link> before completing checkout.
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="alert alert-success">
                                        {success}
                                    </div>
                                )}

                                {/* Full Name */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="fullName"
                                        className="form-label"
                                    >
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        id="fullName"
                                        className="form-control"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={(event) => {
                                            setFullName(event.target.value)
                                            setError('')
                                        }}
                                    />

                                </div>

                                {/* Email */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="email"
                                        className="form-label"
                                    >
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value)
                                            setError('')
                                        }}
                                    />

                                </div>

                                {/* Phone */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="phone"
                                        className="form-label"
                                    >
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        id="phone"
                                        className="form-control"
                                        placeholder="08012345678"
                                        inputMode="tel"
                                        value={phone}
                                        onChange={(event) => {
                                            setPhone(event.target.value)
                                            setError('')
                                        }}
                                    />

                                </div>

                                {/* Delivery Address */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="address"
                                        className="form-label"
                                    >
                                        Delivery Address
                                    </label>

                                    <textarea
                                        id="address"
                                        className="form-control"
                                        rows={3}
                                        placeholder="Enter your delivery address"
                                        value={address}
                                        onChange={(event) => {
                                            setAddress(event.target.value)
                                            setError('')
                                        }}
                                    />

                                </div>

                                {/* City */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="city"
                                        className="form-label"
                                    >
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        id="city"
                                        className="form-control"
                                        placeholder="Enter your city"
                                        value={city}
                                        onChange={(event) => {
                                            setCity(event.target.value)
                                            setError('')
                                        }}
                                    />

                                </div>

                                {/* State */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="state"
                                        className="form-label"
                                    >
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        id="state"
                                        className="form-control"
                                        placeholder="Enter your state"
                                        value={state}
                                        onChange={(event) => {
                                            setState(event.target.value)
                                            setError('')
                                        }}
                                    />

                                </div>

                                {/* Order Note */}
                                <div className="mb-3">

                                    <label
                                        htmlFor="orderNote"
                                        className="form-label"
                                    >
                                        Order Note{' '}
                                        <span className="text-body-secondary">
                                            (Optional)
                                        </span>
                                    </label>

                                    <textarea
                                        id="orderNote"
                                        className="form-control"
                                        rows={3}
                                        placeholder="Example: Please call me before delivery, deliver after 4 PM, etc."
                                        value={orderNote}
                                        onChange={(event) => {
                                            setOrderNote(event.target.value)
                                        }}
                                    />

                                </div>

                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    onClick={handleContinue}
                                    disabled={hasUnavailableProducts || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Placing Order...
                                        </>
                                    ) : (
                                        <>
                                            Place Order
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </>
                                    )}
                                </button>

                                <p className="small text-body-secondary mt-3 mb-0">
                                    Your delivery fee and arrangement will be
                                    confirmed with you before payment.
                                </p>

                            </div>
                        </div>

                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-5">

                        <div className="card">

                            <div className="card-body">

                                <h2 className="h4 mb-4">
                                    Order Summary
                                </h2>

                                {cart.cartItems.map((item) => (

                                    <div
                                        key={item.product.id}
                                        className="d-flex justify-content-between gap-3 mb-3"
                                    >

                                        <div>

                                            <p className="mb-1 fw-semibold">
                                                {item.product.name}
                                            </p>

                                            <p className="mb-0 text-body-secondary">
                                                {item.quantity} × ₦
                                                {item.product.price.toLocaleString()}
                                            </p>

                                        </div>

                                        <span className="fw-semibold text-nowrap">
                                            ₦{(
                                                item.product.price * item.quantity
                                            ).toLocaleString()}
                                        </span>

                                    </div>

                                ))}

                                <hr />

                                {/* Subtotal */}
                                <div className="d-flex justify-content-between">

                                    <span className="fw-semibold">
                                        Subtotal
                                    </span>

                                    <span className="fw-bold">
                                        ₦{cart.cartSubtotal.toLocaleString()}
                                    </span>

                                </div>

                                {/* Shipping */}
                                <div className="d-flex justify-content-between mt-3">

                                    <span>
                                        Delivery
                                    </span>

                                    <span className="text-body-secondary">
                                        To be arranged
                                    </span>

                                </div>

                                <hr />

                                {/* Total */}
                                <div className="d-flex justify-content-between">

                                    <span className="fs-5 fw-semibold">
                                        Total
                                    </span>

                                    <span className="fs-5 fw-bold">
                                        ₦{cart.cartSubtotal.toLocaleString()}
                                    </span>

                                </div>

                                <p className="small text-body-secondary mt-3 mb-0">
                                    Delivery charges are not included in this
                                    subtotal. They will be agreed upon before
                                    payment.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </section>
    )
}

export default Checkout