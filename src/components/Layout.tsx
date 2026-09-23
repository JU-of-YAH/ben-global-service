import { Outlet, Link, NavLink } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";

const nav = [
  ["/", "Accueil"],
  ["/vehicules", "Véhicules"],
  ["/vendre", "Vendre votre véhicule"],
  ["/services", "Services"],
  ["/a-propos", "À propos"],
  ["/contact", "Contact"],
];

export function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="site-shell">
      <header className="header">
        <Link
          to="/"
          className="brand"
          onClick={() => setOpen(false)}
        >
          <span className="brand-mark">BG</span>

          <span>
            <strong>BEN GLOBAL</strong>
            <small>SERVICE</small>
          </span>
        </Link>

        <nav className={`nav ${open ? "nav-open" : ""}`}>
          {nav.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {label}
            </NavLink>
          ))}

          <Link
            className="nav-cta"
            to="/contact"
            onClick={() => setOpen(false)}
          >
            Nous contacter
          </Link>
        </nav>

        <button
          className="menu-btn"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div>
          <div className="footer-brand">
            BEN GLOBAL SERVICE
          </div>

          <p>
            Une approche professionnelle et exigeante de
            l'automobile.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/vehicules">Véhicules</Link>

          <Link to="/vendre">
            Vendre votre véhicule
          </Link>

          <Link to="/services">Services</Link>

          <Link to="/contact">Contact</Link>

          <a href="tel:+2250509496745">
            <Phone size={16} />
            Appeler
          </a>

          <a
            href="https://wa.me/2250509496745"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} BEN GLOBAL SERVICE.
          Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
