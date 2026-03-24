'use client'
import { useState } from 'react'

interface Props { data: any; sequence: string }

const SS_COLORS: Record<string, string> = {
  H: '#8b5cf6',
  E: '#f59e0b',
  C: '#6b7280',
}
const SS_LABELS: Record<string, string> = {
  H: 'Alpha Helix',
  E: 'Beta Sheet',
  C: 'Coil/Loop'
}

export default function SecondaryStructureViewer({ data, sequence }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  const ss: string[] = data?.secondary_structure || []
  const confidence: number[] = data?.confidence_per_residue || []

  if (!ss.length) return (
    <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
      <p style={{ color: 'var(--muted)' }}>Secondary structure data not available.</p>
    </div>
  )

  const residues = sequence.split('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Legend */}
      <div className="glass" style={{ padding: '16px 24px', display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(SS_LABELS).map(([k, label]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 20, height: 14,
              borderRadius: k === 'H' ? 7 : k === 'E' ? 2 : 7,
              background: SS_COLORS[k]
            }} />
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
        <span style={{ color: 'var(--muted)', fontSize: 13, marginLeft: 'auto' }}>
          {ss.filter(s => s === 'H').length} helical ·{' '}
          {ss.filter(s => s === 'E').length} sheet ·{' '}
          {ss.filter(s => s === 'C').length} coil residues
        </span>
      </div>

      {/* Structure bar (SVG Rendered) */}
      <div className="glass" style={{ padding: 24, overflowX: 'auto' }}>
        <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Secondary Structure Map (2D)</h3>
        <svg 
          width={Math.max(600, residues.length * 12)} 
          height="80" 
          style={{ minWidth: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: 8, display: 'block' }}
        >
          {residues.map((aa, i) => {
            const x = i * 12;
            const isH = ss[i] === 'H';
            const isE = ss[i] === 'E';
            const isHovered = hovered === i;
            const opacity = hovered === null ? 0.9 : isHovered ? 1 : 0.3;
            
            // Render different SVG paths based on the structure type
            let element;
            if (isH) {
              element = <rect x={x} y={25} width={11} height={30} rx={5} fill={SS_COLORS['H']} />;
            } else if (isE) {
              // Arrow-like shape for beta sheet
              element = <polygon points={`${x},28 ${x+10},28 ${x+12},40 ${x+10},52 ${x},52`} fill={SS_COLORS['E']} />;
            } else {
              // Thin line for coil
              element = <rect x={x} y={38} width={12} height={4} fill={SS_COLORS['C']} />;
            }

            return (
              <g 
                key={i} 
                onMouseEnter={() => setHovered(i)} 
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s', opacity }}
              >
                {element}
                <text x={x + 6} y={15} fontSize="9" fill="var(--muted)" textAnchor="middle" opacity={isHovered ? 1 : 0.3}>{aa}</text>
                {i % 10 === 0 && <text x={x + 6} y={70} fontSize="9" fill="var(--border)" textAnchor="middle">{i + 1}</text>}
              </g>
            );
          })}
        </svg>

        {hovered !== null && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(99,102,241,0.1)', borderRadius: 8, border: '1px solid rgba(99,102,241,0.3)' }}>
            <strong>Residue {hovered + 1}: {residues[hovered]}</strong>
            <span style={{ color: 'var(--muted)', marginLeft: 12 }}>
              {SS_LABELS[ss[hovered]] || 'Unknown'}
            </span>
            {confidence[hovered] !== undefined && (
              <span style={{ color: 'var(--muted)', marginLeft: 12, fontSize: 13 }}>
                Confidence: {(confidence[hovered] * 100).toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>

      {/* Confidence chart */}
      {confidence.length > 0 && (
        <div className="glass" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Per-residue Confidence (pLDDT)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 80 }}>
            {confidence.map((c, i) => (
              <div
                key={i}
                style={{
                  flex: 1, minWidth: 2,
                  height: `${c * 100}%`,
                  background: c > 0.7 ? '#10b981' : c > 0.5 ? '#f59e0b' : '#ef4444',
                  borderRadius: '2px 2px 0 0',
                  transition: 'opacity 0.15s',
                  opacity: hovered === i ? 1 : 0.75,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>
            <span>Residue 1</span>
            <span>Residue {confidence.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12 }}>
            <span style={{ color: '#10b981' }}>● High (&gt;70)</span>
            <span style={{ color: '#f59e0b' }}>● Medium (50–70)</span>
            <span style={{ color: '#ef4444' }}>● Low (&lt;50)</span>
          </div>
        </div>
      )}
    </div>
  )
}