'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/utils/api'

export default function Settings() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token) { router.push('/login'); return }
    if (u) setUser(JSON.parse(u))
    setLoading(false)
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await api.get('/jobs')
      const jobs = res.data

      if (!jobs || jobs.length === 0) {
        toast.error('No history to export')
        return
      }

      // Convert to CSV
      const headers = ['Job ID', 'Status', 'Sequence', 'Created At']
      const csvContent = [
        headers.join(','),
        ...jobs.map((j: any) => 
          `${j.job_id},${j.status},${j.sequence},${j.created_at}`
        )
      ].join('\n')

      // Trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', `betafold_history_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('History exported successfully!')
    } catch (e) {
      toast.error('Failed to export history')
    } finally {
      setExporting(false)
    }
  }

  const logout = () => { localStorage.clear(); router.push('/') }

  if (loading) return null

  return (
    <div style={{ minHeight: '100vh' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: 20, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>
          🧬 BetaFold
        </Link>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Link href="/dashboard"><button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>← Dashboard</button></Link>
          <button className="btn-secondary" onClick={logout} style={{ padding: '8px 16px', fontSize: 13, borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '50px 20px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Account Settings</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 40 }}>Manage your BetaFold profile and data</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Profile Section */}
          <div className="glass" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Profile Information</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) 3fr', gap: 16, alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)', fontWeight: 500 }}>Full Name</span>
              <input 
                type="text" 
                defaultValue={user?.name || ''} 
                disabled
                style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--muted)', fontSize: 15, outline: 'none' }} 
              />
              
              <span style={{ color: 'var(--muted)', fontWeight: 500 }}>Email Address</span>
              <input 
                type="email" 
                defaultValue={user?.email || ''}
                disabled
                style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--muted)', fontSize: 15, outline: 'none' }} 
              />
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 16 }}>Profile editing is restricted in the current Beta release.</p>
          </div>

          {/* Data Management Section */}
          <div className="glass" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>Data Export</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ fontWeight: 600, marginBottom: 4 }}>Job History</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14 }}>Download a CSV file containing all your previously submitted sequences and their metadata.</p>
              </div>
              <button 
                className="btn-primary" 
                onClick={handleExport} 
                disabled={exporting}
                style={{ padding: '10px 20px', fontSize: 14, whiteSpace: 'nowrap' }}
              >
                {exporting ? 'Exporting...' : '📥 Download CSV'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
