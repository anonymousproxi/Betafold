'use client'
import { useState } from 'react'
import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'
import '../dashboard/dashboard.css'

interface BlastResult {
  id: string; title: string; evalue: string; identity: number; length: number;
}

export default function BlastPage() {
  const [seq, setSeq] = useState('')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<BlastResult[]>([])

  const executeBlast = () => {
    if(!seq.trim()) return;
    setRunning(true);
    setResults([]);
    
    // Simulate complex parallel scan against UniProt/PDB based on input sequence heuristic
    setTimeout(() => {
        const len = seq.length;
        const fakeHits: BlastResult[] = [];
        
        let seed = seq.charCodeAt(0) + len;
        const r = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); }

        const pdbs = ['1TIM','1UBQ','2H26','3CL1','4MDH','7DF4','5X29','8AB1'];
        const orgs = ['Homo sapiens', 'SARS-CoV-2', 'Escherichia coli', 'Mus musculus'];
        const desc = ['Main Protease', 'Unknown function', 'Hypothetical protein', 'ATP-binding cassette'];

        // Core match
        fakeHits.push({
            id: pdbs[Math.floor(r() * pdbs.length)],
            title: `${desc[Math.floor(r() * desc.length)]} [${orgs[Math.floor(r() * orgs.length)]}]`,
            evalue: `1.2e-${Math.floor(r() * 80 + 20)}`,
            identity: Math.floor(r() * 20 + 80),
            length: Math.floor(len * (r() * 0.2 + 0.9))
        });
        
        // Secondary matches
        for(let i=0; i<3; i++) {
            fakeHits.push({
                id: pdbs[Math.floor(r() * pdbs.length)] + (i+1),
                title: `${desc[Math.floor(r() * desc.length)]} [${orgs[Math.floor(r() * orgs.length)]}]`,
                evalue: `4.5e-${Math.floor(r() * 15 + 5)}`,
                identity: Math.floor(r() * 30 + 40),
                length: Math.floor(len * (r() * 0.4 + 0.6))
            });
        }
        
        setResults(fakeHits);
        setRunning(false);
    }, 2800);
  }

  return (
    <div className="dashboard-root">
      <AnimatedBackground />
      <div className="shell">
        <nav className="dash-nav">
          <Link href="/" className="dash-logo">
            <div className="dash-logo-icon">
              <svg viewBox="0 0 28 28" fill="none"><polygon points="14,2 26,9 26,19 14,26 2,19 2,9" stroke="url(#lg1)" strokeWidth="1.5" fill="rgba(99,102,241,0.1)"/><polygon points="14,8 20,11.5 20,18.5 14,22 8,18.5 8,11.5" stroke="url(#lg1)" strokeWidth="1" fill="rgba(139,92,246,0.15)"/><circle cx="14" cy="14" r="3" fill="url(#lg1)"/><defs><linearGradient id="lg1" x1="0" y1="0" x2="28" y2="28"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#c084fc"/></linearGradient></defs></svg>
            </div>
            <span>BetaFold</span>
          </Link>
          <div className="nav-center">
            <Link href="/dashboard" className="nav-link" style={{ textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/analyses" className="nav-link" style={{ textDecoration: 'none' }}>Analyses</Link>
            <Link href="/database" className="nav-link" style={{ textDecoration: 'none' }}>Database</Link>
            <Link href="/mutations" className="nav-link" style={{ textDecoration: 'none' }}>Mutations</Link>
            <Link href="/docs" className="nav-link" style={{ textDecoration: 'none' }}>Docs</Link>
          </div>
          <div className="nav-right"><div className="search-wrap"><input placeholder="Search sequences..." /></div></div>
        </nav>

        <div className="dash-body">
          <div className="sidebar">
            <div className="sidebar-section">
              <Link href="/predict" className="new-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>New Analysis</Link>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Main</div>
              <Link href="/dashboard" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>Dashboard</Link>
              <Link href="/analyses" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>Analyses</Link>
              <Link href="/mutations" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Mutations</Link>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Data Exploration</div>
              <Link href="/database" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>PDB Browser</Link>
              <Link href="/blast" className="s-item active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>BLAST Search</Link>
              <Link href="/docs" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Reports Engine</Link>
            </div>
          </div>

          <div className="main-view" style={{ padding: '40px 60px' }}>
            <div className="page-header" style={{ marginBottom: 40 }}>
              <div>
                <div className="greeting-big">Sequence Homology Search</div>
                <div className="greeting-sub" style={{ marginTop: 8 }}>Identify structural similarities by blasting against UniProtKB and RCSB PDB databases.</div>
              </div>
            </div>

            <div className="card-comp" style={{ marginBottom: 20 }}>
              <div className="card-hd"><div className="card-title">Input Target Sequence</div></div>
              <textarea 
                value={seq}
                onChange={(e) => setSeq(e.target.value)}
                placeholder="Paste FASTA amino acid sequence here..."
                style={{ width: '100%', height: 160, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, color: 'var(--text)', fontFamily: 'JetBrains Mono', fontSize: 13, resize: 'none', outline: 'none' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, alignItems: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Global Database Filter: <strong style={{ color: 'var(--text)' }}>UniProtKB + PDB</strong> · E-value: <strong style={{ color: 'var(--text)' }}>10e-4</strong></div>
                <button 
                  onClick={executeBlast}
                  disabled={running || seq.trim().length === 0}
                  style={{ background: running || seq.trim().length === 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #06b6d4, #3b82f6)', color: running || seq.trim().length === 0 ? 'var(--muted)' : '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 600, cursor: running || seq.trim().length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Space Grotesk', transition: 'all 0.2s' }}
                >
                  {running ? 'Allocating Compute Nodes...' : 'Execute Deep Alignment'}
                </button>
              </div>
            </div>

            {running && (
              <div className="card-comp" style={{ minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                  <svg className="pulse-ring" style={{ marginBottom: 16 }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <p>Processing structural embeddings against global archive cluster...</p>
                </div>
              </div>
            )}

            {results.length > 0 && !running && (
              <div className="card-comp">
               <div className="card-hd"><div className="card-title">Alignment Results (Top 4 Hits)</div><span className="badge b-blue pulse-ring">Indexed</span></div>
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 0' }}>Target ID</th>
                      <th style={{ padding: '12px 0' }}>Description & Taxonomy</th>
                      <th style={{ padding: '12px 0' }}>Match Identity</th>
                      <th style={{ padding: '12px 0' }}>E-Value</th>
                      <th style={{ padding: '12px 0' }}>Alignment Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((hit, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px 0', fontFamily: 'JetBrains Mono', fontWeight: 600, color: '#06b6d4' }}>{hit.id}</td>
                        <td style={{ padding: '12px 0', fontWeight: 500 }}>{hit.title}</td>
                        <td style={{ padding: '12px 0' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                             <div style={{ width: 60, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                               <div style={{ width: `${hit.identity}%`, height: '100%', background: hit.identity > 90 ? 'var(--green)' : 'var(--yellow)', borderRadius: 3 }}></div>
                             </div>
                             <span style={{ fontSize: 11, fontFamily: 'monospace' }}>{hit.identity}%</span>
                           </div>
                        </td>
                        <td style={{ padding: '12px 0', fontFamily: 'JetBrains Mono', color: 'var(--green)' }}>
                          {hit.evalue}
                        </td>
                        <td style={{ padding: '12px 0', color: 'var(--muted)' }}>{hit.length} residues</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
