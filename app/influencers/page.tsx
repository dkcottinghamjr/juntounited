import { Metadata } from 'next'
import FadeIn from '@/components/FadeIn'
import Link from 'next/link'
import influencers from '@/content/influencers.json'

export const metadata: Metadata = {
  title: 'Influencers',
  description: 'People, companies, and content that influence Junto United.',
}

type InfluencerItem = {
  name: string
  description: string
  link: string
}

function InfluencerGrid({ items }: { items: InfluencerItem[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-charcoal/30 italic">Coming soon.</p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-sand bg-white/60 px-4 py-3 hover:border-terracotta/30 hover:shadow-card transition-all group"
        >
          <svg className="w-5 h-5 flex-shrink-0 text-terracotta/60 group-hover:text-terracotta transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
          </svg>
          <div className="min-w-0">
            <span className="text-sm font-medium text-charcoal/70 group-hover:text-charcoal transition-colors block truncate">
              {item.name}
            </span>
            {item.description && (
              <span className="text-xs text-charcoal/40 block truncate">
                {item.description}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function InfluencersPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-20">
      <FadeIn>
        <p className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-4">
          Influencers
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-charcoal mb-4 leading-tight">
          Inspiration that drives us
        </h1>
        <p className="text-charcoal/50 text-lg max-w-lg mb-16 leading-relaxed">
          People, companies, and content that shape how we think and what we build.
        </p>
      </FadeIn>

      <div className="space-y-16">
        <FadeIn delay={0.1}>
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
            Individuals
          </h2>
          <InfluencerGrid items={influencers.individuals} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
            Companies
          </h2>
          <InfluencerGrid items={influencers.companies} />
        </FadeIn>

        <FadeIn delay={0.3}>
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
            Content
          </h2>
          <InfluencerGrid items={influencers.content} />
        </FadeIn>
      </div>
    </section>
  )
}
