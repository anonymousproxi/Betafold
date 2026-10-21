'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If user is already logged in, skip the splash screen and go directly to main application (Dashboard)
    if (localStorage.getItem('token')) {
      router.push('/dashboard')
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) return null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 20 }}>
      {/* Hero Welcome */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🧬</div>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
          Welcome to <br />
          <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BetaFold Platform
          </span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--muted)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          The next-generation intelligence engine for protein structure prediction, 3D visualization, and automated DSSP processing.
        </p>
      </div>

      {/* Gateway Buttons */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/login"><button className="btn-secondary" style={{ fontSize: 16, padding: '14px 40px' }}>Log In</button></Link>
        <Link href="/signup"><button className="btn-primary" style={{ fontSize: 16, padding: '14px 40px' }}>Get Started</button></Link>
      </div>
    </div>
  )
}
