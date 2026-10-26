import DiscoverNavbar from '../components/DiscoverNavbar'
import MediaCard from '../components/MediaCard'
import '../App.css'
import '../styles/Discover.css'
import interstellarImage from '../assets/interstellar.jpeg'
import secretHistoryImage from '../assets/secret-history.jpeg'
import eminemShowImage from '../assets/eminem-show.jpeg'

function Discover() {
  const mediaItems = [
    {
      id: 1,
      title: 'Interstellar',
      category: 'FILM · SCIENCE FICTION',
      description: 'Some journeys stay with you long after they end.',
      image: interstellarImage,
    },
    {
      id: 2,
      title: 'The Secret History',
      category: 'BOOK · LITERARY FICTION',
      description: 'A story that makes the familiar feel mysterious.',
      image: secretHistoryImage,
    },
    {
      id: 3,
      title: 'The Eminem Show',
      category: 'MUSIC · HIP-HOP',
      description: 'An album with a world and a voice of its own.',
      image: eminemShowImage,
    },
  ]

  return (
    <main className="archivio">
      <DiscoverNavbar />

      <section className="hero-section" id="about">
        <p className="eyebrow">A HOME FOR EVERYTHING YOU LOVE</p>

        <h1>
          Every favourite
          <br />
          has a <em>place.</em>
        </h1>

        <p className="hero-description">
          Movies that stayed with you. Books that changed you.
          Songs that understand you. Keep them all here.
        </p>

        <button
          className="primary-button"
          type="button"
          onClick={() => (window.location.href = '/signup')}
        >
          BUILD YOUR ARCHIVE ↗
        </button>

        <div className="hero-footer">
          <span>YOUR TASTE. YOUR STORY.</span>
        </div>
      </section>

      <section className="media-showcase" id="collection">
        <p className="eyebrow">MORE THAN A WATCHLIST</p>


        <p className="collection-description">
          Build a personal archive of the things that make you,
          you. Discover your next obsession and find people
          who love what you love.
        </p>

        <p className="eyebrow">A FEW THINGS WORTH KEEPING</p>

        <div className="media-grid">
          {mediaItems.map((item) => (
            <MediaCard
              key={item.id}
              title={item.title}
              category={item.category}
              description={item.description}
              image={item.image}
            />
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand" href="#about">
          ARCHIVIO<span>.</span>
        </a>

        <p>Every favourite has a place.</p>

        <span>© ARCHIVIO</span>
      </footer>
    </main>
  )
}

export default Discover