import { Link } from 'react-router-dom'
import '../styles/NotFound.css'

function NotFound() {
  return (
    <main className="not-found-page">
      <p className="not-found-label">ARCHIVIO.</p>

      <h1>404</h1>

      <h2>This page has wandered off.</h2>

      <p className="not-found-description">
        The story you're looking for doesn't exist here.
      </p>

      <Link to="/" className="not-found-button">
        RETURN TO DISCOVER ↗
      </Link>
    </main>
  )
}

export default NotFound