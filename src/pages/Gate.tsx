import React from 'react'
import { useNavigate } from 'react-router-dom'
import Leaderboard from '../components/Leaderboard'
import { getProgress } from '../lib/progress'
import { loadPlayer, savePlayerName } from '../lib/player'
import GlowButton from '../components/GlowButton'

export default function Gate() {
  const navigate = useNavigate()

  const initialPlayer = React.useMemo(() => loadPlayer(), [])
  const [player, setPlayer] = React.useState(() => initialPlayer)
  const [nameInput, setNameInput] = React.useState(() => initialPlayer?.name ?? '')
  const [syncing, setSyncing] = React.useState(false)

  async function syncToServer(p: { id: string; name: string } | null) {
    if (!p) return
    setSyncing(true)
    try {
      const prog = getProgress()
      const body = {
        playerId: p.id,
        name: p.name,
        clearedIds: prog.clearedIds
      }

      await fetch('/api/player/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
    } catch {
      // 排行榜同步失败不影响进入大厅
    } finally {
      setSyncing(false)
    }
  }

  React.useEffect(() => {
    if (!player) return
    // 进入门禁后补齐：本地进度丢过一次服务器就补上
    syncToServer(player).catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function enterHall() {
    if (!player) return
    navigate('/hall')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_55%)]" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid gap-6 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.9)] backdrop-blur-2xl md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <section>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">玩家档案</div>
            <h2 className="mt-2 text-xl font-semibold">侦探代号 · 排行榜门禁</h2>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">
              先确认你的侦探代号。之后每次通关都会记录到排行榜；就算你不小心退出，也能从历史进度继续。
            </p>

            {!player ? (
              <div className="mt-5 space-y-3">
                <div className="text-xs text-slate-300">请输入昵称（用于显示你的排名）</div>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="例如：卡卡、深夜听雨、无声侦探"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-950/40 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
                />
                <GlowButton
                  disabled={syncing}
                  onClick={() => {
                    const saved = savePlayerName(nameInput || '无名侦探')
                    setPlayer(saved)
                    syncToServer(saved).catch(() => {}).finally(() => {
                      navigate('/hall')
                    })
                  }}
                  className="w-full justify-center"
                >
                  {syncing ? '正在同步...' : '确认代号并进入大厅'}
                </GlowButton>
                <div className="text-[10px] text-slate-500">
                  说明：本地进度使用 localStorage 保存，排行榜会同步到服务器的本地文件。
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-4">
                  <div className="text-[11px] font-semibold text-slate-300">当前玩家</div>
                  <div className="mt-2 text-xl font-semibold text-cyan-200/95">{player.name}</div>
                  <div className="mt-2 text-[10px] text-slate-500">
                    你的进度会在进入门禁后自动同步到排行榜。
                  </div>
                </div>
                <GlowButton onClick={enterHall} className="w-full justify-center">
                  进入游戏大厅
                </GlowButton>
              </div>
            )}
          </section>

          <section>
            <Leaderboard />
            <div className="mt-4 text-[10px] text-slate-500 leading-relaxed">
              提示：你可以先看排行榜再决定从哪一关开始。解锁规则仍按顺序进行。
            </div>
            <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-900/30 p-4">
              <div className="text-[11px] font-semibold text-slate-300">当前解锁概览</div>
              <div className="mt-2 text-[10px] text-slate-500">返回大厅后可以直接选择“简单/中等/困难”页签。</div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

