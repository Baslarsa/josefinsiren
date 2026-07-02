'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

import { useCart } from '@/providers/Cart/CartContext'
import { CartDrawer } from './CartDrawer'

export function CartWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { itemCount } = useCart()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative"
        aria-label={`Öppna varukorg${itemCount > 0 ? ` (${itemCount} varor)` : ''}`}
      >
        <ShoppingBag size={28} />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
            {itemCount}
          </span>
        )}
      </button>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
