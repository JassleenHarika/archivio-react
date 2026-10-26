function MediaCard({ title, category, description, image }) {
  return (
    <article className="media-card">
      {image && (
        <img
          src={image}
          alt={title}
          className="media-card-image"
        />
      )}

      <p className="media-category">{category}</p>

      <h2>{title}</h2>

      <p>{description}</p>
    </article>
  )
}

export default MediaCard