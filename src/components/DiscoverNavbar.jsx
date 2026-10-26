import { Link } from 'react-router-dom'


function DiscoverNavbar() {
  return (
    <nav className="discover-navbar">
      <Link to="/" className="discover-brand">
        ARCHIVIO<span>.</span>
      </Link>

      <div className="discover-actions">
        <a href="#collection">EXPLORE</a>
        <Link to="/login" className="discover-signin">
          SIGN IN ↗
        </Link>
      </div>
    </nav>
  )
}

export default DiscoverNavbar