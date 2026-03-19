import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const DATA_PATH = join(process.cwd(), 'content', 'influencers.json')

type InfluencerItem = {
  name: string
  description: string
  link: string
}

type InfluencerData = {
  individuals: InfluencerItem[]
  companies: InfluencerItem[]
  content: InfluencerItem[]
}

function readData(): InfluencerData {
  const raw = readFileSync(DATA_PATH, 'utf-8')
  return JSON.parse(raw)
}

function saveData(data: InfluencerData) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n')
}

export async function GET() {
  return NextResponse.json(readData())
}

export async function POST(request: Request) {
  const { name, description, link, category } = await request.json()

  if (!name || !link || !category) {
    return NextResponse.json({ error: 'Name, link, and category are required.' }, { status: 400 })
  }

  if (!['individuals', 'companies', 'content'].includes(category)) {
    return NextResponse.json({ error: 'Invalid category.' }, { status: 400 })
  }

  const data = readData()
  data[category as keyof InfluencerData].push({ name, description: description || '', link })
  saveData(data)

  return NextResponse.json({ success: true, data })
}

// Edit an existing entry
export async function PUT(request: Request) {
  const { category, index, name, description, link } = await request.json()

  if (!category || index === undefined || !name || !link) {
    return NextResponse.json({ error: 'Category, index, name, and link are required.' }, { status: 400 })
  }

  const data = readData()
  const key = category as keyof InfluencerData
  if (index < 0 || index >= data[key].length) {
    return NextResponse.json({ error: 'Invalid index.' }, { status: 400 })
  }

  data[key][index] = { name, description: description || '', link }
  saveData(data)

  return NextResponse.json({ success: true, data })
}

// Reorder: move an item within its category
export async function PATCH(request: Request) {
  const { category, fromIndex, toIndex } = await request.json()

  if (!category || fromIndex === undefined || toIndex === undefined) {
    return NextResponse.json({ error: 'Category, fromIndex, and toIndex are required.' }, { status: 400 })
  }

  const data = readData()
  const key = category as keyof InfluencerData
  const list = data[key]

  if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
    return NextResponse.json({ error: 'Invalid index.' }, { status: 400 })
  }

  const [item] = list.splice(fromIndex, 1)
  list.splice(toIndex, 0, item)
  saveData(data)

  return NextResponse.json({ success: true, data })
}

export async function DELETE(request: Request) {
  const { name, category } = await request.json()

  if (!name || !category) {
    return NextResponse.json({ error: 'Name and category are required.' }, { status: 400 })
  }

  const data = readData()
  const key = category as keyof InfluencerData
  data[key] = data[key].filter((item) => item.name !== name)
  saveData(data)

  return NextResponse.json({ success: true, data })
}
