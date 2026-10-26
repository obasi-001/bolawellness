import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomerLayout from './layouts/CustomerLayout'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Wishlist from './pages/Wishlist'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import Account from './pages/Account'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App