import { unstable_cache } from 'next/cache'
import type Stripe from 'stripe'

import { stripe } from '@/lib/stripe'

export type ShopProduct = {
  id: string
  name: string
  description: string | null
  images: string[]
  priceId: string
  unitAmount: number | null
  currency: string
}

function toShopProduct(product: Stripe.Product): ShopProduct | null {
  const price = product.default_price
  if (!price || typeof price === 'string') return null

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    images: product.images,
    priceId: price.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
  }
}

async function fetchProducts(): Promise<ShopProduct[]> {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
    limit: 100,
  })

  return products.data.map(toShopProduct).filter((product): product is ShopProduct => Boolean(product))
}

async function fetchProduct(id: string): Promise<ShopProduct | null> {
  const product = await stripe.products.retrieve(id, {
    expand: ['default_price'],
  })

  if (!product.active) return null

  return toShopProduct(product)
}

export const getProducts = unstable_cache(fetchProducts, ['stripe-products'], {
  revalidate: 60,
  tags: ['stripe-products'],
})

export const getProduct = unstable_cache(fetchProduct, ['stripe-product'], {
  revalidate: 60,
  tags: ['stripe-products'],
})
