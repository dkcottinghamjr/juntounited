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
      'A social sports matchmaking app connecting players to pickup games in their city. Find a game, show up, play. No leagues, no commitments — just sport when you want it, with people who take it seriously.',
    status: 'In Development',
    cta: 'Join the Waitlist',
  },
  {
    slug: 'the-daily-brief',
    name: 'The Daily Brief',
    description:
      'AI-powered daily execution coaching for high-performance professionals. A concise, personalized briefing each morning that cuts through the noise and keeps you locked in on what actually moves the needle.',
    status: 'Active',
    cta: 'Learn More',
  },
  {
    slug: 'decision-framework',
    name: 'Decision Framework',
    description:
      'A web application built around a six-model decision system — Expected Value, Bayesian Updating, Kelly Criterion, and related frameworks. Designed for anyone who refuses to leave important decisions to gut instinct alone.',
    status: 'Coming Soon',
    cta: 'Get Notified',
  },
]
