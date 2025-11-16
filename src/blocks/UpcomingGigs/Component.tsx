// components/gigs/GigsList.tsx
'use client'

import { Gig } from '@/payload-types'
import React, { useEffect, useState, type FC } from 'react'

type GigsListProps = {
  heading?: string
  maxGigs?: number
}

export const GigsList: FC<GigsListProps> = ({ heading = 'Upcoming gigs', maxGigs = 3 }) => {
  const [gigs, setGigs] = useState<Gig[]>([])

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/gigs?limit=${maxGigs}`)
      const data = await res.json()
      setGigs(data.docs ?? data)
    }

    load()
  }, [maxGigs])

  const gigsNotAlreadyPassed = gigs.filter((gig) => new Date(gig.date) > new Date())
  if (!gigsNotAlreadyPassed.length) return null

  const maxList = maxGigs ? maxGigs : 999
  return (
    <section className="mt-8 space-y-4 ">
      <h2 className="text-xl font-semibold text-center">{heading}</h2>

      <div className="grid grid-cols-3 gap-x-4 text-left max-w-lg mx-auto">
        {gigsNotAlreadyPassed.slice(0, maxList).map((gig) => (
          <React.Fragment key={gig.id}>
            <span className="font-medium">
              {new Date(gig.date).toLocaleDateString('sv-SE', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              })}
            </span>

            <span className="font-semibold truncate">{gig.title}</span>

            <span className="truncate">{gig.city}</span>
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}
