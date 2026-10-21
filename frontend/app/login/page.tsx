'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/utils/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Fill in all fields'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🧬</div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Welcome back</h1>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>Sign in to BetaFold</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address"
            style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', fontSize: 15, outline: 'none' }} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', fontSize: 15, outline: 'none' }} />
          <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ fontSize: 16, padding: '13px', marginTop: 4 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--muted)' }}>
          No account? <Link href="/signup" style={{ color: 'var(--accent)' }}>Sign up free</Link>
        </p>
      </div>
    </div>
  )
}