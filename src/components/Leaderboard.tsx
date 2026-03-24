import React from 'react'
import { useNavigate } from 'react-router-dom'
import { loadPlayer, setActivePlayer } from '../lib/player'
import { setProgress } from '../lib/progress'

type Entry = {
  playerId: string
  name: string
  clearedCount: number
  maxClearedId: number
  updatedAt: string
}

export default function Leaderboard() {
  const navigate = useNavigate()
  const me = loadPlayer()
  const [entries, setEntries] = React.useState<Entry[]>([])
  const [restoringId, setRestoringId] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setEntries(Array.isArray(data.players) ? data.players : [])
      })
      .catch(() => {
        // 忽略错误，排行榜只是增强体验
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function restorePlayer(playerId: string) {
    if (!playerId || restoringId) return
    setRestoringId(playerId)
    try {
      const resp = await fetch(`/api/player/${encodeURIComponent(playerId)}`)
      if (!resp.ok) return
      const data = (await resp.json()) as {
        playerId?: string
        name?: string
        clearedIds?: string[]
        currentStoryId?: number
      }
      const id = String(data.playerId || playerId)
      const name = String(data.name || '无名侦探')
      setActivePlayer(id, name)
      setProgress({ clearedIds: Array.isArray(data.clearedIds) ? data.clearedIds : [] })
      const next = Number(data.currentStoryId)
      navigate(Number.isFinite(next) && next > 0 ? `/game/${next}` : '/hall')
    } catch {
      // 恢复失败时保持当前页面，不中断正常流程
    } finally {
      setRestoringId(null)
    }
  }

  if (!entries.length) {
    return (
      <div className="text-[10px] text-slate-500">
        暂无榜单数据，先去破解几起案件吧。
      </div>
    )
  }

  return (
    <div className="space-y-2 text-[11px]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
        侦探排行榜
      </div>
      <ul className="space-y-1.5">
        {entries.slice(0, 8).map((e, idx) => {
          const isMe = me && me.id === e.playerId
          return (
            <li
              key={e.playerId}
              className={[
                'flex items-center justify-between rounded-lg px-2 py-1.5',
                'cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_0_14px_rgba(56,189,248,0.28)]',
                isMe
                  ? 'bg-cyan-500/10 ring-1 ring-cyan-400/50 text-cyan-50'
                  : 'bg-slate-900/60 ring-1 ring-slate-700/80 text-slate-200'
              ].join(' ')}
              onClick={() => {
                void restorePlayer(e.playerId)
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 text-[10px] text-slate-400">#{idx + 1}</span>
                <span className="max-w-[120px] truncate">{e.name}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                {restoringId === e.playerId ? '恢复中...' : `${e.clearedCount} 关 · 至少通到 ${e.maxClearedId}`}
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

