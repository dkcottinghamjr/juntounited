export interface Project {
  slug: string
  name: string
  description: string
  status: 'Active' | 'In Development' | 'Coming Soon'
  cta: string
}

export const projects: Project[] = [
  {
    slug: 'pickup',
    name: 'Pickup',
    description:
      'A social sports matchmaking app connecting players to games nationwide.',
    status: 'In Development',
    cta: 'Join the Waitlist',
  },
  {
    slug: 'leash',
    name: 'Leash',
    description:
      'AI-powered execution coaching for high-performance professionals. Do not let the day get away from you.',
    status: 'In Development',
    cta: 'Learn More',
  },
  {
    slug: 'decide',
    name: 'Decide',
    description:
      'An application built around 6 mathmatical models of decision making to remove folly inherent in human nature. Designed for anyone who refuses to leave important decisions to gut instinct alone.',
    status: 'Coming Soon',
    cta: 'Get Notified',
  },
  {
    slug: 'barnabas',
    name: 'Barnabas',
    description:
      'A companion for your spiritual journey.',
    status: 'Coming Soon',
    cta: 'Get Notified',
  },
]
