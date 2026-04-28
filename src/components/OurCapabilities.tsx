import { useEffect, useRef, useState } from 'react';
import { Layers, SlidersHorizontal, Gem, PenTool, ChevronRight } from 'lucide-react';

const capabilities = [
  {
    number: '01',
    icon: Layers,
    title: 'Experience Architecture & Local Access',
    gradient: 'linear-gradient(135deg, #01A98F, #00d4aa)',
    image: '/JK Images/IMG_1414.jpg',
    bullets: [
      'Translate what guests want to feel into a structured set of signature, experience-first journeys.',
      'Use deep local relationships to unlock rare encounters and private moments beyond the usual public attractions.',
      'Build routes, timings, and logistics around those signature experiences to deliver a seamless, exclusive itinerary.',
    ],
  },
  {
    number: '02',
    icon: SlidersHorizontal,
    title: 'Personalization Engine',
    gradient: 'linear-gradient(135deg, #0bbf9e, #55ffd8)',
    image: '/JK Images/IMG_2314.jpg',
    bullets: [
      'Ability to tailor fast and accurately by age, pace, comfort, budget, and purpose.',
      'Strong intake method (vibe profiling) + modular itinerary building.',
      'Using AI to access the best excursions.',
    ],
  },
  {
    number: '03',
    icon: Gem,
    title: 'Signature Excursions Library',
    gradient: 'linear-gradient(135deg, #01A98F, #0bbf9e)',
    image: '/JK Images/IMG_2315.jpg',
    bullets: [
      'A curated portfolio of "only-with-us" experiences (exclusive or rare access).',
      'Clear experience names, inclusions, durations, best seasons, and upgrade options.',
    ],
  },
  {
    number: '04',
    icon: PenTool,
    title: 'Storytelling & Content Packaging',
    gradient: 'linear-gradient(135deg, #00d4aa, #01A98F)',
    image: '/JK Images/IMG_5772.jpg',
    bullets: [
      'Turn itineraries into "sellable stories" with experience-led copy.',
      'Strong destination narrative + seasonal themes + special interest angles.',
    ],
  },
];

export function OurCapabilities() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="our-capabilities" ref={sectionRef} className="cap-section">
      {/* Decorative */}
      <div className="cap-bg-image" />
      <div className="cap-bg-orb cap-bg-orb-1" />
      <div className="cap-bg-orb cap-bg-orb-2" />
      <div className="cap-bg-grid" />

      <div className="cap-container">
        {/* ── Header ── */}
        <div className="cap-header">
          <span className={`cap-badge ${visible ? 'cap-anim-in' : ''}`}>
            What We Bring
          </span>
          <h2 className={`cap-title ${visible ? 'cap-anim-in' : ''}`} style={{ animationDelay: '0.08s' }}>
            Four pillars that power
            <span className="cap-title-accent"> every journey</span>
          </h2>
          <p className={`cap-subtitle ${visible ? 'cap-anim-in' : ''}`} style={{ animationDelay: '0.16s' }}>
            The engine behind unforgettable Sri Lankan travel experiences
          </p>
        </div>

        {/* ── Cards Grid ── */}
        <div className="cap-grid">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon;
            const isOpen = expanded === i;
            return (
              <div
                key={cap.number}
                className={`cap-card ${isOpen ? 'cap-card-open' : ''} ${visible ? 'cap-anim-in' : ''}`}
                style={{ animationDelay: `${0.22 + i * 0.12}s` }}
                onClick={() => setExpanded(isOpen ? null : i)}
              >
                {/* Image */}
                {cap.image && (
                  <div className="cap-card-image">
                    <img src={cap.image} alt={cap.title} />
                  </div>
                )}

                {/* Glow */}
                <div
                  className="cap-card-glow"
                  style={{ background: cap.gradient, opacity: isOpen ? 0.1 : 0 }}
                />

                {/* Watermark */}
                <span className="cap-card-watermark">{cap.number}</span>

                {/* Top row: icon + title */}
                <div className="cap-card-top">
                  <div className="cap-card-icon" style={{ background: cap.gradient }}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="cap-card-title">{cap.title}</h3>
                  <div className={`cap-card-toggle ${isOpen ? 'cap-toggle-open' : ''}`}>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Gradient accent bar */}
                <div className="cap-card-bar" style={{ background: cap.gradient }} />

                {/* Bullet list */}
                <ul className={`cap-card-list ${isOpen ? 'cap-list-open' : ''}`}>
                  {cap.bullets.map((b, bi) => (
                    <li key={bi} className="cap-bullet">
                      <span className="cap-bullet-dot" style={{ background: cap.gradient }} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}