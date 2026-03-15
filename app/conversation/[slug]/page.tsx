import { Metadata } from 'next'
import Link from 'next/link'
import { getAllSlugs, getPostBySlug } from '@/lib/posts'
import FadeIn from '@/components/FadeIn'

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPostBySlug(params.slug)

  return (
    <article className="max-w-3xl mx-auto px-6 py-20">
      <FadeIn>
        <Link
          href="/conversation"
          className="text-sm text-charcoal/40 hover:text-terracotta transition-colors mb-8 inline-block"
        >
          &larr; Back to Conversation
        </Link>
        <time className="text-sm text-charcoal/40 block mb-4">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-charcoal mb-8 leading-tight">
          {post.title}
        </h1>
      </FadeIn>
      <FadeIn delay={0.15}>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </FadeIn>
    </article>
  )
}
