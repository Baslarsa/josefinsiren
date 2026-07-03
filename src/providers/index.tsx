import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { CartProvider } from './Cart/CartContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <CartProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </CartProvider>
    </ThemeProvider>
  )
}
