'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MenuIcon, X } from 'lucide-react'
import { cn } from '@/utilities/ui'

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
        <MobileNav menuItems={navItems} />
      </nav>
    </>
  )
}

const MobileNav = ({ menuItems }: { menuItems: HeaderType['navItems'] }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }
  return (
    <div>
      <div
        className={cn(
          'transition-all duration-300 absolute top-0 left-0 right-0 h-0 z-20 bg-gray-950',
          {
            'h-screen': isOpen,
          },
        )}
      >
        <nav
          onClick={handleToggle}
          className={cn(
            'flex flex-col gap-5 items-center justify-center h-full transition-all duration-400',
            {
              'opacity-0': !isOpen,
              'opacity-100': isOpen,
            },
          )}
        >
          {menuItems?.map(({ link }, i) => {
            return <CMSLink key={i} {...link} className="text-3xl" appearance="link" />
          })}
        </nav>
      </div>
      {isOpen ? (
        <X size={48} className="relative z-30" onClick={handleToggle} />
      ) : (
        <MenuIcon size={48} className="relative z-30" onClick={handleToggle} />
      )}
    </div>
  )
}
