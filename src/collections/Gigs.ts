import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

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
}
