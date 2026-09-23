import { SectionTitle } from "../components/SectionTitle";
import { PageNavigation } from "../components/PageNavigation";

export function About() {
  return (
    <section className="section page narrow">
      <PageNavigation
        backTo="/"
        backLabel="Accueil"
        nextTo="/services"
        nextLabel="Nos services"
      />

      <SectionTitle
        eyebrow="À propos"
        title="BEN GLOBAL SERVICE"
        text="Une identité construite autour d'une expérience automobile premium, claire et professionnelle."
      />

      <div className="prose">
        <p>
          Cette page constitue la base éditoriale du nouveau site.
          Nous pourrons y intégrer l'histoire, les valeurs, l'équipe,
          l'implantation et les engagements de l'entreprise.
        </p>

        <p>
          Le design reprend l'esprit premium du projet précédent
          tout en laissant la nouvelle marque prendre sa propre identité.
        </p>
      </div>
    </section>
  );
}