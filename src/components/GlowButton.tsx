import React from 'react'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}

export default function GlowButton({
  children,
  onClick,
  disabled,
  type = 'button',
  className = ''
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium',
        'bg-slate-800/70 text-slate-100 ring-1 ring-slate-700/70 backdrop-blur',
        'hover:bg-slate-700/70 hover:shadow-[0_0_24px_rgba(56,189,248,0.42)]',
        'hover:-translate-y-0.5',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/80',
        disabled ? 'opacity-60 cursor-not-allowed hover:shadow-none' : '',
        className
      ].join(' ')}
    >
      {children}
    </button>
  )
}

