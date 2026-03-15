import Link from 'next/link'
import FadeIn from '@/components/FadeIn'

const pillars = [
  {
    title: 'Curiosity',
    description:
      'The refusal to accept the surface. We dig into first principles, question assumptions, and chase the threads that others overlook.',
  },
  {
    title: 'Intelligence',
    description:
      'Not credentials — clarity. The ability to synthesize complexity, identify leverage points, and make decisions that compound.',
  },
  {
    title: 'Ambition',
    description:
      'The will to build something that matters. Not ambition for its own sake, but directed energy toward outcomes worth pursuing.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="texture-overlay min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">
        <FadeIn>
          <p className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-charcoal leading-tight mb-6">
            Junto United
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="text-lg md:text-xl text-charcoal/50 max-w-xl mb-4 leading-relaxed font-light">
            The intersection of Curiosity, Intelligence, and Ambition.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-base text-charcoal/40 max-w-lg leading-relaxed text-balance">
            We build technology and publish thinking at the edge of human
            behavior, decision science, and what it means to perform at the
            highest level.
          </p>
        </FadeIn>
      </section>

      {/* Pillars */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <FadeIn>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-charcoal text-center mb-16">
            What drives us
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <FadeIn key={pillar.title} delay={i * 0.1}>
              <div className="bg-white/60 rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
                <h3 className="font-display text-2xl font-semibold text-charcoal mb-3">
                  {pillar.title}
                </h3>
                <p className="text-charcoal/60 leading-relaxed text-sm">
                  {pillar.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Teasers */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn direction="left">
            <Link href="/projects" className="group block">
              <div className="border border-sand rounded-xl p-10 hover:border-terracotta/30 transition-colors">
                <p className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-3">
                  Projects
                </p>
                <h3 className="font-display text-2xl font-semibold text-charcoal mb-3 group-hover:text-terracotta transition-colors">
                  What we&apos;re building
                </h3>
                <p className="text-charcoal/50 text-sm leading-relaxed">
                  From social sports to AI coaching to decision science — explore
                  the products and tools in our portfolio.
                </p>
              </div>
            </Link>
          </FadeIn>
          <FadeIn direction="right">
            <Link href="/conversation" className="group block">
              <div className="border border-sand rounded-xl p-10 hover:border-terracotta/30 transition-colors">
                <p className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-3">
                  Conversation
                </p>
                <h3 className="font-display text-2xl font-semibold text-charcoal mb-3 group-hover:text-terracotta transition-colors">
                  What we&apos;re thinking
                </h3>
                <p className="text-charcoal/50 text-sm leading-relaxed">
                  Long-form writing on technology, human behavior, ambition, and
                  the decisions that shape the future.
                </p>
              </div>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
