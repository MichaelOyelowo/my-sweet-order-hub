// src/components/AuthModal.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

// --- Professional SVG Icons ---
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
)

export default function AuthModal({ open, mode = 'login', onClose }) {
  const { signUpEmail, signInEmail, signInGoogle } = useAuth()
  const [tab, setTab] = useState(mode)
  
  // Form States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('') // New state
  const[fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  
  // UI States
  const [showPassword, setShowPassword] = useState(false) // New state
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')

  // Reset fields when modal opens or changes mode
  useEffect(() => { 
    setTab(mode)
    setErr('')
    setInfo('')
    setPassword('')
    setConfirmPassword('')
  }, [mode, open])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setInfo(''); setLoading(true)
    
    try {
      if (tab === 'signup') {
        // --- Added Confirm Password Check ---
        if (password !== confirmPassword) {
          setErr('Passwords do not match')
          setLoading(false)
          return
        }

        const cleanPhone = phone.replace(/\s+/g, ''); 
        
        if (cleanPhone.length !== 11 || !cleanPhone.startsWith('0')) {
          setErr('Please enter a valid 11-digit phone number (e.g. 09029702549)')
          setLoading(false)
          return
        }

        const { error } = await signUpEmail({ email, password, full_name: fullName, phone: cleanPhone })
        if (error) throw error
        setInfo('Account created! You can now log in.')
        setTab('login')
        setPassword('')
        setConfirmPassword('')
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

        {/* --- Updated Google Button --- */}
        <button className="auth-google" onClick={google} disabled={loading}>
          <GoogleIcon /> Continue with Google
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

          {/* --- Updated Password Field with Eye Toggle --- */}
          <div className="auth-password-wrap">
            <input
              type={showPassword ? "text" : "password"} 
              placeholder="Password (min 6 chars)" required minLength={6}
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button" 
              className="auth-eye-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          {/* --- Added Confirm Password Field --- */}
          {tab === 'signup' && (
            <div className="auth-password-wrap">
              <input
                type={showPassword ? "text" : "password"} 
                placeholder="Confirm Password" required minLength={6}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

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
            <>New to Jovlora? <button onClick={() => setTab('signup')}>Sign up</button></>
          )}
        </div>
      </div>
    </div>
  )
}