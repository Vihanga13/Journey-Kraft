import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Handshake,
  PenTool,
  Gem,
  Settings,
  MessageCircle,
  Heart,
} from 'lucide-react';

const values = [
  {
    num: "01",
    icon: Sparkles,
    title: "Experience First",
    desc: "We propose experiences before routes.",
    accent: "#01A98F",
  },
  {
    num: "02",
    icon: Handshake,
    title: "Partner-Led Success",
    desc: "We protect our client's reputation like it's our own.",
    accent: "#0bbf9e",
  },
  {
    num: "03",
    icon: PenTool,
    title: "Tailored by Design",
    desc: "We challenge generic requests with better ideas.",
    accent: "#00d4aa",
  },
  {
    num: "04",
    icon: Gem,
    title: "Local Depth, Delivered with Taste",
    desc: "We confirm quality on suppliers, not assume it.",
    accent: "#01A98F",
  },
  {
    num: "05",
    icon: Settings,
    title: "Seamless Execution",
    desc: "We solve quietly and fast when things change.",
    accent: "#0bbf9e",
  },
  {
    num: "06",
    icon: MessageCircle,
    title: "Trust and Transparency",
    desc: "We communicate early, not late.",
    accent: "#00d4aa",
  },
  {
    num: "07",
    icon: Heart,
    title: "Care and Responsibility",
    desc: "We choose authenticity without sacrificing comfort.",
    accent: "#01A98F",
  },
];

export function ValuePropositions() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <section id="values" className="vp-section">
      {/* Background blobs */}
      <div className="vp-blob vp-blob-1" />
      <div className="vp-blob vp-blob-2" />
      <div className="vp-blob vp-blob-3" />
      <div className="vp-bg-image" />

      <div className="vp-inner" ref={sectionRef}>
        {/* ── Section Header ── */}
        <div className="vp-header">
          <span
            className={`vp-badge ${isVisible ? "vp-fade-in" : ""}`}
            style={{ animationDelay: "0s" }}
          >
            Our Promises
          </span>
          <h2
            className={`vp-title ${isVisible ? "vp-fade-in" : ""}`}
            style={{ animationDelay: "0.1s" }}
          >
            Seven pillars that define
            <br />
            <span className="vp-title-accent">how we work.</span>
          </h2>
          <p
            className={`vp-subtitle ${isVisible ? "vp-fade-in" : ""}`}
            style={{ animationDelay: "0.2s" }}
          >
            Not marketing promises — operating principles we follow on every single trip.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <div className="vp-grid">
          {values.map((v, i) => {
            const Icon = v.icon;
            const isHovered = hoveredIdx === i;
            // First card spans 2 cols on desktop, last card also spans 2 cols
            const spanClass =
              i === 0
                ? "vp-card-wide"
                : i === values.length - 1
                ? "vp-card-wide"
                : "";

            return (
              <div
                key={v.num}
                className={`vp-card ${spanClass} ${isVisible ? "vp-fade-in" : ""}`}
                style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Glow ring on hover */}
                <div
                  className="vp-card-glow"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(circle at 30% 20%, ${v.accent}22, transparent 70%)`,
                  }}
                />

                {/* Number watermark */}
                <span className="vp-card-num">{v.num}</span>

                {/* Icon */}
                <div
                  className="vp-card-icon"
                  style={{
                    background: isHovered
                      ? v.accent
                      : `${v.accent}18`,
                    color: isHovered ? "#fff" : v.accent,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Text */}
                <h3 className="vp-card-title">{v.title}</h3>
                <p className="vp-card-desc">{v.desc}</p>

                {/* Bottom accent line */}
                <div
                  className="vp-card-line"
                  style={{ background: v.accent }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}