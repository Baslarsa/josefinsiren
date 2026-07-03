import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Background as BackgroundType } from '@/payload-types'

export async function Background() {
  const backgroundData: BackgroundType = await getCachedGlobal('background', 1)()
  const { image } = backgroundData

  if (!image || typeof image !== 'object' || !image.url) {
    return null
  }

  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${image.url})` }}
    >
      <div className="absolute inset-0 bg-black/70" />
    </div>
  )
}
