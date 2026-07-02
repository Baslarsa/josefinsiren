'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

import CustomButton from '@/components/Button'
import { useCart } from '@/providers/Cart/CartContext'
import { cn } from '@/utilities/ui'

function formatPrice(unitAmount: number, currency: string) {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(unitAmount / 100)
}

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, subtotal } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currency = items[0]?.currency ?? 'eur'

  const handleCheckout = async () => {
    setError(null)
    setIsCheckingOut(true)

    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({ priceId: item.priceId, quantity: item.quantity })),
        }),
      })
      const data = await res.json()

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Kunde inte starta betalningen')
      }

      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel')
      setIsCheckingOut(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-sm bg-background text-foreground z-50 shadow-xl transition-transform duration-300 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Varukorg"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Varukorg</h2>
          <button onClick={onClose} aria-label="Stäng varukorg">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 && <p className="text-muted-foreground">Din varukorg är tom.</p>}

          {items.map((item) => (
            <div key={item.priceId} className="flex gap-3">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 object-cover rounded shrink-0"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.unitAmount, item.currency)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => updateQuantity(item.priceId, item.quantity - 1)}
                    className="px-2 border border-border rounded"
                    aria-label="Minska antal"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.priceId, item.quantity + 1)}
                    className="px-2 border border-border rounded"
                    aria-label="Öka antal"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.priceId)}
                    className="text-sm text-white ml-auto"
                  >
                    Ta bort
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex justify-between font-semibold">
              <span>Delsumma</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <CustomButton onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? 'Startar betalning...' : 'Till kassan'}
            </CustomButton>
          </div>
        )}
      </div>
    </>
  )
}
