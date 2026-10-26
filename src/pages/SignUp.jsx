import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Auth.css'

function SignUp() {
  const { login } = useAuth()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')

  function handleChange(event) {
    const { name, value, checked, type } = event.target

    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handlePhoneChange(event) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 10)

    setForm((previousForm) => ({
      ...previousForm,
      phone: digits,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setMessageType('error')

    const requiredFields = [
      form.firstName,
      form.lastName,
      form.username,
      form.email,
      form.phone,
      form.password,
      form.confirmPassword,
    ]

    if (requiredFields.some((value) => !value.trim())) {
      setMessage('Please complete every required field.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setMessage('Please enter a valid email address.')
      return
    }

    if (!/^\d{10}$/.test(form.phone)) {
      setMessage('Enter a valid 10-digit Indian phone number.')
      return
    }

    if (form.password.length < 8) {
      setMessage('Your password must contain at least 8 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setMessage('Your passwords do not match.')
      return
    }

    if (!form.acceptedTerms) {
      setMessage('Please accept the Terms of Service and Privacy Policy.')
      return
    }

    try {
      const savedUsers = JSON.parse(
        localStorage.getItem('archivioUsers') || '[]'
      )

      if (!Array.isArray(savedUsers)) {
        setMessage(
          'Unable to read saved accounts. Please check your browser storage.'
        )
        return
      }

      const username = form.username.trim()
      const email = form.email.trim().toLowerCase()

      const usernameExists = savedUsers.some(
        (user) => user.username?.toLowerCase() === username.toLowerCase()
      )

      const emailExists = savedUsers.some(
        (user) => user.email?.toLowerCase() === email
      )

      const phoneExists = savedUsers.some(
        (user) => user.phone === form.phone
      )

      if (usernameExists || emailExists || phoneExists) {
        setMessage(
          'Username, email, or phone number is already registered.'
        )
        return
      }

      const newUser = {
        id: Date.now(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username,
        email,
        phone: form.phone,
        password: form.password,
      }

      localStorage.setItem(
        'archivioUsers',
        JSON.stringify([...savedUsers, newUser])
      )

      // Sign in the newly registered user through Context API.
      const userData = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
      }

      login(userData)

      setMessageType('success')
      setMessage('Your Archivio demo account has been created!')

      setForm({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        acceptedTerms: false,
      })
    } catch {
      setMessage('Could not save your account in this browser.')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link to="/" className="auth-brand">
          ARCHIVIO<span>.</span>
        </Link>

        <p className="auth-eyebrow">YOUR TASTE. YOUR STORY.</p>

        <h1>Create your archive.</h1>

        <p className="auth-description">
          Make a home for everything you love.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-name-row">
            <div className="auth-field">
              <label htmlFor="firstName">First name *</label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                autoComplete="given-name"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="lastName">Last name *</label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                autoComplete="family-name"
                required
              />
            </div>
          </div>

          <label htmlFor="username">Username *</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            autoComplete="username"
            placeholder="Choose a username"
            required
          />

          <label htmlFor="email">Email address *</label>
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

          <label htmlFor="phone">Phone number *</label>

          <div className="auth-phone-row">
            <span className="auth-country-code">+91</span>

            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={handlePhoneChange}
              autoComplete="tel-national"
              placeholder="10-digit mobile number"
              maxLength={10}
              pattern="[0-9]{10}"
              title="Enter a 10-digit Indian mobile number"
              required
            />
          </div>

          <label htmlFor="password">Password *</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />

          <label htmlFor="confirmPassword">Confirm password *</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Enter password again"
            required
          />

          <label className="auth-terms">
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
              required
            />

            <span>
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>

          {message && (
            <p
              className={`auth-message ${
                messageType === 'success' ? 'success' : ''
              }`}
              role="status"
            >
              {message}
            </p>
          )}

          <button type="submit" className="auth-submit">
            CREATE ACCOUNT ↗
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  )
}

export default SignUp