const VICTORY = '完全正确！恭喜你揭开了真相！'
const ALLOWED = ['是。', '否。', '与此无关。', '不是。', '与此无关']

function normalizeReply(raw: string): string {
  const t = (raw ?? '').toString().trim()
  if (!t) return '与此无关。'

  if (/完全正确[！!]\s*恭喜你揭开了真相[！!]?/u.test(t)) return VICTORY

  if (t.includes('是。') || t.includes('是')) return '是。'
  if (t.includes('否。') || t.includes('否') || t.includes('不是。') || t.includes('不是')) return '否。'
  if (t.includes('与此无关。') || t.includes('与此无关') || t.includes('無關') || t.includes('无关')) {
    return '与此无关。'
  }

  // 兜底：严格回到三句之一
  return '与此无关。'
}

export async function askAI(question: string, story: any): Promise<string> {
  try {
    const storyId = story?.id ?? story?.storyId
    if (!storyId) {
      return '（法官陷入了沉默，通讯受到干扰...）'
    }

    const resp = await fetch('/api/judge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storyId: String(storyId),
        question,
        history: []
      })
    })

    if (!resp.ok) {
      return '（法官陷入了沉默，通讯受到干扰...）'
    }

    const data = (await resp.json()) as { reply?: string }
    const normalized = normalizeReply(data?.reply ?? '')
    return normalized === VICTORY || ALLOWED.includes(normalized) ? normalized : '与此无关。'
  } catch {
    return '（法官陷入了沉默，通讯受到干扰...）'
  }
}

