'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'
import '../dashboard/dashboard.css'

export default function DatabasePage() {
  return (
    <div className="dashboard-root">
      <AnimatedBackground />
      <div className="shell">
        <nav className="dash-nav">
          <Link href="/" className="dash-logo">
            <div className="dash-logo-icon">
              <svg viewBox="0 0 28 28" fill="none">
                <polygon points="14,2 26,9 26,19 14,26 2,19 2,9" stroke="url(#lg1)" strokeWidth="1.5" fill="rgba(99,102,241,0.1)"/>
                <polygon points="14,8 20,11.5 20,18.5 14,22 8,18.5 8,11.5" stroke="url(#lg1)" strokeWidth="1" fill="rgba(139,92,246,0.15)"/>
                <circle cx="14" cy="14" r="3" fill="url(#lg1)"/>
                <defs><linearGradient id="lg1" x1="0" y1="0" x2="28" y2="28"><stop offset="0%" stopColor="#818cf8"/><stop offset="100%" stopColor="#c084fc"/></linearGradient></defs>
              </svg>
            </div>
            <span>BetaFold</span>
          </Link>
          <div className="nav-center">
            <Link href="/dashboard" className="nav-link" style={{ textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/analyses" className="nav-link" style={{ textDecoration: 'none' }}>Analyses</Link>
            <Link href="/database" className="nav-link active" style={{ textDecoration: 'none' }}>Database</Link>
            <Link href="/mutations" className="nav-link" style={{ textDecoration: 'none' }}>Mutations</Link>
            <Link href="/docs" className="nav-link" style={{ textDecoration: 'none' }}>Docs</Link>
          </div>
          <div className="nav-right">
            <div className="search-wrap"><input placeholder="Search PDB IDs..." /></div>
            <div className="avatar">U</div>
          </div>
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
              <Link href="/database" className="s-item active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>PDB Browser</Link>
              <Link href="/blast" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>BLAST Search</Link>
              <Link href="/docs" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Reports Engine</Link>
            </div>
          </div>

          <div className="main-view" style={{ padding: '40px 60px' }}>
            <div className="page-header" style={{ marginBottom: 40 }}>
              <div>
                <div className="greeting-big">Global Protein Database</div>
                <div className="greeting-sub" style={{ marginTop: 8 }}>Browse experimentally determined structures aggregated from the worldwide PDB archive.</div>
              </div>
            </div>

            <div className="card-comp">
              <div className="card-hd"><div className="card-title">PDB Archival Directory</div><span className="badge b-purple pulse-ring">218,304 Entities</span></div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {[
                  { id: '1TIM', desc: 'Triosephosphate isomerase', org: 'Gallus gallus' },
                  { id: '1UBQ', desc: 'Ubiquitin', org: 'Homo sapiens' },
                  { id: '2H26', desc: 'Green Fluorescent Protein', org: 'Aequorea victoria' },
                  { id: '3CL1', desc: 'Main Protease (Mpro)', org: 'SARS-CoV-2' },
                  { id: '4MDH', desc: 'Malate Dehydrogenase', org: 'Escherichia coli' },
                  { id: '7DF4', desc: 'Spike Glycoprotein', org: 'SARS-CoV-2' },
                ].map((pdb, i) => (
                  <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: 16, background: 'rgba(255,255,255,0.02)', transition: 'all .2s', cursor: 'pointer' }} className="job-row">
                    <div style={{ fontSize: 18, fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#818cf8', marginBottom: 8 }}>{pdb.id}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4, height: 38}}>{pdb.desc}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted2)' }}>{pdb.org}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
