import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChatBox, { type ChatMessage } from '../components/ChatBox'
import GlowButton from '../components/GlowButton'
import { getStoryById } from '../lib/stories'
import { askAI } from '../lib/api'

function makeId(): string {
  // 部分环境可能没有 crypto.randomUUID，使用兜底保证稳定生成 key
  const c = globalThis.crypto as unknown as { randomUUID?: () => string } | undefined
  return c?.randomUUID?.() ?? `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export default function Game() {
  const { id } = useParams()
  const storyId = id ?? ''
  const story = getStoryById(storyId)
  const navigate = useNavigate()

  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [isThinking, setIsThinking] = React.useState(false)
  const abortRef = React.useRef<AbortController | null>(null)
  const typingTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    // 进入非法 story 时回到大厅
    if (!story) navigate('/hall')
  }, [story, navigate])

  React.useEffect(() => {
    if (!story) return
    // 初始提示：不属于对“玩家提问”的直接回复，因此不强制三句限制
    setMessages([
      {
        id: makeId(),
        role: 'judge',
        content: `法官就位：${story.surface}`
      }
    ])
  }, [story])

  React.useEffect(() => {
    return () => {
      abortRef.current?.abort()
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current)
    }
  }, [])

  function typeText(messageId: string, fullText: string): Promise<void> {
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current)

    return new Promise((resolve) => {
      let i = 0
      const text = fullText ?? '与此无关。'

      typingTimerRef.current = window.setInterval(() => {
        i += 1
        const next = text.slice(0, i)
        setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, content: next } : m)))

        if (i >= text.length) {
          if (typingTimerRef.current) window.clearInterval(typingTimerRef.current)
          typingTimerRef.current = null
          resolve()
        }
      }, 22)
    })
  }

  async function handleSend(question: string) {
    if (!story) return
    if (isThinking) return

    const playerMsg: ChatMessage = {
      id: makeId(),
      role: 'player',
      content: question
    }

    setMessages((prev) => [...prev, playerMsg])
    setIsThinking(true)

    try {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      // 这里直接调用封装后的 askAI：由前端对 DeepSeek 发起请求
      const judgeId = makeId()
      const judgeMsg: ChatMessage = {
        id: judgeId,
        role: 'judge',
        content: ''
      }

      setMessages((prev) => [...prev, judgeMsg])
      setIsThinking(false)

      const reply = await askAI(question, story)

      const fullReply = reply ?? '与此无关。'
      await typeText(judgeId, fullReply)

      if (fullReply === '完全正确！恭喜你揭开了真相！') {
        // 让玩家先看到法官最后一句，再进入结算页
        window.setTimeout(() => {
          navigate(`/result?id=${encodeURIComponent(story.id)}&win=1`)
        }, 350)
      }
    } catch (e) {
      setIsThinking(false)
      const judgeMsg: ChatMessage = {
        id: makeId(),
        role: 'judge',
        content: '与此无关。'
      }
      setMessages((prev) => [...prev, judgeMsg])
    }
  }

  if (!story) return null

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-800/30 px-5 py-3 backdrop-blur">
          <div className="text-xs font-semibold text-slate-300">当前汤面</div>
          <div className="mt-1 text-sm text-slate-50">{story.surface}</div>
        </div>

        <div className="flex items-center gap-3">
          <GlowButton onClick={() => navigate('/hall')}>返回大厅</GlowButton>
          <GlowButton
            onClick={() => navigate(`/result?id=${encodeURIComponent(story.id)}&win=0`)}
            className="bg-slate-800/70 hover:bg-slate-700/70"
          >
            查看汤底
          </GlowButton>
        </div>
      </div>

      <ChatBox messages={messages} isThinking={isThinking} onSend={handleSend} />
    </main>
  )
}

