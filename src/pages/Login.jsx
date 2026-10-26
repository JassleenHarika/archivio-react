import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    if (!form.email.trim() || !form.password) {
      setMessage('Please enter your email and password.')
      return
    }

    try {
      const savedUsers = JSON.parse(
        localStorage.getItem('archivioUsers') || '[]'
      )

      const savedUser = savedUsers.find(
        (user) =>
          user.email.toLowerCase() === form.email.trim().toLowerCase() &&
          user.password === form.password
      )

      if (!savedUser) {
        setMessage('Invalid email or password.')
        return
      }

      const userData = {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        username: savedUser.username,
        email: savedUser.email,
      }

      login(userData)

      navigate('/home')
    } catch {
      setMessage('Could not read your saved account. Please try again.')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link to="/" className="auth-brand">
          ARCHIVIO<span>.</span>
        </Link>

        <p className="auth-eyebrow">WELCOME BACK</p>

        <h1>Return to your archive.</h1>

        <p className="auth-description">
          Sign in and pick up where your story left off.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />

          <label htmlFor="password">Password</label>

          <div className="auth-password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />

            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {showPassword ? (
                  <>
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                ) : (
                  <>
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="m3 3 18 18" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {message && (
            <p className="auth-message" role="alert">
              {message}
            </p>
          )}

          <button type="submit" className="auth-submit">
            SIGN IN ↗
          </button>
        </form>

        <p className="auth-switch">
          New to Archivio? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </main>
  )
}

export default Login