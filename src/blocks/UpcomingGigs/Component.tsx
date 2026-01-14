// components/gigs/GigsList.tsx
'use client'

import { useGetGigs } from '@/app/(frontend)/api'
import { Gig } from '@/payload-types'
import { cn } from '@/utilities/ui'
import React, { type FC } from 'react'

type GigsListProps = {
  heading?: string
  maxGigs?: number
}

const sortedGigs = (gigs: Gig[], sort: 'asc' | 'desc' = 'asc') => {
  if (!gigs) return []
  if (sort === 'desc')
    return gigs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  if (sort === 'asc')
    return gigs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  return gigs
}

const stripArrayOfGigsOlderThanAYear = (gigs: Gig[]) => {
  return gigs.filter((gig: Gig) => {
    const gigDate = new Date(gig.date)
    const today = new Date()
    const differenceInDays = (today.getTime() - gigDate.getTime()) / (1000 * 3600 * 24)
    return differenceInDays < 365
  })
}

export const GigsList: FC<GigsListProps> = ({ heading = 'Upcoming gigs', maxGigs = 3 }) => {
  const maxList = maxGigs ? maxGigs : 999
  const { gigs } = useGetGigs()
  const gigList = stripArrayOfGigsOlderThanAYear(gigs?.docs || []) || gigs?.docs

  const splicedGigs = gigList.slice(0, maxList)
  const alreadyPassed = sortedGigs(
    splicedGigs?.filter((gig: Gig) => new Date(gig.date) < new Date()),
    'desc',
  )
  const upcomingGigs = sortedGigs(
    splicedGigs?.filter((gig: Gig) => new Date(gig.date) >= new Date()),
    'asc',
  )

  if (!splicedGigs?.length) return null

  return (
    <section className="mt-8 space-y-4 ">
      <h2 className="text-xl font-semibold text-center">{heading}</h2>

      <div className="grid grid-cols-3 gap-x-4 text-left max-w-lg mx-auto">
        {upcomingGigs.slice(0, maxList).map((gig: Gig) => {
          const isPassed = new Date(gig.date) < new Date()
          return (
            <React.Fragment key={gig.id}>
              <span className={cn('font-medium', isPassed && 'line-through')}>
                {new Date(gig.date).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                })}
              </span>

              <span className={cn('font-semibold truncate', isPassed && 'line-through')}>
                {gig.title}
              </span>

              <span className={cn('truncate text-right', isPassed && 'line-through')}>
                {gig.city}
              </span>
            </React.Fragment>
          )
        })}
        {alreadyPassed.slice(0, maxList).map((gig: Gig) => {
          const isPassed = new Date(gig.date) < new Date()
          return (
            <React.Fragment key={gig.id}>
              <span className={cn('font-medium', isPassed && 'line-through')}>
                {new Date(gig.date).toLocaleDateString('sv-SE', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                })}
              </span>

              <span className={cn('font-semibold truncate', isPassed && 'line-through')}>
                {gig.title}
              </span>

              <span className={cn('truncate text-right', isPassed && 'line-through')}>
                {gig.city}
              </span>
            </React.Fragment>
          )
        })}
      </div>
    </section>
  )
}
