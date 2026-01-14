'use client'

import CustomButton from '@/components/Button'
import { ImageMedia } from '@/components/Media/ImageMedia'
import RichText from '@/components/RichText'
import { Product } from '@/payload-types'
import Link from 'next/link'
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
      <div className="grid gap-8 grid-cols-1 max-w-6xl mx-auto px-4">
        {products.map((product: Product) => (
          <TailwindProduct key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function TailwindProduct({ product }: { product: Product }) {
  return (
    <div className="text-white">
      <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <ImageMedia resource={product.image} className="h-full w-full object-cover" />
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-300 tracking-tight">{product.price + ' €'}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div className="space-y-6">
                <RichText data={product.description} enableGutter={false} />
              </div>
            </div>

            <div className="mt-10 flex w-full">
              <Link href={product.paymentLink.url} className="w-full">
                <CustomButton className="w-full">{product.paymentLink.label}</CustomButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
