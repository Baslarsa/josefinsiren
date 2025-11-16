import type { Block } from 'payload'

export const ProductsBlock: Block = {
  slug: 'products',
  labels: {
    singular: 'Product',
    plural: 'Products',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Produkter',
      required: false,
    },
    {
      name: 'maxProducts',
      type: 'number',
      label: 'Number of gigs to show',
      defaultValue: 5,
      min: 1,
      max: 100,
      required: false,
    },
  ],
}
