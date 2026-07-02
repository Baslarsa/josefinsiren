'use client'

import CustomButton from '@/components/Button'
import { useCart } from '@/providers/Cart/CartContext'
import type { ShopProduct } from '@/lib/commerce/products'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

type ProductsBlockComponentProps = {
  heading?: string
  maxProducts?: number
}

function formatPrice(unitAmount: number | null, currency: string) {
  if (unitAmount === null) return null
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(unitAmount / 100)
}

export const ProductsBlockComponent = ({ heading, maxProducts }: ProductsBlockComponentProps) => {
  const [products, setProducts] = useState<ShopProduct[]>([])
  const displayHeading = heading || 'Produkter'
  const limit = maxProducts || 5

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/shop/products')
      const data = await res.json()

      setProducts((data.products ?? []).slice(0, limit))
    }
    load()
  }, [limit])

  if (!products.length) return null

  return (
    <section className="my-12">
      {/* Heading */}
      <h2 className="text-3xl font-semibold text-center mb-10">{displayHeading}</h2>

      {/* Grid */}
      <div className="grid gap-8 grid-cols-1 max-w-6xl mx-auto px-4">
        {products.map((product) => (
          <TailwindProduct key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function TailwindProduct({ product }: { product: ShopProduct }) {
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)

  const inCart = items.some((item) => item.priceId === product.priceId)
  const price = formatPrice(product.unitAmount, product.currency)

  const handleAddToCart = () => {
    if (product.unitAmount === null) return

    addItem({
      priceId: product.priceId,
      productId: product.id,
      name: product.name,
      image: product.images[0],
      unitAmount: product.unitAmount,
      currency: product.currency,
    })
    setAdded(true)
  }

  return (
    <div className="dark:text-white light:text-black">
      <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {product.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          )}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>

            {price && (
              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl dark:text-gray-300 text-gray-600 tracking-tight">
                  {price} <span className="text-sm"> + frakt</span>
                </p>
              </div>
            )}

            {product.description && (
              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div className="space-y-6">
                  <p>{product.description}</p>
                </div>
              </div>
            )}

            <div className="mt-10 flex w-full">
              <CustomButton
                className="w-full gap-2"
                onClick={handleAddToCart}
                disabled={product.unitAmount === null}
              >
                {added || inCart ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" aria-hidden="true" />
                    Tillagd i varukorgen
                  </>
                ) : (
                  'Lägg i varukorg'
                )}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
