'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MenuIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <>
      <nav className="hidden md:flex gap-5 items-center justify-between">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} className="text-xl" appearance="link" />
        })}
      </nav>
      <nav className="flex md:hidden">
        <MobileNav />
      </nav>
    </>
  )
}

const MobileNav = () => {
  return (
    <div>
      <MenuIcon size={48} />
    </div>
  )
}
