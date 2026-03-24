import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ChatBox, { type ChatMessage } from '../components/ChatBox'
import GlowButton from '../components/GlowButton'

const MOCK_MEMBERS = ['🕵️‍♂️ 侦探·你', '🕵️ 侦探·阿尔法', '🕵️ 侦探·贝塔']

export default function Room() {
  const { roomId } = useParams()
  const navigate = useNavigate()

  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'sys-1',
      role: 'judge',
      content: '房间已建立。当前为多人推理原型模式，暂未接入实时联机。'
    }
  ])
  const [isThinking, setIsThinking] = React.useState(false)

  function handleSend(text: string) {
    const playerMsg: ChatMessage = {
      id: `${Date.now()}_p`,
      role: 'player',
      content: text
    }
    setMessages((prev) => [...prev, playerMsg])
    setIsThinking(true)

    window.setTimeout(() => {
      const judgeMsg: ChatMessage = {
        id: `${Date.now()}_j`,
        role: 'judge',
        content: '与此无关。 (多人模式原型：未来这里会接入实时同步)'
      }
      setMessages((prev) => [...prev, judgeMsg])
      setIsThinking(false)
    }, 650)
  }

  const label = roomId ?? 'detective-room'

  return (
    <main className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
      <aside className="hidden w-56 shrink-0 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 text-xs text-slate-200 shadow-[0_30px_90px_rgba(15,23,42,0.9)] backdrop-blur-xl md:block">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          在线成员
        </div>
        <ul className="space-y-2 text-[11px]">
          {MOCK_MEMBERS.map((m) => (
            <li
              key={m}
              className="flex items-center justify-between rounded-lg bg-slate-900/60 px-2 py-2 ring-1 ring-slate-700/80"
            >
              <span>{m}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
            </li>
          ))}
        </ul>
        <div className="mt-4 text-[10px] text-slate-500">
          多人模式目前为视觉与交互原型，未来将通过 WebSocket 接入真实联机。
        </div>
      </aside>

      <section className="flex min-h-[520px] flex-1 flex-col">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              多人推理房间
            </div>
            <div className="mt-1 text-xs text-slate-300">房间号：{label}</div>
          </div>
          <div className="flex items-center gap-3">
            <GlowButton onClick={() => navigate('/hall')}>返回大厅</GlowButton>
          </div>
        </div>

        <ChatBox messages={messages} isThinking={isThinking} onSend={handleSend} />
      </section>
    </main>
  )
}

