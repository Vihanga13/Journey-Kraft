import { useEffect, useRef, useState } from 'react';
import { Palmtree, Mountain, Building, Waves, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Palmtree,
    title: 'Destination Planning',
    description: 'Curated itineraries for every region of Sri Lanka, built around your dream moments.',
    accent: '#01A98F',
    tag: 'Itineraries',
    delay: 0,
  },
  {
    icon: Mountain,
    title: 'Journey Customization',
    description: 'Every aspect of your trip tailored — pace, comfort, age group, and experiences.',
    accent: '#0bbf9e',
    tag: 'Tailored',
    delay: 0.1,
  },
  {
    icon: Building,
    title: 'Premium Services',
    description: 'Luxury accommodations and seamless private transfers for a first-class experience.',
    accent: '#00d4aa',
    tag: 'Luxury',
    delay: 0.2,
  },
  {
    icon: Waves,
    title: 'Activity Booking',
    description: 'Pre-reserved experiences — from whale watching to ancient heritage walks.',
    accent: '#01A98F',
    tag: 'Experiences',
    delay: 0.3,
  },
];

export function DestinationServices() {
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
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px) scale(1.03)`;
    setHovered(idx);
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
    setHovered(null);
  };

  return (
    <section id="destinations" className="ds-section" ref={sectionRef}>
      <div className="ds-blob ds-blob-1" />
      <div className="ds-blob ds-blob-2" />
      <div className="ds-bg-grid" />

      <div className="ds-container">
        {/* Header */}
        <div className={`ds-header ${visible ? 'ds-anim-in' : ''}`}>
          <span className="ds-badge">Our Services</span>
          <h2 className="ds-title">
            Destination <span className="ds-title-accent">Journey Services</span>
          </h2>
          <p className="ds-subtitle">
            Comprehensive services for your Sri Lankan adventure — crafted with local expertise
          </p>
        </div>

        {/* Cards */}
        <div className="ds-grid">
          {services.map((s, i) => (
            <div
              key={i}
              className={`ds-card ${visible ? 'ds-anim-in' : ''}`}
              style={{ animationDelay: `${0.18 + s.delay}s` }}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Glow */}
              <div
                className="ds-card-glow"
                style={{
                  background: `radial-gradient(ellipse at 30% 0%, ${s.accent}22, transparent 60%)`,
                  opacity: hovered === i ? 1 : 0,
                }}
              />

              {/* Tag */}
              <span className="ds-tag" style={{ color: s.accent, borderColor: `${s.accent}33`, background: `${s.accent}0e` }}>
                {s.tag}
              </span>

              {/* Icon */}
              <div
                className="ds-icon"
                style={{
                  background: `linear-gradient(135deg, ${s.accent}22, ${s.accent}0a)`,
                  border: `1.5px solid ${s.accent}33`,
                  color: s.accent,
                }}
              >
                <s.icon style={{ width: 28, height: 28 }} />
              </div>

              <h3 className="ds-card-title">{s.title}</h3>
              <p className="ds-card-desc">{s.description}</p>

              {/* CTA */}
              <div
                className="ds-cta"
                style={{
                  color: s.accent,
                  opacity: hovered === i ? 1 : 0,
                  transform: hovered === i ? 'translateY(0)' : 'translateY(6px)',
                }}
              >
                Learn more
                <ArrowRight style={{ width: 14, height: 14 }} />
              </div>

              {/* Bottom bar */}
              <div
                className="ds-bar"
                style={{
                  background: `linear-gradient(90deg, ${s.accent}, ${s.accent}44)`,
                  transform: hovered === i ? 'scaleX(1)' : 'scaleX(0)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}