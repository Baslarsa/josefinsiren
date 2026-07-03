import type { Metadata } from 'next/types'
import Link from 'next/link'

import { ClearCartOnMount } from '@/components/Cart/ClearCartOnMount'
import { stripe } from '@/lib/stripe'

type Args = {
  searchParams: Promise<{ session_id?: string }>
}

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export default async function ShopSuccessPage({ searchParams }: Args) {
  const { session_id: sessionId } = await searchParams

  const session = sessionId
    ? await stripe.checkout.sessions
        .retrieve(sessionId, { expand: ['line_items'] })
        .catch(() => null)
    : null

  const isPaid = session?.payment_status === 'paid'
  const currency = session?.currency ?? 'eur'
  const lineItems = session?.line_items?.data ?? []
  const shippingAmount = session?.shipping_cost?.amount_total ?? null

  return (
    <div className="pt-24 pb-24">
      <ClearCartOnMount enabled={isPaid} />
      <div className="container max-w-2xl">
        <div className="max-w-none text-center mb-12">
          <h1>{isPaid ? 'Tack för ditt köp!' : 'Tack!'}</h1>
          <p>
            {isPaid
              ? 'Din betalning har genomförts. En bekräftelse skickas till din e-post.'
              : 'Vi kunde inte bekräfta din betalning direkt. Hör av dig till oss om något verkar fel.'}
          </p>
        </div>

        {lineItems.length > 0 && (
          <div className="border rounded-lg border-border divide-y divide-border mb-12">
            {lineItems.map((item) => (
              <div key={item.id} className="flex justify-between p-4">
                <span>
                  {item.description} × {item.quantity}
                </span>
                <span>{formatPrice(item.amount_total, currency)}</span>
              </div>
            ))}
            {shippingAmount !== null && (
              <div className="flex justify-between p-4">
                <span>Frakt</span>
                <span>{formatPrice(shippingAmount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between p-4 font-semibold">
              <span>Totalt</span>
              <span>{formatPrice(session?.amount_total ?? 0, currency)}</span>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/shop" className="underline">
            Tillbaka till butiken
          </Link>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Tack för ditt köp',
  }
}
