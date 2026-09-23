import { PageNavigation } from "../components/PageNavigation";
import {
  CarFront,
  CircleDollarSign,
  SearchCheck,
  FileCheck2,
} from "lucide-react";
import { SectionTitle } from "../components/SectionTitle";

const services = [
  [
    CarFront,
    "Vente de véhicules",
    "Une sélection présentée avec les informations nécessaires.",
  ],
  [
    CircleDollarSign,
    "Accompagnement à la vente",
    "Un accompagnement autour de la présentation de votre véhicule.",
  ],
  [
    SearchCheck,
    "Recherche personnalisée",
    "Présentez-nous votre cahier des charges automobile.",
  ],
  [
    FileCheck2,
    "Conseil automobile",
    "Un accompagnement pour mieux comprendre votre projet.",
  ],
];

export function Services() {
  return (
    <section className="section page">
      <PageNavigation
        backTo="/"
        backLabel="Accueil"
        nextTo="/contact"
        nextLabel="Nous contacter"
      />

      <SectionTitle
        eyebrow="Notre savoir-faire"
        title="Des services autour de votre projet automobile"
        text="Une base à enrichir selon les activités réelles de BEN GLOBAL SERVICE."
      />

      <div className="services-grid">
        {services.map(([Icon, title, text]) => {
          const I = Icon as any;

          return (
            <article
              className="service-card"
              key={title as string}
            >
              <I />
              <h3>{title as string}</h3>
              <p>{text as string}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}