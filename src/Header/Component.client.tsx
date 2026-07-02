'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav } from './Nav'
import { CartWidget } from '@/components/Cart/CartWidget'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])
  const isHome = pathname === '/home' || pathname === '/'
  return (
    <header
      className={cn(
        'sticky top-0 z-10 w-full',
        isHome ? 'bg-transparent' : 'bg-background border-b border-border',
      )}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="pt-4 md:pt-8 pb-8 flex justify-between items-center w-full">
          <Link href="/">
            {!isHome && (
              <div className="">
                <h2 className="text-3xl">Josefin Sirén</h2>
              </div>
            )}
          </Link>
          <div className="flex items-center gap-6">
            <HeaderNav data={data} />
            <CartWidget />
          </div>
        </div>
      </div>
    </header>
  )
}
