import hero from '../assets/hero.svg'

export default function Accueil() {
  return (
    <section className="page">
      <h1>Accueil</h1>
      <p className="lead">
        Un point de départ React avec header, navigation latérale et contenu principal.
      </p>

      <figure className="hero-card">
        <img src={hero} alt="Une lune violette lumineuse au-dessus de montagnes" />
      </figure>
    </section>
  )
}
