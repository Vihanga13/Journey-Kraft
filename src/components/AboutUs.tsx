import React, { useEffect, useRef, useState } from "react";

const pillars = [
  { icon: "🎭", label: "Culture" },
  { icon: "🌿", label: "Nature" },
  { icon: "🧗", label: "Adventure" },
  { icon: "🧘", label: "Wellness" },
  { icon: "💕", label: "Romance" },
  { icon: "🍛", label: "Food" },
  { icon: "🤝", label: "Local Encounters" },
];

export function AboutUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section"
    >
      {/* Decorative blobs */}
      <div className="about-blob about-blob-1" />
      <div className="about-blob about-blob-2" />

      <div className="about-container">
        {/* ── LEFT: Vertical accent + heading ── */}
        <div className={`about-left ${visible ? "about-anim-in" : ""}`}>
          <div className="about-accent-bar" />
          <div className="about-left-content">
            <span className="about-label">About Us</span>
            <h2 className="about-heading">
              We don't sell trips.
              <br />
              <span className="about-heading-accent">We craft experiences.</span>
            </h2>
          </div>
        </div>

        {/* ── RIGHT: Body text + pillar chips ── */}
        <div className={`about-right ${visible ? "about-anim-in" : ""}`} style={{ animationDelay: "0.2s" }}>
          <p className="about-body">
            Journey Kraft is an experience-led Destination Management Company for
            European travelers to Sri Lanka, built to own the experience-first
            tourism space. We start every trip with the moments guests want to
            feel and live — culture, nature, adventure, wellness, romance, food,
            and local encounters.
          </p>
          <p className="about-body about-body-secondary">
            We then craft a fully tailored itinerary around those signature
            excursions, matched to each traveler's age, pace, comfort level, and
            purpose. The result is not a standard package, but a carefully
            designed collection of experiences that fits any need — delivered with
            seamless on-ground expertise from planning to departure.
          </p>

          {/* Experience pillar chips */}
          <div className="about-pillars">
            {pillars.map((p, i) => (
              <span
                key={p.label}
                className={`about-chip ${visible ? "about-anim-in" : ""}`}
                style={{ animationDelay: `${0.35 + i * 0.08}s` }}
              >
                <span className="about-chip-icon">{p.icon}</span>
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
