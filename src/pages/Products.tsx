import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import type { Product } from '../types/product'
import ProductCard from '../components/products/ProductCard'

function Products() {

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const fetchedProducts = await getProducts()
        setProducts(fetchedProducts)
      } catch (error) {
        console.error('Error loading products:', error)
        setError('Unable to load products. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])


  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading products...</p>
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
        <h1 className="mb-4">Supplements</h1>

        <div className="row g-4">
          {products.map((product) => (
            <div key={product.id} className="col-6 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Products