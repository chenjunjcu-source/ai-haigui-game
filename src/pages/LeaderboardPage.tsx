import React from 'react'
import { useNavigate } from 'react-router-dom'
import Leaderboard from '../components/Leaderboard'
import GlowButton from '../components/GlowButton'

/**
 * 独立排行榜页：供大厅「返回排行榜」等按钮显式跳转，不依赖浏览器历史。
 */
export default function LeaderboardPage() {
  const navigate = useNavigate()

  return (
    <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.08),transparent_55%)]" />

      <header className="relative z-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">侦探排行榜</div>
          <h1 className="mt-2 text-xl font-semibold text-slate-100">全局榜单 · 点击条目可恢复该侦探进度</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <GlowButton
            onClick={() => navigate('/hall')}
            className="text-xs px-4 py-2 hover:bg-slate-700/70 hover:shadow-[0_0_24px_rgba(56,189,248,0.42)] hover:-translate-y-0.5"
          >
            进入游戏大厅
          </GlowButton>
          <GlowButton
            onClick={() => navigate('/')}
            className="text-xs px-4 py-2 hover:bg-slate-700/70 hover:shadow-[0_0_24px_rgba(56,189,248,0.42)] hover:-translate-y-0.5"
          >
            返回欢迎页
          </GlowButton>
        </div>
      </header>

      <section className="relative z-10 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
        <Leaderboard />
      </section>
    </main>
  )
}
