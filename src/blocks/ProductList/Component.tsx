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
    <section className="my-12 px-4">
      {heading && (
        <h2 className="text-2xl font-semibold text-center text-neutral-200 mb-8">{heading}</h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: ShopProduct }) {
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
    <div className="flex flex-col border border-white/10 rounded-lg overflow-hidden bg-neutral-900 text-neutral-200">
      {product.images[0] && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.images[0]}
          alt={product.name}
          className="aspect-square w-full object-cover"
        />
      )}

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-bold tracking-tight">{product.name}</h3>

        {price && (
          <p className="mt-1 text-xl tracking-tight">
            {price} <span className="text-sm">+ frakt</span>
          </p>
        )}

        {product.description && (
          <p className="mt-3 text-sm text-neutral-200/80 line-clamp-3">{product.description}</p>
        )}

        <div className="mt-auto flex w-full pt-4">
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
  )
}
