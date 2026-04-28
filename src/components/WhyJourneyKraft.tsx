import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Brain, BadgeDollarSign, HeadphonesIcon, ArrowRight } from 'lucide-react';

const pillars = [
  {
    icon: CheckCircle2,
    title: 'Expert Knowledge',
    desc: '15+ years of Sri Lankan tourism expertise — every road, village, and hidden gem.',
    delay: 0,
  },
  {
    icon: Brain,
    title: 'AI-Powered Planning',
    desc: 'Cutting-edge technology that builds perfect itineraries in seconds.',
    delay: 0.08,
  },
  {
    icon: BadgeDollarSign,
    title: 'Competitive Pricing',
    desc: 'Best value for money guaranteed — premium quality, honest costs.',
    delay: 0.16,
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    desc: "We're always here for you — before, during, and after your journey.",
    delay: 0.24,
  },
];

export function WhyJourneyKraft() {
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

  return (
    <section id="why-us" className="why-section" ref={sectionRef}>
      {/* Animated background particles */}
      <div className="why-particle why-p1" />
      <div className="why-particle why-p2" />
      <div className="why-particle why-p3" />
      <div className="why-bg-grid" />

      <div className="why-container">
        {/* Header */}
        <div className={`why-header ${visible ? 'why-anim-in' : ''}`}>
          <span className="why-badge">Why Choose Us</span>
          <h2 className="why-title">Why <span className="why-title-accent">JourneyKraft?</span></h2>
        </div>

        {/* Main glass card */}
        <div className={`why-card ${visible ? 'why-anim-in' : ''}`} style={{ animationDelay: '0.15s' }}>
          {/* Inner mesh gradient */}
          <div className="why-card-mesh" />

          <p className="why-body">
            We are an experience-led Destination Management Company crafting deeply personal
            Sri Lankan journeys for European travelers. With over 15 years of on-ground
            expertise, we start from the moments you want to <em>feel</em> — and build everything around that.
          </p>

          {/* Pillar grid */}
          <div className="why-pillars">
            {pillars.map((p, i) => (
              <div
                key={i}
                className={`why-pillar ${visible ? 'why-anim-in' : ''}`}
                style={{ animationDelay: `${0.3 + p.delay}s` }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Hover glow */}
                <div
                  className="why-pillar-glow"
                  style={{ opacity: hovered === i ? 1 : 0 }}
                />
                {/* Icon */}
                <div className={`why-pillar-icon ${hovered === i ? 'why-pillar-icon-active' : ''}`}>
                  <p.icon style={{ width: 22, height: 22 }} />
                </div>
                <div className="why-pillar-content">
                  <h3 className="why-pillar-title">{p.title}</h3>
                  <p className="why-pillar-desc">{p.desc}</p>
                </div>
                {/* Arrow reveal */}
                <div
                  className="why-pillar-arrow"
                  style={{
                    opacity: hovered === i ? 1 : 0,
                    transform: hovered === i ? 'translateX(0)' : 'translateX(-6px)',
                  }}
                >
                  <ArrowRight style={{ width: 16, height: 16 }} />
                </div>
              </div>
            ))}
          </div>

          <p className="why-footer-text">
            From pristine beaches to misty mountains, ancient temples to vibrant cities —
            we craft journeys that capture the soul of Sri Lanka, delivered with flawless on-ground expertise.
          </p>
        </div>
      </div>
    </section>
  );
}