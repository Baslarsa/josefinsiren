import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { SetHeaderTheme } from './SetHeaderTheme'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div
      className="relative -mt-[10rem] flex items-center justify-center text-neutral-200"
      data-theme="dark"
    >
      <SetHeaderTheme theme="dark" />
      <div className="container mb-8 z-[5] relative flex items-center justify-center">
        <div className="max-w-[36.5rem] text-center">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex md:justify-center gap-4">
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="min-h-[100vh] select-none">
        {media && typeof media === 'object' && (
          <Media fill imgClassName="object-cover" priority resource={media} />
        )}
      </div>
      <div className="absolute inset-0 bg-black opacity-30" />
    </div>
  )
}
