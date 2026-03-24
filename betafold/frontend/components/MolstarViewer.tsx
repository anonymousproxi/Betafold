'use client'

interface Props {
  pdbId?: string
}

export default function MolstarViewer({ pdbId }: Props) {
  if (!pdbId || pdbId === 'None' || pdbId === '') {
    return (
      <div className="glass" style={{ padding: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>No experimental PDB structure matched for 3D visualization. Transformer prediction fallback used.</p>
      </div>
    );
  }

  return (
    <div className="glass" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontWeight: 600 }}>Interactive 3D Viewer (Mol*)</h3>
        <span style={{ fontSize: 13, color: 'var(--muted)', background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: 12 }}>
          PDB Match: {pdbId.toUpperCase()}
        </span>
      </div>
      <div style={{ width: '100%', height: 600, position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <iframe
          src={`https://molstar.org/viewer/?pdb=${pdbId.toLowerCase()}&hide-controls=1`}
          title={`Mol* 3D Viewer for ${pdbId}`}
          style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#0b0f19' }}
          allow="fullscreen"
        />
      </div>
    </div>
  )
}
