import React from 'react'
import Gate from './Gate'

export default function Welcome() {
  const [leaving, setLeaving] = React.useState(false)
  const [showGate, setShowGate] = React.useState(false)

  function start() {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(() => {
      setLeaving(false)
      setShowGate(true)
    }, 550)
  }

  if (showGate) {
    return <Gate />
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(56,189,248,0.16),transparent_55%),radial-gradient(circle_at_90%_100%,rgba(15,23,42,0.95),transparent_65%)] opacity-70" />

      <div
        className={[
          'relative z-10 flex max-w-xl flex-col items-center gap-8 text-center transition-opacity duration-500',
          leaving ? 'opacity-0' : 'opacity-100'
        ].join(' ')}
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">
          AI 海龟汤 · 调查局
        </div>

        <h1 className="welcome-title bg-gradient-to-r from-cyan-200 via-sky-400 to-indigo-300 bg-clip-text text-3xl font-semibold tracking-[0.22em] text-transparent md:text-4xl">
          AI 海龟汤调查局
        </h1>

        <p className="max-w-md text-xs leading-relaxed text-slate-300">
          这里收录了六十起离奇案件。你将与冷酷的海龟汤法官对峙，
          只能从「是」、「否」与「与此无关」中，
          一点点剥开真相的外壳。
        </p>

        <button
          type="button"
          onClick={start}
          className={[
            'relative mt-2 inline-flex items-center justify-center rounded-full px-10 py-3 text-sm font-medium tracking-[0.18em]',
            'text-cyan-50',
            'pulse-button',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80'
          ].join(' ')}
        >
          <span className="mr-2 text-lg">▶</span>
          开启调查
        </button>

        <div className="mt-2 text-[10px] text-slate-500">
          建议佩戴耳机，在深夜独自一人时游玩。
        </div>
      </div>

      {leaving && (
        <div className="pointer-events-none absolute inset-0 z-20 bg-slate-950/95 transition-opacity duration-500 opacity-100" />
      )}
    </main>
  )
}

