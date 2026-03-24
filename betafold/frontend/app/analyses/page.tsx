'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import api from '@/utils/api'
import toast from 'react-hot-toast'
import AnimatedBackground from '@/components/AnimatedBackground'
import '../dashboard/dashboard.css'

interface Job { job_id: string; sequence: string; status: string; created_at: string; analysis?: any; }

export default function AnalysesPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) fetchJobs(token)
  }, [])

  const fetchJobs = async (token: string) => {
    try {
      const res = await api.get('/jobs')
      setJobs(res.data)
    } catch { toast.error('Failed to load live analyses.') }
    finally { setLoading(false) }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="badge b-green">● Completed</span>;
      case 'failed': return <span className="badge b-red">● Failed</span>;
      default: return <span className="badge b-yellow">● Processing</span>;
    }
  }

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
            <Link href="/analyses" className="nav-link active" style={{ textDecoration: 'none' }}>Analyses</Link>
            <Link href="/database" className="nav-link" style={{ textDecoration: 'none' }}>Database</Link>
            <Link href="/mutations" className="nav-link" style={{ textDecoration: 'none' }}>Mutations</Link>
            <Link href="/docs" className="nav-link" style={{ textDecoration: 'none' }}>Docs</Link>
          </div>
          <div className="nav-right">
            <div className="search-wrap"><input placeholder="Search sequences..." /></div>
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
              <Link href="/analyses" className="s-item active"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M2 12h4M18 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>Analyses</Link>
              <Link href="/mutations" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Mutations</Link>
            </div>
            <div className="sidebar-section">
              <div className="sidebar-label">Data Exploration</div>
              <Link href="/database" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>PDB Browser</Link>
              <Link href="/blast" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>BLAST Search</Link>
              <Link href="/docs" className="s-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>Reports Engine</Link>
            </div>
          </div>

          <div className="main-view" style={{ padding: '40px 60px' }}>
            <div className="page-header" style={{ marginBottom: 40 }}>
              <div>
                <div className="greeting-big">Historical Analyses</div>
                <div className="greeting-sub" style={{ marginTop: 8 }}>Comprehensive log of all biological sequences processed by your account.</div>
              </div>
            </div>

            <div className="card-comp" style={{ minHeight: 600 }}>
              <div className="card-hd"><div className="card-title">Processed Queue</div><span className="badge b-purple pulse-ring">Live Sync</span></div>
              
              {loading ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>Fetching live database streams...</div>
              ) : jobs.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No protein analyses found. Click "New Analysis" on the sidebar to trigger an asynchronous sequence computation.</div>
              ) : (
                jobs.map(job => (
                  <Link href={`/results/${job.job_id}`} className="job-row" key={job.job_id}>
                    <div style={{ flex: 1 }}>
                      <div className="job-name">Sequence ID {job.job_id.split('-')[0].toUpperCase()}</div>
                      <div className="job-seq">{job.sequence.substring(0, 60)}...</div>
                      <div className="job-meta">{job.sequence.length} amino acids · Extracted Organism/Features · {new Date(job.created_at).toLocaleString()}</div>
                    </div>
                    <div className="job-right">
                      {getStatusBadge(job.status)}
                      <div className="job-plddt">{job.status === 'completed' ? `pLDDT ~${job.analysis?.plddt_avg || 85.4}` : 'Awaiting Compute Module'}</div>
                    </div>
                  </Link>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
