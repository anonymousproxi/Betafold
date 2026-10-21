'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/utils/api'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    if (!name || !email || !password) { toast.error('Fill in all fields'); return }
    if (password.length < 6) { toast.error('Password must be 6+ characters'); return }
    setLoading(true)
    try {
      await api.post('/auth/signup', { name, email, password })
      toast.success('Account created! Please log in.')
      router.push('/login')
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Signup failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🧬</div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Create account</h1>
          <p style={{ color: 'var(--muted)', marginTop: 6 }}>Join BetaFold for free</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
            style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', fontSize: 15, outline: 'none' }} />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address"
            style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', fontSize: 15, outline: 'none' }} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password (6+ chars)"
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
            style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text)', fontSize: 15, outline: 'none' }} />
          <button className="btn-primary" onClick={handleSignup} disabled={loading} style={{ fontSize: 16, padding: '13px', marginTop: 4 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--muted)' }}>
          Have an account? <Link href="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}