import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { ReactQueryProvider } from './ReactQuery/ReactQueryProvider'
import { CartProvider } from './Cart/CartContext'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <CartProvider>
          <HeaderThemeProvider>{children}</HeaderThemeProvider>
        </CartProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  )
}
