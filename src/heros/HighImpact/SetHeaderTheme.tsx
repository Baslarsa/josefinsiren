'use client'

import { useEffect } from 'react'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import type { Theme } from '@/providers/Theme/types'

export function SetHeaderTheme({ theme }: { theme: Theme }) {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme(theme)
  })

  return null
}
