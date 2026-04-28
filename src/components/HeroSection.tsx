import React, { useEffect, useRef, useState } from "react";

/* ─── Floating Destination Cards Data ─── */
const destinations = [
  {
    title: "Sigiriya",
    subtitle: "Ancient Rock Fortress",
    emoji: "🏰",
    delay: 0,
  },
  {
    title: "Ella",
    subtitle: "Misty Mountain Railways",
    emoji: "🚂",
    delay: 1,
  },
  {
    title: "Mirissa",
    subtitle: "Pristine Beach Paradise",
    emoji: "🏖️",
    delay: 2,
  },
  {
    title: "Kandy",
    subtitle: "Sacred Temple City",
    emoji: "🛕",
    delay: 0.5,
  },
];

const stats = [
  { value: "500+", label: "Destinations" },
  { value: "10K+", label: "Happy Travelers" },
  { value: "4.9", label: "★ Rating" },
];

export function HeroSection() {
  const [videos, setVideos] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [topIsA, setTopIsA] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const layerARef = useRef<HTMLVideoElement | null>(null);
  const layerBRef = useRef<HTMLVideoElement | null>(null);
  const rotationMs = 10000;
  const transitionMs = 900;

  /* ─── Mark loaded after mount for entrance animations ─── */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(t);
  }, []);

  /* ─── Video discovery (unchanged logic) ─── */
  useEffect(() => {
    let mounted = true;

    async function discoverVideos(): Promise<string[]> {
      try {
        const res = await fetch("/videos/index.json", { cache: "no-cache" });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) return json.map((f: string) => `/videos/${f}`);
        }
      } catch (e) { /* ignore */ }

      try {
        const pathsToTry = ["/videos/", "/videos"];
        for (const p of pathsToTry) {
          try {
            const res = await fetch(p);
            if (!res.ok) continue;
            const text = await res.text();
            const found: string[] = [];
            const regexAll = /(?:href|src)\s*=\s*["']([^"']+\.(?:mp4|webm))["']/gi;
            let m: RegExpExecArray | null;
            while ((m = regexAll.exec(text))) {
              const href = m[1];
              const url = href.startsWith("/") ? href : href.startsWith("http") ? href : `/videos/${href}`;
              if (!found.includes(url)) found.push(url);
            }
            if (found.length) return found;
          } catch (err) { /* ignore */ }
        }
      } catch (e) { /* ignore */ }

      const extensions = ["mp4", "webm"];
      const found: string[] = [];
      for (let i = 0; i < 50; i++) {
        for (const ext of extensions) {
          const name = i === 0 ? `video.${ext}` : `video-${i}.${ext}`;
          try {
            const res = await fetch(`/videos/${name}`, { method: "HEAD" });
            if (res.ok) found.push(`/videos/${name}`);
          } catch (e) { /* ignore */ }
        }
      }
      return found;
    }

    (async () => {
      const list = await discoverVideos();
      if (mounted && list.length > 0) setVideos(list);
    })();

    return () => { mounted = false; };
  }, []);

  /* ─── Video rotation timer ─── */
  useEffect(() => {
    if (videos.length <= 1) return;
    const id = setInterval(() => {
      const next = (current + 1) % videos.length;
      const topRef = topIsA ? layerARef.current : layerBRef.current;
      const botRef = topIsA ? layerBRef.current : layerARef.current;
      if (!topRef || !botRef) return;

      try {
        while (botRef.firstChild) botRef.removeChild(botRef.firstChild);
        const s = document.createElement("source");
        s.src = videos[next];
        s.type = videos[next].endsWith(".webm") ? "video/webm" : "video/mp4";
        botRef.appendChild(s);
        botRef.load();
        void botRef.play();
      } catch (e) { /* ignore */ }

      setTopIsA((t: boolean) => !t);

      setTimeout(() => {
        try {
          const hidden = topIsA ? layerARef.current : layerBRef.current;
          if (hidden) hidden.pause();
        } catch (e) { }
        setCurrent(next);
      }, transitionMs + 50);
    }, rotationMs);

    return () => clearInterval(id);
  }, [videos, current, topIsA]);

  /* ─── Initial video load ─── */
  useEffect(() => {
    if (videos.length === 0) return;
    const a = layerARef.current;
    const b = layerBRef.current;
    const first = videos[0];
    try {
      if (a) {
        while (a.firstChild) a.removeChild(a.firstChild);
        const s = document.createElement("source");
        s.src = first;
        s.type = first.endsWith(".webm") ? "video/webm" : "video/mp4";
        a.appendChild(s);
        a.load();
        void a.play();
        a.classList.add("active");
      }
      if (b && videos.length > 1) {
        const second = videos[1];
        while (b.firstChild) b.removeChild(b.firstChild);
        const s2 = document.createElement("source");
        s2.src = second;
        s2.type = second.endsWith(".webm") ? "video/webm" : "video/mp4";
        b.appendChild(s2);
        b.load();
      }
    } catch (e) { /* ignore */ }
  }, [videos]);

  return (
    <section id="hero" className="relative h-screen flex items-center text-white pt-16 overflow-hidden">
      {/* ── Video Background ── */}
      <div className="hero-video-viewport">
        <video ref={layerARef} muted playsInline loop preload="auto" className={`hero-video-layer ${topIsA ? "active" : ""}`} />
        <video ref={layerBRef} muted playsInline loop preload="auto" className={`hero-video-layer ${!topIsA ? "active" : ""}`} />
        {/* Image overlay */}
        <div className="hero-overlay-image" />
        {/* Cinematic overlay */}
        <div className="hero-overlay-cinematic" />
      </div>

      {/* ── Main Content: Centered Layout ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 lg:px-8 flex flex-col items-center" style={{ paddingTop: "6vh" }}>

        {/* CENTER COLUMN — Text + CTA */}
        <div className="flex flex-col items-center text-center w-full">
          {/* Badge */}
          <div
            className={`hero-badge ${loaded ? "hero-anim-in" : ""}`}
            style={{ animationDelay: "0.1s" }}
          >
            <span className="hero-badge-dot" />
            AI-Powered Travel Planning
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            {"Stop selling".split(" ").map((word, i) => (
              <span
                key={i}
                className={`hero-word ${loaded ? "hero-anim-in" : ""}`}
                style={{ animationDelay: `${0.25 + i * 0.12}s` }}
              >
                {word}{" "}
              </span>
            ))}
            <br className="hidden lg:block" />
            {"\"Sri Lanka packages.\"".split(" ").map((word, i) => (
              <span
                key={`b${i}`}
                className={`hero-word ${loaded ? "hero-anim-in" : ""}`}
                style={{ animationDelay: `${0.55 + i * 0.12}s` }}
              >
                {word}{" "}
              </span>
            ))}
            <br className="hidden lg:block" />
            {"Start selling stories of".split(" ").map((word, i) => (
              <span
                key={`c${i}`}
                className={`hero-word ${loaded ? "hero-anim-in" : ""}`}
                style={{ animationDelay: `${0.85 + i * 0.12}s` }}
              >
                {word}{" "}
              </span>
            ))}
            <span
              className={`hero-word hero-word-accent ${loaded ? "hero-anim-in" : ""}`}
              style={{ animationDelay: "1.4s" }}
            >
              paradise, built to win clients.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`hero-subtitle ${loaded ? "hero-anim-in" : ""}`}
            style={{ animationDelay: "1.55s" }}
          >
            We design experience-first itineraries that feel exclusive, tailored
            to each traveler's pace, comfort, and purpose.
          </p>

          {/* CTA Buttons */}
          <div
            className={`hero-cta-group ${loaded ? "hero-anim-in" : ""}`}
            style={{ animationDelay: "1.15s" }}
          >
            <button
              onClick={() => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" })}
              className="hero-cta-primary"
            >
              <span>Start Planning</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-cta-arrow">
                <path d="M4.167 10h11.666M10 4.167 15.833 10 10 15.833" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => document.getElementById("how-we-work")?.scrollIntoView({ behavior: "smooth" })}
              className="hero-cta-secondary"
            >
              See How It Works
            </button>
          </div>

          {/* Stats Row */}
          <div
            className={`hero-stats ${loaded ? "hero-anim-in" : ""}`}
            style={{ animationDelay: "1.35s" }}
          >
            {stats.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="hero-stats-divider" />}
                <div className="hero-stat">
                  <span className="hero-stat-value">{s.value}</span>
                  <span className="hero-stat-label">{s.label}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN — Hidden */}
        <div className="hidden">
          {destinations.map((dest, i) => (
            <div
              key={i}
              className={`hero-dest-card hero-dest-card-${i} ${loaded ? "hero-anim-in" : ""}`}
              style={{ animationDelay: `${0.6 + dest.delay * 0.4}s` }}
            >
              <span className="hero-dest-emoji">{dest.emoji}</span>
              <div>
                <span className="hero-dest-title">{dest.title}</span>
                <span className="hero-dest-subtitle">{dest.subtitle}</span>
              </div>
            </div>
          ))}

          {/* Central decorative ring */}
          <div className="hero-ring hero-ring-1" />
          <div className="hero-ring hero-ring-2" />
        </div>
      </div>

      {/* ── Scroll Indicator ── */}
      <div className={`hero-scroll ${loaded ? "hero-anim-in" : ""}`} style={{ animationDelay: "1.6s" }}>
        <span className="hero-scroll-text">Explore</span>
        <div className="hero-scroll-line" />
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="hero-scroll-chevron">
          <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}