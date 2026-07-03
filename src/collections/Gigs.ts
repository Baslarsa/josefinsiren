import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

import { revalidateTag } from 'next/cache'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const revalidateGigs: CollectionAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating gigs')
    revalidateTag('gigs')
  }
  return doc
}

const revalidateGigsAfterDelete: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    revalidateTag('gigs')
  }
  return doc
}

export const Gigs: CollectionConfig = {
  slug: 'gigs',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
  ],
  hooks: {
    afterChange: [revalidateGigs],
    afterDelete: [revalidateGigsAfterDelete],
  },
}
