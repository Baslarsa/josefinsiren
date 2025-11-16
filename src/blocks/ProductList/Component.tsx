'use client'

import { ImageMedia } from '@/components/Media/ImageMedia'
import RichText from '@/components/RichText'
import { Product } from '@/payload-types'
import { useEffect, useState } from 'react'

type ProductsBlockComponentProps = {
  heading?: string
  maxProducts?: number
}

export const ProductsBlockComponent = ({
  heading = 'Produkter',
  maxProducts = 5,
}: ProductsBlockComponentProps) => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/products?limit=${maxProducts}`)
      const data = await res.json()

      // Accept both { docs: [...] } or direct array
      setProducts(data.docs ?? data)
    }
    load()
  }, [maxProducts])

  if (!products.length) return null

  return (
    <section className="my-12">
      {/* Heading */}
      <h2 className="text-3xl font-semibold text-center mb-10">{heading}</h2>

      {/* Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4">
        {products.map((product: Product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Product image */}
            {product.image && typeof product.image !== 'string' && (
              <div className="w-full h-48 bg-neutral-100">
                <ImageMedia
                  resource={product.image}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col gap-2">
              <h3 className="text-lg font-semibold">{product.title}</h3>

              {product.description && <RichText data={product.description} enableGutter={false} />}

              {/* Price (if exists) */}
              {product.price && <p className="text-xl font-medium mt-2">{product.price} kr</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
