import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'

import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'

import '../styles/NavActions.css'

function NavActions() {
    const cart = useContext(CartContext)
    const auth = useContext(AuthContext)
    const location = useLocation()

    const cartCount = cart?.cartCount ?? 0

    return (
        <div className="nav-actions d-flex align-items-center gap-3">

            {/* Wishlist */}
            <Link
                to="/wishlist"
                className="nav-action-icon wishlist-icon"
                title="Wishlist"
                aria-label="Wishlist"
            >
                <i className="bi bi-heart fs-5"></i>
            </Link>

            {/* Cart */}
            <Link
                to="/cart"
                className="nav-action-icon cart-icon"
                title="Shopping Cart"
                aria-label={`Shopping Cart, ${cartCount} items`}
            >
                <span className="position-relative">
                    <i className="bi bi-cart fs-5"></i>

                    {cartCount > 0 && (
                        <span className="cart-count-badge">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </span>
            </Link>

            {/* Account */}
            <Link
                to={auth?.user ? '/account' : '/login'}
                state={
                    auth?.user
                        ? undefined
                        : { from: location.pathname }
                }
                className="nav-action-icon account-icon"
                title="My Account"
                aria-label="My Account"
            >
                <i className="bi bi-person fs-5"></i>
            </Link>

        </div>
    )
}

export default NavActions