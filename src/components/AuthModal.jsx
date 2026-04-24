// src/components/AuthModal.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function AuthModal({ open, mode = 'login', onClose }) {
  const { signUpEmail, signInEmail, signInGoogle } = useAuth()
  const [tab, setTab] = useState(mode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')

  useEffect(() => { setTab(mode); setErr(''); setInfo('') }, [mode, open])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setInfo(''); setLoading(true)
    try {
      if (tab === 'signup') {
        const { error } = await signUpEmail({ email, password, full_name: fullName, phone })
        if (error) throw error
        setInfo('Account created! You can now log in.')
        setTab('login')
      } else {
        const { error } = await signInEmail({ email, password })
        if (error) throw error
        onClose?.()
      }
    } catch (e) {
      setErr(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const google = async () => {
    setErr(''); setLoading(true)
    const { error } = await signInGoogle()
    if (error) { setErr(error.message); setLoading(false) }
    // OAuth redirects away; no need to setLoading(false) on success
  }

  return (
    <div className="auth-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={onClose} aria-label="Close">×</button>

        <h2 className="auth-title">{tab === 'signup' ? 'Create account' : 'Welcome back'}</h2>
        <p className="auth-sub">
          {tab === 'signup'
            ? 'Sign up to track orders & claim game rewards.'
            : 'Log in to view your orders & rewards.'}
        </p>

        <button className="auth-google" onClick={google} disabled={loading}>
          <span>🔵</span> Continue with Google
        </button>

        <div className="auth-divider"><span>or</span></div>

        <form onSubmit={submit} className="auth-form">
          {tab === 'signup' && (
            <>
              <input
                type="text" placeholder="Full name" required
                value={fullName} onChange={(e) => setFullName(e.target.value)}
              />
              <input
                type="tel" placeholder="Phone (e.g. 0902 970 2549)" required
                value={phone} onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}
          <input
            type="email" placeholder="Email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password" placeholder="Password (min 6 chars)" required minLength={6}
            value={password} onChange={(e) => setPassword(e.target.value)}
          />

          {err && <div className="auth-err">{err}</div>}
          {info && <div className="auth-info">{info}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait…' : tab === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div className="auth-switch">
          {tab === 'signup' ? (
            <>Already have an account? <button onClick={() => setTab('login')}>Log in</button></>
          ) : (
            <>New to SweetHUB? <button onClick={() => setTab('signup')}>Sign up</button></>
          )}
        </div>
      </div>
    </div>
  )
}
