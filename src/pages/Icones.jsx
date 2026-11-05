const icons = [
  'bi-house-door',
  'bi-heart-fill',
  'bi-star-fill',
  'bi-lightning-charge-fill',
  'bi-gear',
  'bi-search',
  'bi-bell',
  'bi-chat-dots',
  'bi-cloud-arrow-up',
  'bi-code-slash',
  'bi-palette',
  'bi-rocket-takeoff',
]

export default function Icones() {
  return (
    <section className="page">
      <h1>Icônes</h1>
      <p className="lead">
        Quelques exemples de Bootstrap Icons. Utilisation : <code>{'<i className="bi bi-star-fill"></i>'}</code>
      </p>

      <div className="icon-grid">
        {icons.map((name) => (
          <div className="icon-card" key={name}>
            <i className={`bi ${name}`}></i>
            <span>{name.replace('bi-', '')}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
