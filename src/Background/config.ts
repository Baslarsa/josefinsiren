import type { GlobalConfig } from 'payload'

import { revalidateBackground } from './hooks/revalidateBackground'

export const Background: GlobalConfig = {
  slug: 'background',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  hooks: {
    afterChange: [revalidateBackground],
  },
}
