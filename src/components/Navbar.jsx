import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleSignOut() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-logo">
        ARCHIVIO<span>.</span>
      </Link>

      <div className="navbar-links">
        <Link to="/home">HOME</Link>

        <button
          type="button"
          className="navbar-signout"
          onClick={handleSignOut}
        >
          SIGN OUT ↗
        </button>
      </div>
    </nav>
  )
}

export default Navbar