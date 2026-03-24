import React from 'react'
import StoryCard from '../components/StoryCard'
import { stories } from '../lib/stories'
import { getProgress, isCleared } from '../lib/progress'
import GlowButton from '../components/GlowButton'
import { useNavigate } from 'react-router-dom'
import { loadPlayer } from '../lib/player'

export default function Home() {
  const navigate = useNavigate()
  const [progress, setProgress] = React.useState(() => getProgress())
  const [musicOn, setMusicOn] = React.useState(false)
  const [tab, setTab] = React.useState<'simple' | 'medium' | 'hard'>('simple')
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  React.useEffect(() => {
    setProgress(getProgress())
  }, [])

  React.useEffect(() => {
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
      // 排行榜同步是增强体验；失败不影响游戏
    })
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    if (!audioRef.current) {
      const audio = new Audio('/audio/bgm.mp3')
      audio.loop = true
      audio.volume = 0.35
      audioRef.current = audio
    }

    const audio = audioRef.current
    if (!audio) return

    if (musicOn) {
      audio
        .play()
        .catch(() => {
          // 浏览器阻止自动播放时，关闭开关防止状态不一致
          setMusicOn(false)
        })
    } else {
      audio.pause()
    }

    return () => {
      audio.pause()
    }
  }, [musicOn])

  const simpleStories = React.useMemo(() => stories.filter((s) => s.id && Number(s.id) >= 1 && Number(s.id) <= 10), [])
  const mediumStories = React.useMemo(
    () => stories.filter((s) => s.id && Number(s.id) >= 11 && Number(s.id) <= 30),
    []
  )
  const hardStories = React.useMemo(
    () => stories.filter((s) => s.id && Number(s.id) >= 31 && Number(s.id) <= 60),
    []
  )

  const allSimpleCleared = simpleStories.every((s) => isCleared(s.id))
  const allSimpleMediumCleared = [...simpleStories, ...mediumStories].every((s) => isCleared(s.id))

  const canSimple = true
  const canMedium = allSimpleCleared
  const canHard = allSimpleMediumCleared

  const visibleStories =
    tab === 'simple' ? simpleStories : tab === 'medium' ? mediumStories : hardStories

  return (
    <main className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-700/70 bg-slate-900/50 px-4 py-3 backdrop-blur">
            <div className="h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(56,189,248,0.75)]" />
            <h1 className="text-lg font-semibold tracking-[0.18em]">AI 海龟汤调查局</h1>
          </div>
          <p className="mt-3 max-w-xl text-xs text-slate-300">
            一面墙的离奇案件档案。选择一份“汤面”，和冷酷的海龟汤法官一起，把真相从黑暗中拽出来。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setMusicOn((v) => !v)}
            className={[
              'inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-2 text-xs text-slate-200',
              'hover:border-cyan-300/70 hover:text-cyan-100 hover:shadow-[0_0_20px_rgba(56,189,248,0.35)]',
              'transition-all duration-200'
            ].join(' ')}
          >
            <span className="text-base">{musicOn ? '🎧' : '🔇'}</span>
            <span>{musicOn ? '背景乐：开启' : '背景乐：静音'}</span>
            <span className="text-[10px] text-slate-400">(UI 预留，稍后接入)</span>
          </button>

          <GlowButton onClick={() => navigate(`/room/${Date.now().toString(36)}`)} className="text-xs px-3 py-2">
            创建多人房间
          </GlowButton>
          <GlowButton
            onClick={() => {
              const id = window.prompt('输入房间编号（示例：detective-001）：') || ''
              if (!id.trim()) return
              navigate(`/room/${encodeURIComponent(id.trim())}`)
            }}
            className="text-xs px-3 py-2"
          >
            加入房间
          </GlowButton>
        </div>
      </header>

      <section className="grid gap-5 rounded-3xl border border-slate-800/80 bg-slate-950/60 p-5 shadow-[0_40px_120px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">侦探档案墙</h2>
            <p className="mt-1 text-[11px] text-slate-400">按顺序破解案件，逐步解锁更棘手的汤面。</p>
          </div>
          <div className="text-[11px] text-slate-400">
            已结案
            <span className="mx-1 text-cyan-300">
              {progress.clearedIds.length}/{stories.length}
            </span>
            起
          </div>
          </div>
        </div>

        <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-slate-900/80 p-1 text-[11px] text-slate-200 ring-1 ring-slate-700/70">
          <button
            type="button"
            onClick={() => canSimple && setTab('simple')}
            className={[
              'rounded-full px-3 py-1 transition-all',
              tab === 'simple' ? 'bg-cyan-500/25 text-cyan-50 shadow-[0_0_16px_rgba(56,189,248,0.45)]' : ''
            ].join(' ')}
          >
            简单
          </button>
          <button
            type="button"
            disabled={!canMedium}
            onClick={() => canMedium && setTab('medium')}
            className={[
              'rounded-full px-3 py-1 transition-all',
              !canMedium ? 'cursor-not-allowed text-slate-500' : '',
              tab === 'medium' ? 'bg-cyan-500/25 text-cyan-50 shadow-[0_0_16px_rgba(56,189,248,0.45)]' : ''
            ].join(' ')}
          >
            中等{!canMedium ? '（需先通关简单）' : ''}
          </button>
          <button
            type="button"
            disabled={!canHard}
            onClick={() => canHard && setTab('hard')}
            className={[
              'rounded-full px-3 py-1 transition-all',
              !canHard ? 'cursor-not-allowed text-slate-500' : '',
              tab === 'hard' ? 'bg-cyan-500/25 text-cyan-50 shadow-[0_0_16px_rgba(56,189,248,0.45)]' : ''
            ].join(' ')}
          >
            困难{!canHard ? '（需先通关中等）' : ''}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {visibleStories.map((story) => {
            const idNum = Number(story.id)
            const cleared = isCleared(story.id)
            const unlocked = Number.isNaN(idNum) || idNum === 1 ? true : isCleared(String(idNum - 1))

            return <StoryCard key={story.id} story={story} unlocked={unlocked} cleared={cleared} />
          })}
        </div>

      </section>

    </main>
  )
}

