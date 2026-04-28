import { useEffect, useRef, useState } from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Heart,
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const quickLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Plan Journey', id: 'planner' },
    { label: 'Destinations', id: 'destinations' },
    { label: 'How We Work', id: 'how-we-work' },
    { label: 'About Us', id: 'why-us' },
  ];

  const socials = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
  ];

  return (
    <footer ref={footerRef} className="ft-section">
      {/* Decorative top wave */}
      <div className="ft-wave">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path
            d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0Z"
            fill="var(--jk-dark)"
          />
        </svg>
      </div>

      {/* Background decorations */}
      <div className="ft-bg-grid" />
      <div className="ft-bg-orb ft-bg-orb-1" />
      <div className="ft-bg-orb ft-bg-orb-2" />

      <div className="ft-container">
        {/* Main grid */}
        <div className="ft-grid">
          {/* Brand column */}
          <div className={`ft-brand-col ${visible ? 'ft-anim-in' : ''}`}>
            <div className="ft-brand">
              <img src="/11.png" alt="JourneyKraft" className="ft-brand-logo" />
            </div>
            <p className="ft-brand-desc">
              Crafting unforgettable journeys through the Pearl of the Indian Ocean.
              Experience Sri Lanka like never before with AI-powered travel planning.
            </p>

            {/* Social links */}
            <div className="ft-socials">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className="ft-social-btn"
                    aria-label={s.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div className={`ft-col ${visible ? 'ft-anim-in' : ''}`} style={{ animationDelay: '0.1s' }}>
            <h4 className="ft-col-title">Explore</h4>
            <ul className="ft-link-list">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button className="ft-link" onClick={() => scrollTo(link.id)}>
                    <span className="ft-link-arrow">→</span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className={`ft-col ${visible ? 'ft-anim-in' : ''}`} style={{ animationDelay: '0.2s' }}>
            <h4 className="ft-col-title">Get in Touch</h4>
            <ul className="ft-contact-list">
              <li className="ft-contact-item">
                <span className="ft-contact-icon">
                  <Phone className="w-4 h-4" />
                </span>
                <span>+94 77 8987 615</span>
              </li>
              <li className="ft-contact-item">
                <span className="ft-contact-icon">
                  <Mail className="w-4 h-4" />
                </span>
                <span>hello@journeykraft.com</span>
              </li>
              <li className="ft-contact-item">
                <span className="ft-contact-icon">
                  <MapPin className="w-4 h-4" />
                </span>
                <span>Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="ft-divider" />

        {/* Bottom bar */}
        <div className={`ft-bottom ${visible ? 'ft-anim-in' : ''}`} style={{ animationDelay: '0.3s' }}>
          <p className="ft-copyright">
            © {currentYear} JourneyKraft. All rights reserved. Crafted with{' '}
            <Heart className="w-3.5 h-3.5 inline-block" style={{ color: '#ff6b6b', fill: '#ff6b6b' }} />{' '}
            in Sri Lanka
          </p>
          <button className="ft-top-btn" onClick={scrollToTop} aria-label="Back to top">
            <ArrowUp className="w-4 h-4" />
            <span>Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}