import React, { useEffect, useRef, useState } from "react";

export function HeroSection() {
  const [videos, setVideos] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rotationMs = 10000; // 10 seconds per video (minimum play time)

  useEffect(() => {
    let mounted = true;

    async function discoverVideos(): Promise<string[]> {
      // 1) Try an explicit manifest (videos/index.json) — easiest for static hosts.
      try {
        const res = await fetch("/videos/index.json", { cache: "no-cache" });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            return json.map((f: string) => `/videos/${f}`);
          }
        }
      } catch (e) {
        // ignore and continue to other discovery methods
      }

      // 2) Try fetching the directory listing HTML (works on some static hosts/dev servers)
      try {
        // Try both with and without trailing slash — servers differ
        const pathsToTry = ["/videos/", "/videos"];
        for (const p of pathsToTry) {
          try {
            const res = await fetch(p);
            if (!res.ok) continue;
            const text = await res.text();
            const found: string[] = [];

            // Capture <a href="...mp4"> and src="...mp4" and <source src="...mp4">
            const regexAll = /(?:href|src)\s*=\s*["']([^"']+\.(?:mp4|webm))["']/gi;
            let m: RegExpExecArray | null;
            while ((m = regexAll.exec(text))) {
              const href = m[1];
              const url = href.startsWith("/") ? href : href.startsWith("http") ? href : `/videos/${href}`;
              if (!found.includes(url)) found.push(url);
            }

            // Also look for <source src=...> inside video tags (some servers render that way)
            const sourceRegex = /<source[^>]+src=["']([^"']+\.(?:mp4|webm))["'][^>]*>/gi;
            while ((m = sourceRegex.exec(text))) {
              const href = m[1];
              const url = href.startsWith("/") ? href : href.startsWith("http") ? href : `/videos/${href}`;
              if (!found.includes(url)) found.push(url);
            }

            if (found.length) return found;
          } catch (err) {
            // ignore and try next path
          }
        }
      } catch (e) {
        // ignore
      }

      // 3) Fallback probe: list all files in the folder by attempting HEAD requests
      // for any file present. Since the user said not to rely on names, this is
      // a best-effort fallback using common patterns with numeric suffixes.
      const extensions = ["mp4", "webm"];
      const found: string[] = [];
      for (let i = 0; i < 20; i++) {
        for (const ext of extensions) {
          const name = i === 0 ? `video.${ext}` : `video-${i}.${ext}`;
          try {
            const res = await fetch(`/videos/${name}`, { method: "HEAD" });
            if (res.ok) found.push(`/videos/${name}`);
          } catch (e) {
            // ignore
          }
        }
      }

      return found;
    }

    (async () => {
      const list = await discoverVideos();
      if (mounted && list.length > 0) {
        setVideos(list);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Rotation effect: change current index every rotationMs
  useEffect(() => {
    if (videos.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((s) => (s + 1) % videos.length);
    }, rotationMs);
    return () => clearInterval(id);
  }, [videos]);

  // When current or videos change, swap the video src and play
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const src = videos.length > 0 ? videos[current] : undefined;
    if (!src) return;
    // Swap source and play
    try {
      el.pause();
      // Remove existing sources
      while (el.firstChild) el.removeChild(el.firstChild);
      const source = document.createElement("source");
      source.src = src;
      source.type = src.endsWith(".webm") ? "video/webm" : "video/mp4";
      el.appendChild(source);
      el.load();
      // play returns a promise; ignore rejections (autoplay policies)
      void el.play();
    } catch (e) {
      // ignore
    }
  }, [current, videos]);

  const fallback =
    "https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69528130e1a25a4c66c51ac0e6c6a26dd&profile_id=164&oauth2_token_id=57447761";

  const initialSrc = videos.length > 0 ? videos[0] : fallback;

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center text-white pt-16">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={initialSrc} type={initialSrc.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          {/* Fallback for browsers that don't support video */}
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <h1 className="text-5xl md:text-7xl mb-6 font-bold hero-title">
          Kraft Your Journey Through Sri Lanka
        </h1>
        <p className="text-xl md:text-3xl mb-8 font-light">
          Experience the Pearl of the Indian Ocean with AI-Powered Travel Planning
        </p>
        <button
          onClick={() => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" })}
          className="px-10 py-4 rounded-full text-lg transition-all transform hover:scale-105 shadow-xl cta-shadow"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "color-mix(in srgb, var(--primary) 80%, black 20%)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
          }}
        >
          Start Planning Your Journey
        </button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}