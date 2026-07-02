'use client'

import { useEffect, useRef } from 'react'

import { useCart } from '@/providers/Cart/CartContext'

export function ClearCartOnMount({ enabled }: { enabled: boolean }) {
  const { clearCart } = useCart()
  const cleared = useRef(false)

  useEffect(() => {
    if (enabled && !cleared.current) {
      clearCart()
      cleared.current = true
    }
  }, [enabled, clearCart])

  return null
}
