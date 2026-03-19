const http = require('http')
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const PORT = 3001

const INFLUENCERS_PATH = path.join(__dirname, 'content', 'influencers.json')
const PROJECTS_PATH = path.join(__dirname, 'content', 'projects.json')
const POSTS_DIR = path.join(__dirname, 'content', 'posts')

// ── Helpers ──

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' })
  res.end(JSON.stringify(data))
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => resolve(body ? JSON.parse(body) : {}))
  })
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ── Influencers ──

function readInfluencers() {
  return JSON.parse(fs.readFileSync(INFLUENCERS_PATH, 'utf-8'))
}

function saveInfluencers(data) {
  fs.writeFileSync(INFLUENCERS_PATH, JSON.stringify(data, null, 2) + '\n')
}

// ── Projects ──

function readProjects() {
  return JSON.parse(fs.readFileSync(PROJECTS_PATH, 'utf-8'))
}

function saveProjects(data) {
  fs.writeFileSync(PROJECTS_PATH, JSON.stringify(data, null, 2) + '\n')
}

// ── Conversations ──

function readConversations() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))
  return files
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf-8')
      const { data, content } = matter(raw)
      return { slug, title: data.title, date: data.date, excerpt: data.excerpt, content }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

function writePost(slug, meta, content) {
  const frontmatter = `---\ntitle: "${meta.title}"\ndate: "${meta.date}"\nexcerpt: "${meta.excerpt}"\n---\n\n`
  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.md`), frontmatter + content)
}

// ── Server ──

const server = http.createServer(async (req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' })
    return res.end()
  }

  const url = req.url
  const method = req.method

  try {
    // ── Influencers ──
    if (url === '/api/influencers') {
      if (method === 'GET') return json(res, readInfluencers())

      const body = await parseBody(req)

      if (method === 'POST') {
        const { name, description, link, category } = body
        if (!name || !link || !category) return json(res, { error: 'Name, link, and category are required.' }, 400)
        if (!['individuals', 'companies', 'content'].includes(category)) return json(res, { error: 'Invalid category.' }, 400)
        const data = readInfluencers()
        data[category].push({ name, description: description || '', link })
        saveInfluencers(data)
        return json(res, { success: true, data })
      }

      if (method === 'PUT') {
        const { category, index, name, description, link } = body
        if (!category || index === undefined || !name || !link) return json(res, { error: 'Category, index, name, and link are required.' }, 400)
        const data = readInfluencers()
        if (index < 0 || index >= data[category].length) return json(res, { error: 'Invalid index.' }, 400)
        data[category][index] = { name, description: description || '', link }
        saveInfluencers(data)
        return json(res, { success: true, data })
      }

      if (method === 'PATCH') {
        const { category, fromIndex, toIndex } = body
        if (!category || fromIndex === undefined || toIndex === undefined) return json(res, { error: 'Category, fromIndex, and toIndex are required.' }, 400)
        const data = readInfluencers()
        const list = data[category]
        if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) return json(res, { error: 'Invalid index.' }, 400)
        const [item] = list.splice(fromIndex, 1)
        list.splice(toIndex, 0, item)
        saveInfluencers(data)
        return json(res, { success: true, data })
      }

      if (method === 'DELETE') {
        const { name, category } = body
        if (!name || !category) return json(res, { error: 'Name and category are required.' }, 400)
        const data = readInfluencers()
        data[category] = data[category].filter((item) => item.name !== name)
        saveInfluencers(data)
        return json(res, { success: true, data })
      }
    }

    // ── Projects ──
    if (url === '/api/projects') {
      if (method === 'GET') return json(res, readProjects())

      const body = await parseBody(req)

      if (method === 'POST') {
        const { name, description, status, cta, ctaLink } = body
        if (!name || !description || !status || !cta) return json(res, { error: 'All fields are required.' }, 400)
        const data = readProjects()
        const slug = slugify(name)
        data.push({ slug, name, description, status, cta, ctaLink: ctaLink || '' })
        saveProjects(data)
        return json(res, { success: true, data })
      }

      if (method === 'PUT') {
        const { index, name, description, status, cta, ctaLink } = body
        if (index === undefined || !name || !description || !status || !cta) return json(res, { error: 'All fields are required.' }, 400)
        const data = readProjects()
        if (index < 0 || index >= data.length) return json(res, { error: 'Invalid index.' }, 400)
        const slug = slugify(name)
        data[index] = { slug, name, description, status, cta, ctaLink: ctaLink || '' }
        saveProjects(data)
        return json(res, { success: true, data })
      }

      if (method === 'PATCH') {
        const { fromIndex, toIndex } = body
        const data = readProjects()
        if (fromIndex < 0 || fromIndex >= data.length || toIndex < 0 || toIndex >= data.length) return json(res, { error: 'Invalid index.' }, 400)
        const [item] = data.splice(fromIndex, 1)
        data.splice(toIndex, 0, item)
        saveProjects(data)
        return json(res, { success: true, data })
      }

      if (method === 'DELETE') {
        const { index } = body
        const data = readProjects()
        if (index < 0 || index >= data.length) return json(res, { error: 'Invalid index.' }, 400)
        data.splice(index, 1)
        saveProjects(data)
        return json(res, { success: true, data })
      }
    }

    // ── Conversations ──
    if (url === '/api/conversations') {
      if (method === 'GET') return json(res, readConversations())

      const body = await parseBody(req)

      if (method === 'POST') {
        const { title, date, excerpt, content } = body
        if (!title || !date || !excerpt) return json(res, { error: 'Title, date, and excerpt are required.' }, 400)
        const slug = slugify(title)
        writePost(slug, { title, date, excerpt }, content || '')
        return json(res, { success: true, data: readConversations() })
      }

      if (method === 'PUT') {
        const { originalSlug, title, date, excerpt, content } = body
        if (!originalSlug || !title || !date || !excerpt) return json(res, { error: 'All fields are required.' }, 400)
        const newSlug = slugify(title)
        const oldPath = path.join(POSTS_DIR, `${originalSlug}.md`)
        if (originalSlug !== newSlug && fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
        writePost(newSlug, { title, date, excerpt }, content || '')
        return json(res, { success: true, data: readConversations() })
      }

      if (method === 'DELETE') {
        const { slug } = body
        if (!slug) return json(res, { error: 'Slug is required.' }, 400)
        const filePath = path.join(POSTS_DIR, `${slug}.md`)
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
        return json(res, { success: true, data: readConversations() })
      }
    }

    // ── Contact ──
    if (url === '/api/contact' && method === 'POST') {
      const { name, email, message } = await parseBody(req)
      if (!name || !email || !message) return json(res, { error: 'All fields are required.' }, 400)
      console.log('Contact form submission:', { name, email, message })
      return json(res, { success: true })
    }

    json(res, { error: 'Not found' }, 404)
  } catch (err) {
    console.error(err)
    json(res, { error: 'Internal server error' }, 500)
  }
})

server.listen(PORT, () => {
  console.log(`Admin API server running at http://localhost:${PORT}`)
})
