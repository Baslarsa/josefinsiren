import { NextRequest, NextResponse } from 'next/server'

import { getProducts } from '@/lib/commerce/products'
import { stripe } from '@/lib/stripe'
import { getServerSideURL } from '@/utilities/getURL'

type CheckoutRequestItem = {
  priceId: string
  quantity: number
}

const MAX_QUANTITY_PER_ITEM = 20
const SHIPPING_AMOUNT = 600 // 6.00, in the smallest currency unit

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const requestedItems: CheckoutRequestItem[] | undefined = body?.items

  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const validQuantities = requestedItems.every(
    (item) =>
      typeof item?.priceId === 'string' &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= MAX_QUANTITY_PER_ITEM,
  )

  if (!validQuantities) {
    return NextResponse.json({ error: 'Invalid cart items' }, { status: 400 })
  }

  // Cross-check every priceId against the live, active catalog so a client
  // can't ask us to check out a price that isn't ours (or is no longer active).
  const catalog = await getProducts()
  const catalogByPriceId = new Map(catalog.map((product) => [product.priceId, product]))
  const allKnown = requestedItems.every((item) => catalogByPriceId.has(item.priceId))

  if (!allKnown) {
    return NextResponse.json({ error: 'Unknown product in cart' }, { status: 400 })
  }

  const currency = catalogByPriceId.get(requestedItems[0].priceId)!.currency

  const serverURL = getServerSideURL()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: requestedItems.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
    })),
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          display_name: 'Frakt',
          fixed_amount: {
            amount: SHIPPING_AMOUNT,
            currency,
          },
        },
      },
    ],
    phone_number_collection: { enabled: true },
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['SE', 'NO', 'DK', 'FI'],
    },
    success_url: `${serverURL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${serverURL}/shop/canceled`,
  })

  return NextResponse.json({ url: session.url })
}
