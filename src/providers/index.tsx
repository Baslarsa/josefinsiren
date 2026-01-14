import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { ReactQueryProvider } from './ReactQuery/ReactQueryProvider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <ReactQueryProvider>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </ReactQueryProvider>
    </ThemeProvider>
  )
}
