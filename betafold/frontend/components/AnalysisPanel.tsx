'use client'
interface Props { data: any }

export default function AnalysisPanel({ data }: Props) {
  if (!data) return (
    <div className="glass" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
      No analysis data.
    </div>
  )

  const { function_prediction, binding_sites, stability_score, insights, risk_flags } = data

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <div className="glass" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎯</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>STABILITY SCORE</div>
          <div style={{
            fontSize: 24, fontWeight: 700,
            color: stability_score > 0.7 ? '#10b981' : stability_score > 0.4 ? '#f59e0b' : '#ef4444'
          }}>
            {stability_score !== undefined ? `${(stability_score * 100).toFixed(0)}%` : 'N/A'}
          </div>
        </div>

        <div className="glass" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔬</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>BINDING SITES</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{binding_sites?.length || 0}</div>
        </div>

        <div className="glass" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
          <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 4 }}>RISK FLAGS</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: risk_flags?.length ? '#ef4444' : '#10b981' }}>
            {risk_flags?.length || 0}
          </div>
        </div>
      </div>

      {/* Function prediction */}
      {function_prediction && (
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 12, fontWeight: 600 }}>🎯 Predicted Function</h3>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{function_prediction}</p>
        </div>
      )}

      {/* AI Insights */}
      {insights?.length > 0 && (
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 600 }}>🧠 AI Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {insights.map((insight: string, i: number) => (
              <div key={i} style={{
                padding: '12px 16px',
                background: 'rgba(99,102,241,0.08)',
                borderRadius: 8,
                borderLeft: '3px solid var(--accent)',
                fontSize: 14, lineHeight: 1.6
              }}>
                {insight}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Binding sites */}
      {binding_sites?.length > 0 && (
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 600 }}>🔬 Predicted Binding Sites</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {binding_sites.map((site: any, i: number) => (
              <div key={i} style={{
                padding: '6px 14px',
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.4)',
                borderRadius: 20, fontSize: 13
              }}>
                Residues {site.start}–{site.end} ({site.type})
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk flags */}
      {risk_flags?.length > 0 && (
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 600 }}>⚠️ Risk Flags</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {risk_flags.map((flag: string, i: number) => (
              <div key={i} style={{
                padding: '10px 16px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 8, fontSize: 14, color: '#fca5a5'
              }}>
                ⚠ {flag}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}