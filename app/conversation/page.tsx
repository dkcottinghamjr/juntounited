import { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import FadeIn from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'Conversation',
  description:
    'Long-form thinking on technology, human behavior, ambition, and the future — from Junto United.',
}

export default function ConversationPage() {
  const posts = getAllPosts()

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <FadeIn>
        <p className="text-xs uppercase tracking-widest text-terracotta font-semibold mb-4">
          Conversation
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-charcoal mb-4 leading-tight">
          What we&apos;re thinking
        </h1>
        <p className="text-charcoal/50 text-lg max-w-xl mb-16 leading-relaxed">
          Writing on the world.
        </p>
      </FadeIn>

      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post, i) => (
          <FadeIn key={post.slug} delay={i * 0.08}>
            <Link href={`/conversation/${post.slug}`} className="group block">
              <article className="bg-white/60 rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow h-full flex flex-col">
                <time className="text-xs text-charcoal/40 mb-3 block">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <h2 className="font-display text-xl font-semibold text-charcoal mb-3 group-hover:text-terracotta transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-charcoal/50 text-sm leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <span className="text-terracotta text-sm font-semibold mt-4 inline-block">
                  Read more &rarr;
                </span>
              </article>
            </Link>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}
