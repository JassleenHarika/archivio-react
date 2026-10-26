import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  removeFromArchive as removeFromArchiveAction,
  setArchive,
} from '../features/archive/archiveSlice'
import '../styles/Profile.css'

function Profile() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('archivioCurrentUser')) || null
    } catch {
      return null
    }
  })

  const [activeCategory, setActiveCategory] = useState('ALL')

  const dispatch = useDispatch()
  const reduxArchive = useSelector((state) => state.archive.items)

  // Load the current user's following list.
  const [following, setFollowing] = useState(() => {
    try {
      const savedUser = JSON.parse(
        localStorage.getItem('archivioCurrentUser')
      )

      if (!savedUser) return []

      return (
        JSON.parse(
          localStorage.getItem(`archivioFollowing_${savedUser.id}`)
        ) || []
      )
    } catch {
      return []
    }
  })

  // Follow or unfollow a suggested person.
  function toggleFollow(personId) {
    if (!user) return

    const updatedFollowing = following.includes(personId)
      ? following.filter((id) => id !== personId)
      : [...following, personId]

    setFollowing(updatedFollowing)

    localStorage.setItem(
      `archivioFollowing_${user.id}`,
      JSON.stringify(updatedFollowing)
    )
  }

  const [bio, setBio] = useState(
    () =>
      localStorage.getItem('archivioBio') ||
      'Collecting stories that stay with me.'
  )

  // Default media shown when the user has no saved archive yet.
  const defaultMediaItems = [
    {
      id: 1,
      title: 'Interstellar',
      category: 'FILMS',
      description: 'Some journeys stay with you long after they end.',
      year: 2014,
      image:
        'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    },
    {
      id: 2,
      title: 'The Secret History',
      category: 'BOOKS',
      description: 'A story that makes the familiar feel mysterious.',
      year: 1992,
      image:
        'https://covers.openlibrary.org/b/isbn/9781400031702-L.jpg',
    },
    {
      id: 3,
      title: 'The Eminem Show',
      category: 'MUSIC',
      description: 'An album with a world and a voice of its own.',
      year: 2002,
      image:
        'https://upload.wikimedia.org/wikipedia/en/3/35/The_Eminem_Show.jpg',
    },
  ]

  // Load the current user's archive from localStorage.
  const [mediaItems, setMediaItems] = useState(() => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem('archivioCurrentUser')
      )

      if (!currentUser) return []

      const savedArchive = localStorage.getItem(
        `archivioArchive_${currentUser.id}`
      )

      if (savedArchive !== null) {
        return JSON.parse(savedArchive)
      }

      return defaultMediaItems
    } catch {
      return defaultMediaItems
    }
  })

  // Synchronize the displayed archive with Redux.
  useEffect(() => {
    dispatch(setArchive(mediaItems))
  }, [dispatch, mediaItems])

  const categories = ['ALL', 'FILMS', 'BOOKS', 'MUSIC']

  const filteredItems =
    activeCategory === 'ALL'
      ? mediaItems
      : mediaItems.filter((item) => item.category === activeCategory)

  // Remove a media item from the archive.
  function removeFromArchive(itemId) {
    const itemToRemove = mediaItems.find((item) => item.id === itemId)

    if (!itemToRemove) return

    const confirmRemove = window.confirm(
      `Remove "${itemToRemove.title}" from your archive?`
    )

    if (!confirmRemove) return

    const updatedItems = mediaItems.filter((item) => item.id !== itemId)

    try {
      localStorage.setItem(
        `archivioArchive_${user.id}`,
        JSON.stringify(updatedItems)
      )

      setMediaItems(updatedItems)
      dispatch(removeFromArchiveAction(itemId))
    } catch {
      window.alert('Unable to update your archive. Please try again.')
    }
  }

  // Edit the username and bio.
  function handleEditProfile() {
    if (!user) return

    const newUsername = window.prompt(
      'Enter your new username:',
      user.username || ''
    )

    if (newUsername === null) return

    const trimmedUsername = newUsername.trim()

    if (!trimmedUsername) {
      window.alert('Username cannot be empty.')
      return
    }

    const newBio = window.prompt('Enter your bio:', bio)

    if (newBio === null) return

    const updatedUser = {
      ...user,
      username: trimmedUsername,
    }

    try {
      localStorage.setItem(
        'archivioCurrentUser',
        JSON.stringify(updatedUser)
      )

      localStorage.setItem('archivioBio', newBio.trim())

      const savedUsers = JSON.parse(
        localStorage.getItem('archivioUsers') || '[]'
      )

      const updatedUsers = savedUsers.map((savedUser) =>
        savedUser.id === user.id
          ? { ...savedUser, username: trimmedUsername }
          : savedUser
      )

      localStorage.setItem('archivioUsers', JSON.stringify(updatedUsers))

      setUser(updatedUser)
      setBio(newBio.trim())

      window.alert('Your profile has been updated!')
    } catch {
      window.alert('Unable to update your profile. Please try again.')
    }
  }

  // Show the sign-in prompt if nobody is logged in.
  if (!user) {
    return (
      <main className="profile-page">
        <section className="profile-empty">
          <p className="profile-eyebrow">YOUR SPACE</p>
          <h1>Your story starts here.</h1>
          <p>Sign in to view your Archivio profile.</p>
          <a href="/login" className="profile-button">
            SIGN IN ↗
          </a>
        </section>
      </main>
    )
  }

  const initials =
    `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`

  // Sample suggestions for the profile page.
  const suggestedPeople = [
    {
      id: 1,
      name: 'Aarav Mehta',
      username: 'aarav.reads',
      initials: 'AM',
      bio: 'Films that stay. Books that change you.',
    },
    {
      id: 2,
      name: 'Mira Kapoor',
      username: 'mira.afterhours',
      initials: 'MK',
      bio: 'A little music, a lot of cinema.',
    },
    {
      id: 3,
      name: 'Rohan Malhotra',
      username: 'rohan.archive',
      initials: 'RM',
      bio: 'Collecting stories, one at a time.',
    },
  ]

  return (
    <main className="profile-page">
      {/* PROFILE HEADER */}
      <section className="profile-header">
        <div className="profile-avatar">
          {initials.toUpperCase() ||
            user.username?.[0]?.toUpperCase() ||
            'A'}
        </div>

        <div className="profile-information">
          <div className="profile-title-row">
            <h1>
              {user.firstName} {user.lastName}
            </h1>

            <button
              type="button"
              className="profile-button"
              onClick={handleEditProfile}
            >
              EDIT PROFILE
            </button>
          </div>

          <p className="profile-username">@{user.username}</p>

          <div className="profile-stats">
            <div>
              <strong>{mediaItems.length}</strong>
              <span>Archive</span>
            </div>

            <div>
              <strong>0</strong>
              <span>Followers</span>
            </div>

            <div>
              <strong>{following.length}</strong>
              <span>Following</span>
            </div>
          </div>

          <p className="profile-bio">{bio}</p>
        </div>
      </section>

      {/* SUGGESTED PEOPLE */}
      <section className="suggested-people">
        <div className="suggested-people-heading">
          <p className="profile-eyebrow">SUGGESTED FOR YOU</p>
        </div>

        <div className="suggested-people-grid">
          {suggestedPeople.map((person) => {
            const isFollowing = following.includes(person.id)

            return (
              <article className="suggested-person-card" key={person.id}>
                <div className="suggested-person-avatar">
                  {person.initials}
                </div>

                <h3>{person.name}</h3>

                <span className="suggested-person-username">
                  @{person.username}
                </span>

                <p>{person.bio}</p>

                <button
                  type="button"
                  className="suggested-follow-button"
                  onClick={() => toggleFollow(person.id)}
                >
                  {isFollowing ? 'FOLLOWING ✓' : 'FOLLOW'}
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {/* MEDIA COLLECTION */}
      <section className="profile-collection">
        <div className="profile-tabs">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? 'active' : ''}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 ? (
          <div className="profile-media-grid">
            {filteredItems.map((item) => (
              <article className="profile-media-card" key={item.id}>
                <img
                  className="profile-media-image"
                  src={item.image}
                  alt={`${item.title} cover`}
                  loading="lazy"
                />

                <span className="profile-media-category">
                  {item.category}
                </span>

                <h2>{item.title}</h2>

                <p className="profile-media-year">{item.year}</p>

                <p>{item.description}</p>

                <button
                  type="button"
                  className="profile-remove-button"
                  onClick={() => removeFromArchive(item.id)}
                >
                  REMOVE FROM ARCHIVE
                </button>
              </article>
            ))}
          </div>
        ) : (
          <p className="profile-no-media">
            Nothing here yet. Your next favourite is waiting to be discovered.
          </p>
        )}
      </section>
    </main>
  )
}

export default Profile