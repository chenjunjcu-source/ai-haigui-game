import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Story } from '../lib/stories'

type Props = {
  story: Story
  unlocked: boolean
  cleared: boolean
}

export default function StoryCard({ story, unlocked, cleared }: Props) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (!unlocked) return
    navigate(`/game/${story.id}`)
  }

  const idNum = Number(story.id)
  const difficultyLabel =
    story.difficulty === 'Simple' ? '简单' : story.difficulty === 'Medium' ? '中等' : '困难'

  return (
    <button
      onClick={handleClick}
      className={[
        'w-full text-left',
        'relative overflow-hidden rounded-2xl border bg-slate-900/60 backdrop-blur',
        'p-4 shadow-[0_18px_45px_rgba(15,23,42,0.85)] transition-all duration-200',
        unlocked
          ? 'border-slate-700/80 hover:border-cyan-300/60 hover:shadow-[0_0_40px_rgba(56,189,248,0.32)]'
          : 'border-slate-800/90 opacity-70 cursor-not-allowed',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80'
      ].join(' ')}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
            第 {Number.isNaN(idNum) ? story.id : idNum} 关 · {difficultyLabel}
          </div>
          <div className="mt-1 text-base font-semibold text-slate-50">{story.title}</div>
          <div className="mt-2 text-xs text-slate-300">
            难度：
            <span className="ml-1 text-slate-50">{difficultyLabel}</span>
          </div>
        </div>
        <div className="shrink-0 rounded-lg bg-slate-950/40 px-2 py-1 text-xs text-slate-200 ring-1 ring-slate-700/70">
          #{story.id}
        </div>
      </div>

      <div className="mt-4 line-clamp-3 text-sm text-slate-300">{story.surface}</div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="text-cyan-200/90">
          {unlocked ? '点击进入 →' : '前一案件尚未结案'}
        </div>
        {cleared && (
          <div className="rotate-[-16deg] rounded-md border border-red-500/60 bg-red-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-red-300 shadow-[0_0_18px_rgba(248,113,113,0.45)]">
            结案
          </div>
        )}
      </div>

      {!unlocked && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-slate-950/60 backdrop-blur-[2px]">
          <div className="flex h-full items-center justify-center text-[11px] font-medium tracking-wide text-slate-300">
            🔒 先破解上一则案件
          </div>
        </div>
      )}
    </button>
  )
}

