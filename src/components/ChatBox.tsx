import React from 'react'

export type ChatMessage = {
  id: string
  role: 'player' | 'judge'
  content: string
}

export default function ChatBox({
  messages,
  isThinking,
  onSend
}: {
  messages: ChatMessage[]
  isThinking: boolean
  onSend: (text: string) => void
}) {
  const [text, setText] = React.useState('')
  const listRef = React.useRef<HTMLDivElement | null>(null)
  const lastAnimatedIdRef = React.useRef<string | null>(null)
  const [lastAnimatedId, setLastAnimatedId] = React.useState<string | null>(null)
  const prevLenRef = React.useRef<number>(0)
  const [dotCount, setDotCount] = React.useState(0)

  React.useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isThinking])

  React.useEffect(() => {
    if (messages.length > prevLenRef.current) {
      const last = messages[messages.length - 1]
      lastAnimatedIdRef.current = last.id
      setLastAnimatedId(last.id)
    }
    prevLenRef.current = messages.length
  }, [messages])

  React.useEffect(() => {
    if (!isThinking) {
      setDotCount(0)
      return
    }

    const t = window.setInterval(() => {
      setDotCount((c) => (c + 1) % 4)
    }, 320)
    return () => window.clearInterval(t)
  }, [isThinking])

  function submit() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }

  return (
    <div className="flex h-[70vh] min-h-[520px] flex-col gap-3">
      <div
        ref={listRef}
        className="flex-1 overflow-auto rounded-2xl border border-slate-700/70 bg-slate-950/25 p-4 backdrop-blur-xl shadow-[0_0_30px_rgba(2,132,199,0.06)]"
      >
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={[
                'flex gap-3',
                m.role === 'player' ? 'justify-end' : 'justify-start'
              ].join(' ')}
            >
              {m.role === 'judge' && <div className="mt-1 text-lg opacity-90 select-none">🎭</div>}

              <div
                className={[
                  'max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ring-1',
                  m.role === 'player'
                    ? 'bg-slate-950/35 text-slate-100 ring-slate-700/60'
                    : 'bg-slate-900/35 text-slate-100 ring-slate-700/60',
                  m.role === 'judge'
                    ? 'shadow-[0_0_22px_rgba(56,189,248,0.22),0_0_42px_rgba(56,189,248,0.12)]'
                    : '',
                  lastAnimatedId === m.id ? 'fade-in-up' : ''
                ].join(' ')}
              >
                {m.content}
              </div>

              {m.role === 'player' && <div className="mt-1 text-lg opacity-90 select-none">🕵️‍♂️</div>}
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900/30 px-4 py-2 text-sm ring-1 ring-slate-700/60">
                <span className="text-slate-200">法官正在沉思</span>
                <span className="font-mono text-cyan-200/90">{'.'.repeat(dotCount)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className="flex items-center gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入你的问题（例如：这是玩具吗？）"
          className="flex-1 rounded-xl border border-slate-700/70 bg-slate-950/20 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
        />
        <button
          type="submit"
          disabled={isThinking}
          className={[
            'rounded-xl bg-cyan-500/15 px-4 py-3 text-sm font-medium text-cyan-50 ring-1 ring-cyan-300/25',
            'hover:bg-cyan-500/25 hover:shadow-[0_0_28px_rgba(56,189,248,0.45)] hover:-translate-y-0.5',
            'transition-all duration-200 ease-out',
            'disabled:opacity-60 disabled:hover:shadow-none'
          ].join(' ')}
        >
          发送
        </button>
      </form>
    </div>
  )
}
