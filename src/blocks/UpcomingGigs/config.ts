import type { Block } from 'payload'

export const UpcomingGigsBlock: Block = {
  slug: 'upcomingGigs',
  labels: {
    singular: 'Upcoming gigs',
    plural: 'Upcoming gigs',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Upcoming gigs',
      required: false,
    },
    {
      name: 'maxGigs',
      type: 'number',
      label: 'Number of gigs to show',
      defaultValue: 3,
      min: 1,
      max: 1000,
      required: false,
    },
  ],
}
