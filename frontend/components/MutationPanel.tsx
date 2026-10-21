'use client'
interface Props { data: any; sequence: string }

export default function MutationPanel({ data, sequence }: Props) {
  const mutations = data?.mutations || []

  if (!mutations.length) return (
    <div className="glass" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
      No mutation suggestions available.
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Disclaimer */}
      <div className="glass" style={{
        padding: '14px 20px',
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: 10
      }}>
        <p style={{ fontSize: 13, color: '#fcd34d' }}>
          ⚠️ These suggestions are AI-predicted and have NOT been experimentally validated.
          Use for research purposes only.
        </p>
      </div>

      {mutations.map((m: any, i: number) => (
        <div key={i} className="glass" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700 }}>
                {m.original}
                <span style={{ color: 'var(--muted)' }}>{m.position}</span>
                <span style={{ color: 'var(--accent)' }}>{m.mutant}</span>
              </span>
              <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--muted)' }}>
                {m.original_name} → {m.mutant_name}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>Confidence</div>
              <div style={{ fontWeight: 700, color: m.confidence > 0.7 ? '#10b981' : '#f59e0b' }}>
                {(m.confidence * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            {m.explanation}
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 12px',
              background: m.impact === 'positive' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${m.impact === 'positive' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.3)'}`,
              borderRadius: 20, fontSize: 12,
              color: m.impact === 'positive' ? '#6ee7b7' : '#fca5a5'
            }}>
              {m.impact === 'positive' ? '↑ Stability improvement' : '↓ May reduce stability'}
            </span>
            <span style={{
              padding: '4px 12px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 20, fontSize: 12, color: '#a5b4fc'
            }}>
              {m.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}