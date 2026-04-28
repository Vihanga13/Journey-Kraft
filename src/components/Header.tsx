import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Plan Journey', id: 'planner' },
    { label: 'Destinations', id: 'destinations' },
    { label: 'About', id: 'why-us' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className={`nav-wrap ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        {/* Brand */}
        <button className="nav-brand" onClick={() => scrollToSection('hero')}>
          <img src="/13.png" alt="JourneyKraft" className="nav-brand-logo" />
        </button>

        {/* Desktop Links */}
        <nav className="nav-links">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="nav-link"
            >
              <span>{link.label}</span>
              <span className="nav-link-bar" />
            </button>
          ))}
        </nav>

        {/* CTA */}
        <button
          className="nav-cta"
          onClick={() => scrollToSection('planner')}
        >
          Plan Your Trip
        </button>

        {/* Mobile toggle */}
        <button
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile ${isMenuOpen ? 'nav-mobile-open' : ''}`}>
        {navLinks.map((link, i) => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className="nav-mobile-link"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            {link.label}
          </button>
        ))}
        <button
          className="nav-mobile-cta"
          onClick={() => scrollToSection('planner')}
        >
          Plan Your Trip
        </button>
      </div>
    </header>
  );
}