import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_PATH = join(process.cwd(), 'content', 'projects.json')

type Project = {
  slug: string
  name: string
  description: string
  status: string
  cta: string
  ctaLink: string
}

function readData(): Project[] {
  return JSON.parse(readFileSync(DATA_PATH, 'utf-8'))
}

function saveData(data: Project[]) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n')
}

export async function GET() {
  return NextResponse.json(readData())
}

export async function POST(request: Request) {
  const { name, description, status, cta, ctaLink } = await request.json()

  if (!name || !description || !status || !cta) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const data = readData()
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  data.push({ slug, name, description, status, cta, ctaLink: ctaLink || '' })
  saveData(data)

  return NextResponse.json({ success: true, data })
}

export async function PUT(request: Request) {
  const { index, name, description, status, cta, ctaLink } = await request.json()

  if (index === undefined || !name || !description || !status || !cta) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const data = readData()
  if (index < 0 || index >= data.length) {
    return NextResponse.json({ error: 'Invalid index.' }, { status: 400 })
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  data[index] = { slug, name, description, status, cta, ctaLink: ctaLink || '' }
  saveData(data)

  return NextResponse.json({ success: true, data })
}

export async function PATCH(request: Request) {
  const { fromIndex, toIndex } = await request.json()

  const data = readData()
  if (fromIndex < 0 || fromIndex >= data.length || toIndex < 0 || toIndex >= data.length) {
    return NextResponse.json({ error: 'Invalid index.' }, { status: 400 })
  }

  const [item] = data.splice(fromIndex, 1)
  data.splice(toIndex, 0, item)
  saveData(data)

  return NextResponse.json({ success: true, data })
}

export async function DELETE(request: Request) {
  const { index } = await request.json()

  const data = readData()
  if (index < 0 || index >= data.length) {
    return NextResponse.json({ error: 'Invalid index.' }, { status: 400 })
  }

  data.splice(index, 1)
  saveData(data)

  return NextResponse.json({ success: true, data })
}
