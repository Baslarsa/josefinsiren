'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { MenuIcon, X } from 'lucide-react'
import { cn } from '@/utilities/ui'

type NavLink = NonNullable<HeaderType['navItems']>[number]['link']

function getLinkHref(link: NavLink) {
  return link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value.slug
    ? `${link.reference?.relationTo !== 'pages' ? `/${link.reference?.relationTo}` : ''}/${
        link.reference.value.slug
      }`
    : link.url
}

function normalizePath(path?: string | null) {
  if (!path) return path
  return path === '/home' ? '/' : path
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []
  const pathname = usePathname()

  return (
    <>
      <nav className="hidden md:flex gap-5 items-center justify-between">
        {navItems.map(({ link }, i) => {
          const isActive = normalizePath(getLinkHref(link)) === normalizePath(pathname)

          return (
            <CMSLink
              key={i}
              {...link}
              className={cn('text-xl pb-1 text-neutral-200', { underline: isActive })}
              appearance="link"
            />
          )
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
          'transition-all duration-300 absolute top-0 left-0 right-0 h-0 z-20 bg-background',
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
