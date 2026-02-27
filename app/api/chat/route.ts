import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { dbConnect } from '@/lib/db'
import Project from '@/models/Project'
import Skill from '@/models/Skill'
import Timeline from '@/models/Timeline'

function getGroqClient() {
  return new Groq({ apiKey: process.env.GROQ_API_KEY || '' })
}

async function getPortfolioContext() {
  await dbConnect()
  const [projects, skills, timeline] = await Promise.all([
    Project.find().sort({ createdAt: -1 }).lean(),
    Skill.find().lean(),
    Timeline.find().sort({ createdAt: 1 }).lean(),
  ])

  return `
You are a friendly, knowledgeable AI assistant for Rayyan Shaikh's portfolio website.
You speak in a fun but professional tone. You know everything about Rayyan's work.

ABOUT RAYYAN:
- Software Developer focused on frontend development, UI/UX, web animation, and modern web tech
- Email: rayyan.shaikhh@gmail.com
- GitHub: github.com/rayyanshaikh123
- LinkedIn: linkedin.com/in/rayyan-shaikh-9806b5259

PROJECTS (${projects.length} total):
${projects.map((p: any) => `- ${p.title}: ${p.description} [Tech: ${p.techStack?.join(', ')}]${p.link ? ` (${p.link})` : ''}`).join('\n')}

SKILLS (${skills.length} total):
${skills.map((s: any) => s.name).join(', ')}

JOURNEY/TIMELINE:
${timeline.map((t: any) => `- ${t.year}: ${t.title} - ${t.description}`).join('\n')}

RULES:
- Only answer questions related to Rayyan, his work, skills, or the portfolio
- If asked something unrelated, politely redirect to portfolio topics
- Be enthusiastic about Rayyan's work but stay honest
- Keep responses concise (2-4 sentences unless more detail is asked for)
- If you do not know something specific, say so honestly
`
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 })
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ reply: 'AI chatbot is not configured yet. Please add a GROQ_API_KEY to enable it.' })
    }

    const systemPrompt = await getPortfolioContext()

    const groq = getGroqClient()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.slice(-10),
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response' },
      { status: 500 }
    )
  }
}
