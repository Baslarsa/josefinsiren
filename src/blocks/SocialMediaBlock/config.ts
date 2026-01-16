import type { Block } from 'payload'

export const SocialMediaBlock: Block = {
  slug: 'socialMedia',
  interfaceName: 'SocialMediaBlock',
  fields: [
    {
      name: 'socialMedia',
      type: 'relationship',
      relationTo: 'social-media',
      required: true,
      hasMany: true,
    },
  ],
}
