'use client'

import { ShoppingBag } from 'lucide-react'

import { useCart } from '@/providers/Cart/CartContext'
import { CartDrawer } from './CartDrawer'

export function CartWidget() {
  const { itemCount, isDrawerOpen, openDrawer, closeDrawer } = useCart()

  return (
    <>
      <button
        onClick={openDrawer}
        className="relative"
        aria-label={`Öppna varukorg${itemCount > 0 ? ` (${itemCount} varor)` : ''}`}
      >
        <ShoppingBag size={28} />
        {itemCount > 0 && (
          <span className="text-black absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-200 text-xs">
            {itemCount}
          </span>
        )}
      </button>
      <CartDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  )
}
