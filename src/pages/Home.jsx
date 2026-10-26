import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/Home.css'
import { useDispatch } from 'react-redux'
import { addToArchive as addToArchiveAction } from '../features/archive/archiveSlice'
import interstellarImage from '../assets/interstellar.jpeg'
import duneImage from '../assets/dune-part-two.jpeg'
import secretHistoryImage from '../assets/secret-history.jpeg'
import eminemShowImage from '../assets/eminem-show.jpeg'
import pridePrejudiceImage from '../assets/pride-prejudice.jpeg'
import inceptionImage from '../assets/inception.jpeg'
import randomAccessMemoriesImage from '../assets/random-access-memories.jpeg'
import greatGatsbyImage from '../assets/great-gatsby.jpeg'

const mediaItems = [
  {
    id: 1,
    title: 'Interstellar',
    category: 'FILMS',
    year: 2014,
    genre: 'Sci-Fi, Drama',
    creator: 'Christopher Nolan',
    description:
      'A team of explorers travels beyond this galaxy to discover whether mankind has a future among the stars.',
    image: interstellarImage,
  },
  {
    id: 2,
    title: 'Dune: Part Two',
    category: 'FILMS',
    year: 2024,
    genre: 'Sci-Fi, Adventure',
    creator: 'Denis Villeneuve',
    description:
      'Paul Atreides joins Chani and the Fremen while seeking a path toward the future of Arrakis.',
    image: duneImage,
  },
  {
    id: 3,
    title: 'The Secret History',
    category: 'BOOKS',
    year: 1992,
    genre: 'Literary Fiction, Mystery',
    creator: 'Donna Tartt',
    description:
      'A group of classics students at an elite college find their lives transformed by beauty, obsession and secrets.',
    image: secretHistoryImage,
  },
  {
    id: 4,
    title: 'The Eminem Show',
    category: 'MUSIC',
    year: 2002,
    genre: 'Hip-Hop, Rap',
    creator: 'Eminem',
    description:
      'A landmark album exploring fame, personal struggles and life in the public eye.',
    image: eminemShowImage,
  },
  {
    id: 5,
    title: 'Pride and Prejudice',
    category: 'BOOKS',
    year: 1813,
    genre: 'Romance, Classic',
    creator: 'Jane Austen',
    description:
      'Elizabeth Bennet navigates family expectations, first impressions and the complicated nature of love.',
    image: pridePrejudiceImage,
  },
  {
    id: 6,
    title: 'Inception',
    category: 'FILMS',
    year: 2010,
    genre: 'Sci-Fi, Thriller',
    creator: 'Christopher Nolan',
    description:
      'A skilled thief enters the dreams of others and attempts a seemingly impossible final job.',
    image: inceptionImage,
  },
  {
    id: 7,
    title: 'Random Access Memories',
    category: 'MUSIC',
    year: 2013,
    genre: 'Electronic, Disco',
    creator: 'Daft Punk',
    description:
      'An electronic music journey celebrating live instrumentation, collaboration and the sound of the past.',
    image: randomAccessMemoriesImage,
  },
  {
    id: 8,
    title: 'The Great Gatsby',
    category: 'BOOKS',
    year: 1925,
    genre: 'Classic, Literary Fiction',
    creator: 'F. Scott Fitzgerald',
    description:
      'A mysterious millionaire, extravagant parties and the elusive American dream collide in the Jazz Age.',
    image: greatGatsbyImage,
  },
]

function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [category, setCategory] = useState('ALL')
  const [genre, setGenre] = useState('ALL')
  const [sortBy, setSortBy] = useState('RECOMMENDED')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [failedImages, setFailedImages] = useState([])

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('archivioCurrentUser')) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const dispatch = useDispatch()

  const filteredMedia = useMemo(() => {
    let results = mediaItems.filter((item) => {
      const matchesSearch = [
        item.title,
        item.category,
        item.genre,
        item.creator,
        String(item.year),
      ]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase().trim())

      const matchesCategory =
        category === 'ALL' || item.category === category

      const matchesGenre =
        genre === 'ALL' ||
        item.genre.toLowerCase().includes(genre.toLowerCase())

      return matchesSearch && matchesCategory && matchesGenre
    })

    if (sortBy === 'NEWEST') {
      results = [...results].sort((a, b) => b.year - a.year)
    } else if (sortBy === 'OLDEST') {
      results = [...results].sort((a, b) => a.year - b.year)
    } else if (sortBy === 'TITLE') {
      results = [...results].sort((a, b) =>
        a.title.localeCompare(b.title)
      )
    }

    return results
  }, [search, category, genre, sortBy])

  function addToArchive(item) {
    if (!user) {
      window.alert('Please sign in to build your archive.')
      return
    }

    try {
      const key = `archivioArchive_${user.id}`
      const savedItems = JSON.parse(localStorage.getItem(key) || '[]')

      if (savedItems.some((savedItem) => savedItem.id === item.id)) {
        window.alert('This item is already in your archive.')
        return
      }

      const archivedItem = {
        ...item,
        archivedAt: new Date().toISOString(),
      }

      localStorage.setItem(
        key,
        JSON.stringify([...savedItems, archivedItem])
      )

      dispatch(addToArchiveAction(archivedItem))

      window.alert(`${item.title} has been added to your archive!`)
    } catch {
      window.alert('Unable to save this item in your browser.')
    }
  }

  function markImageFailed(itemId) {
    setFailedImages((previous) =>
      previous.includes(itemId) ? previous : [...previous, itemId]
    )
  }

  return (
    <main className="home-page">
      <header className="home-navbar">
        <Link to="/home" className="home-brand">
          ARCHIVIO<span>.</span>
        </Link>

        <Link
          to="/profile"
          className="home-user-link"
          aria-label="Open your profile"
        >
          <span className="home-avatar">
            {user
              ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() ||
                user.username?.[0]?.toUpperCase() ||
                'A'
              : 'A'}
          </span>

          {user?.username && (
            <span className="home-username">@{user.username}</span>
          )}
        </Link>
      </header>

      <section className="home-discovery">
        <div className="home-search-row">
          <label className="home-search-box">
            <span aria-hidden="true">⌕</span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search films, books, music, artists..."
              aria-label="Search media"
            />

            {search && (
              <button
                type="button"
                className="home-clear-search"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </label>

          <button
            type="button"
            className={`home-filter-button ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters((previous) => !previous)}
            aria-expanded={showFilters}
          >
            <span aria-hidden="true">☷</span> FILTER
          </button>
        </div>

        {showFilters && (
          <div className="home-filter-panel">
            <label>
              CATEGORY
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="ALL">All media</option>
                <option value="FILMS">Films</option>
                <option value="BOOKS">Books</option>
                <option value="MUSIC">Music</option>
              </select>
            </label>

            <label>
              GENRE
              <select
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
              >
                <option value="ALL">All genres</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Drama">Drama</option>
                <option value="Adventure">Adventure</option>
                <option value="Thriller">Thriller</option>
                <option value="Romance">Romance</option>
                <option value="Mystery">Mystery</option>
                <option value="Classic">Classic</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Electronic">Electronic</option>
              </select>
            </label>

            <label>
              SORT BY
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="RECOMMENDED">Recommended</option>
                <option value="NEWEST">Newest release</option>
                <option value="OLDEST">Oldest release</option>
                <option value="TITLE">Title A–Z</option>
              </select>
            </label>

            <button
              type="button"
              className="home-reset-filters"
              onClick={() => {
                setCategory('ALL')
                setGenre('ALL')
                setSortBy('RECOMMENDED')
                setSearch('')
              }}
            >
              RESET FILTERS
            </button>
          </div>
        )}

        <div className="home-results-info">
          
        </div>

        {isLoading ? (
          <div className="home-no-results" role="status" aria-live="polite">
            <h2>Preparing your archive...</h2>
            <p>Gathering stories worth keeping.</p>
          </div>
        ) : filteredMedia.length > 0 ? (
          <div className="home-media-grid">
            {filteredMedia.map((item, index) => (
              <button
                type="button"
                className={`home-media-card home-media-card-${(index % 3) + 1}`}
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                aria-label={`View details for ${item.title}`}
              >
                {failedImages.includes(item.id) ? (
                  <span className="home-image-fallback">
                    <span>{item.category}</span>
                    <strong>{item.title}</strong>
                    <small>{item.creator}</small>
                  </span>
                ) : (
                  <img
                    src={item.image}
                    alt={`${item.title} cover`}
                    loading="lazy"
                    onError={() => markImageFailed(item.id)}
                  />
                )}

                <span className="home-card-overlay">
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <small>{item.year}</small>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="home-no-results">
            <h2>Nothing found.</h2>
            <p>Try another title or adjust your filters.</p>
          </div>
        )}
      </section>

      {selectedMedia && (
        <div
          className="home-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMedia(null)
            }
          }}
        >
          <section
            className="home-media-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-modal-title"
          >
            <button
              type="button"
              className="home-modal-close"
              onClick={() => setSelectedMedia(null)}
              aria-label="Close details"
            >
              ×
            </button>

            <div className="home-modal-cover">
              {failedImages.includes(selectedMedia.id) ? (
                <div className="home-image-fallback">
                  <span>{selectedMedia.category}</span>
                  <strong>{selectedMedia.title}</strong>
                </div>
              ) : (
                <img
                  src={selectedMedia.image}
                  alt={`${selectedMedia.title} cover`}
                />
              )}
            </div>

            <div className="home-modal-information">
              <span className="home-modal-category">
                {selectedMedia.category}
              </span>

              <h2 id="home-modal-title">{selectedMedia.title}</h2>
              <p className="home-modal-year">{selectedMedia.year}</p>
              <p><strong>Genre:</strong> {selectedMedia.genre}</p>

              <p>
                <strong>
                  {selectedMedia.category === 'FILMS'
                    ? 'Director'
                    : selectedMedia.category === 'BOOKS'
                      ? 'Author'
                      : 'Artist'}
                  :
                </strong>{' '}
                {selectedMedia.creator}
              </p>

              <p className="home-modal-description">
                {selectedMedia.description}
              </p>

              <button
                type="button"
                className="home-add-button"
                onClick={() => addToArchive(selectedMedia)}
              >
                + ADD TO ARCHIVE
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default Home