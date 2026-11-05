import { useState } from 'react'
import { Link } from 'react-router-dom'
import NavActions from './NavActions'
import '../styles/Navbar.css'

function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false)

    return (
        <nav className="navbar navbar-expand-lg border-bottom bg-white">
            <div className="container">

                {/* Brand */}
                <Link to="/" className="navbar-brand fw-bold">
                    E-Commerce
                </Link>

                {/* Mobile toolbar */}
                <div className="mobile-toolbar d-flex align-items-center">

                    <button
                        type="button"
                        className="navbar-icon-button d-lg-none"
                        title="Search"
                        aria-label="Search"
                        onClick={() => setSearchOpen(!searchOpen)}
                    >
                        <i className="bi bi-search fs-5"></i>
                    </button>

                    <div className="d-lg-none">
                        <NavActions />
                    </div>

                    <button
                        className="navbar-toggler ms-1"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#mainNavbar"
                        aria-controls="mainNavbar"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                </div>

                {/* Desktop search box */}
                <form className="desktop-search d-none d-lg-flex mx-lg-4 flex-grow-1">
                    <input
                        className="form-control"
                        type="search"
                        placeholder="Search products..."
                        aria-label="Search products"
                    />
                </form>

                {/* Desktop icons - after search box */}
                <div className="desktop-nav-actions d-none d-lg-flex">
                    <NavActions />
                </div>

                {/* Navigation links */}
                <div className="collapse navbar-collapse" id="mainNavbar">
                    <div className="navbar-nav ms-auto">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>

                        <Link to="/products" className="nav-link">
                            Products
                        </Link>
                    </div>
                </div>

                {/* Mobile search box */}
                {searchOpen && (
                    <div className="mobile-search w-100 mt-3 d-lg-none">
                        <form className="d-flex">
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Search products..."
                                aria-label="Search products"
                                autoFocus
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => setSearchOpen(false)}
                                aria-label="Close search"
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </nav>
    )
}

export default Navbar