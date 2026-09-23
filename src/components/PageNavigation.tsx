import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type PageNavigationProps = {
  backTo?: string;
  backLabel?: string;
  nextTo?: string;
  nextLabel?: string;
};

export function PageNavigation({
  backTo = "/",
  backLabel = "Retour à l'accueil",
  nextTo,
  nextLabel,
}: PageNavigationProps) {
  const navigate = useNavigate();

  return (
    <div className="page-navigation">
      <button
        type="button"
        className="page-back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} />
        Retour
      </button>

      <Link to={backTo} className="page-home-link">
        {backLabel}
      </Link>

      {nextTo && nextLabel && (
        <Link to={nextTo} className="page-next">
          {nextLabel}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}