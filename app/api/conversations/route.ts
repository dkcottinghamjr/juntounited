import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, readdirSync, unlinkSync, renameSync, existsSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const POSTS_DIR = join(process.cwd(), 'content', 'posts')

type PostMeta = {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function readAll(): PostMeta[] {
  const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  return files
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const raw = readFileSync(join(POSTS_DIR, fileName), 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        excerpt: data.excerpt as string,
        content,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

function writePost(slug: string, meta: { title: string; date: string; excerpt: string }, content: string) {
  const frontmatter = `---\ntitle: "${meta.title}"\ndate: "${meta.date}"\nexcerpt: "${meta.excerpt}"\n---\n\n`
  writeFileSync(join(POSTS_DIR, `${slug}.md`), frontmatter + content)
}

export async function GET() {
  return NextResponse.json(readAll())
}

export async function POST(request: Request) {
  const { title, date, excerpt, content } = await request.json()

  if (!title || !date || !excerpt) {
    return NextResponse.json({ error: 'Title, date, and excerpt are required.' }, { status: 400 })
  }

  const slug = slugify(title)
  writePost(slug, { title, date, excerpt }, content || '')

  return NextResponse.json({ success: true, data: readAll() })
}

export async function PUT(request: Request) {
  const { originalSlug, title, date, excerpt, content } = await request.json()

  if (!originalSlug || !title || !date || !excerpt) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const newSlug = slugify(title)
  const oldPath = join(POSTS_DIR, `${originalSlug}.md`)
  const newPath = join(POSTS_DIR, `${newSlug}.md`)

  // Remove old file if slug changed
  if (originalSlug !== newSlug && existsSync(oldPath)) {
    unlinkSync(oldPath)
  }

  writePost(newSlug, { title, date, excerpt }, content || '')

  return NextResponse.json({ success: true, data: readAll() })
}

export async function DELETE(request: Request) {
  const { slug } = await request.json()

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required.' }, { status: 400 })
  }

  const filePath = join(POSTS_DIR, `${slug}.md`)
  if (existsSync(filePath)) {
    unlinkSync(filePath)
  }

  return NextResponse.json({ success: true, data: readAll() })
}
