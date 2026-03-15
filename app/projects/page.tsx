import { Metadata } from 'next'
import { projects } from '@/content/projects'
import FadeIn from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'What Junto United is building — from social sports to AI coaching to decision science.',
}

const statusColors: Record<string, string> = {
  Active: 'bg-olive/10 text-olive',
  'In Development': 'bg-terracotta/10 text-terracotta',
  'Coming Soon': 'bg-ochre/10 text-ochre-dark',
}

export default function ProjectsPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <FadeIn>
        <p className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-4">
          Projects
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-charcoal mb-4 leading-tight">
          What we&apos;re building
        </h1>
        <p className="text-charcoal/50 text-lg max-w-xl mb-16 leading-relaxed">
          Products and tools at the intersection of technology, human behavior,
          and high-performance thinking.
        </p>
      </FadeIn>

      <div className="space-y-8">
        {projects.map((project, i) => (
          <FadeIn key={project.slug} delay={i * 0.1}>
            <div className="bg-white/60 rounded-xl p-8 md:p-10 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-charcoal">
                  {project.name}
                </h2>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    statusColors[project.status] || 'bg-sand text-charcoal/60'
                  }`}
                >
                  {project.status}
                </span>
              </div>
              <p className="text-charcoal/60 leading-relaxed mb-6">
                {project.description}
              </p>
              <button className="text-sm font-semibold text-terracotta hover:text-terracotta-dark transition-colors">
                {project.cta} &rarr;
              </button>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
