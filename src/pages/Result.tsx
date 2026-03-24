import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GlowButton from '../components/GlowButton'
import { getStoryById } from '../lib/stories'
import { markCleared } from '../lib/progress'
import { getProgress } from '../lib/progress'
import { loadPlayer } from '../lib/player'

export default function Result() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id') ?? ''
  const win = searchParams.get('win') === '1'
  const story = getStoryById(id)

  React.useEffect(() => {
    if (story && win) {
      markCleared(story.id)
      const player = loadPlayer()
      if (!player) return
      const p = getProgress()
      const body = {
        playerId: player.id,
        name: player.name,
        clearedIds: p.clearedIds
      }
      fetch('/api/player/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(() => {
        // 忽略失败，排行榜不是核心流程
      })
    }
  }, [story, win])

  if (!story) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-800/30 p-6">
          <div className="text-sm text-slate-300">没有找到对应的汤底</div>
          <div className="mt-4">
            <GlowButton onClick={() => navigate('/hall')}>返回大厅</GlowButton>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-slate-700/70 bg-slate-800/30 p-6 backdrop-blur">
        <div className="text-xs font-semibold text-slate-300">汤底已揭晓</div>
        <div className="mt-2 text-xl font-semibold">{story.title}</div>
        <div className="mt-4 text-sm text-slate-200 leading-relaxed">
          <span className="text-cyan-200/90">真相：</span>
          {story.bottom}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <GlowButton onClick={() => navigate('/hall')}>再玩一局</GlowButton>
          <GlowButton onClick={() => navigate(`/game/${story.id}`)} className="bg-slate-800/70 hover:bg-slate-700/70">
            返回对战页
          </GlowButton>
        </div>
      </div>
    </main>
  )
}

