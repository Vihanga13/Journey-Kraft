import { useEffect, useRef, useState } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    initials: 'SJ',
    location: 'United States 🇺🇸',
    rating: 5,
    text: 'JourneyKraft made our Sri Lankan honeymoon absolutely magical. The AI planner created a perfect itinerary that balanced adventure and relaxation. Every detail was flawlessly executed!',
    date: 'January 2026',
    accent: '#01A98F',
    delay: 0,
  },
  {
    name: 'David Chen',
    initials: 'DC',
    location: 'Singapore 🇸🇬',
    rating: 5,
    text: "Best travel agency I've worked with! The personalized service and local expertise made all the difference. Our family had an unforgettable experience exploring Sri Lanka.",
    date: 'December 2025',
    accent: '#0bbf9e',
    delay: 0.12,
  },
  {
    name: 'Emma Williams',
    initials: 'EW',
    location: 'United Kingdom 🇬🇧',
    rating: 5,
    text: "The cultural tour exceeded all expectations. Our guide was knowledgeable and passionate, and the AI-planned route ensured we didn't miss any hidden gems. Highly recommended!",
    date: 'November 2025',
    accent: '#00d4aa',
    delay: 0.24,
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = -((e.clientY - rect.top) / rect.height - 0.5) * 10;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px) scale(1.02)`;
    setHovered(idx);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
    setHovered(null);
  };

  return (
    <section className="tst-section" ref={sectionRef}>
      <div className="tst-blob tst-blob-1" />
      <div className="tst-blob tst-blob-2" />
      <div className="tst-bg-grid" />

      <div className="tst-container">
        {/* Header */}
        <div className={`tst-header ${visible ? 'tst-anim-in' : ''}`}>
          <span className="tst-badge">Testimonials</span>
          <h2 className="tst-title">
            Voices of <span className="tst-title-accent">Happy Travelers</span>
          </h2>
          <p className="tst-subtitle">
            Real stories from explorers who trusted JourneyKraft with their Sri Lankan adventure
          </p>
        </div>

        {/* Cards */}
        <div className="tst-grid">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`tst-card ${visible ? 'tst-anim-in' : ''}`}
              style={{ animationDelay: `${0.2 + t.delay}s` }}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Glow */}
              <div
                className="tst-card-glow"
                style={{
                  background: `radial-gradient(ellipse at top left, ${t.accent}22, transparent 65%)`,
                  opacity: hovered === i ? 1 : 0,
                }}
              />

              {/* Quote icon */}
              <div className="tst-quote-icon">
                <Quote style={{ color: t.accent, opacity: 0.22, width: 36, height: 36 }} />
              </div>

              {/* Stars */}
              <div className="tst-stars">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star
                    key={s}
                    className="tst-star"
                    style={{
                      color: t.accent,
                      filter: `drop-shadow(0 0 4px ${t.accent}88)`,
                    }}
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="tst-text">&ldquo;{t.text}&rdquo;</p>

              {/* Divider */}
              <div
                className="tst-divider"
                style={{ background: `linear-gradient(90deg, ${t.accent}44, transparent)` }}
              />

              {/* Author */}
              <div className="tst-author">
                <div
                  className="tst-avatar"
                  style={{
                    background: `linear-gradient(135deg, ${t.accent}, color-mix(in srgb, ${t.accent} 55%, #00d4aa))`,
                  }}
                >
                  {t.initials}
                </div>
                <div className="tst-author-info">
                  <p className="tst-author-name">{t.name}</p>
                  <p className="tst-author-loc">{t.location}</p>
                </div>
                <span className="tst-date">{t.date}</span>
              </div>

              {/* Bottom accent bar */}
              <div
                className="tst-bar"
                style={{ background: `linear-gradient(90deg, ${t.accent}, ${t.accent}33)` }}
              />
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div
          className={`tst-trust ${visible ? 'tst-anim-in' : ''}`}
          style={{ animationDelay: '0.6s' }}
        >
          {['500+ Journeys Crafted', '4.9 ★ Average Rating', '10 000+ Happy Travelers', '100% Tailored Plans'].map((s, i) => (
            <div key={i} className="tst-trust-item">
              <span className="tst-trust-dot" />
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}