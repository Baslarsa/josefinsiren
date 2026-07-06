import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const year: number = new Date().getFullYear()
  return (
    <footer className=" p-2 absolute bottom-0 text-sm font-thin text-center w-full bg-black/50 text-neutral-200">
      © {year} Josefin Sirén, All rights reserved.
    </footer>
  )
}
