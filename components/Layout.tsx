import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

function BloxStockLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="gemGrad" x1="4" y1="10" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="60%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="shineGrad" x1="4" y1="10" x2="20" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="logoGlow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="36" height="36" rx="10" fill="url(#logoGrad)" />
      <polygon points="18,7 28,13 28,25 18,31 8,25 8,13" fill="url(#gemGrad)" filter="url(#logoGlow)" />
      <polygon points="18,7 28,13 28,25 18,31 8,25 8,13" fill="url(#shineGrad)" />
      <polyline points="8,13 18,19 28,13" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.3" fill="none" />
      <line x1="18" y1="19" x2="18" y2="31" stroke="#fff" strokeWidth="0.7" strokeOpacity="0.2" />
      <circle cx="27" cy="9" r="1.8" fill="#fde68a" opacity="0.9" />
      <circle cx="9" cy="27" r="1.2" fill="#fde68a" opacity="0.7" />
      <circle cx="30" cy="24" r="0.9" fill="#fff" opacity="0.6" />
    </svg>
  );
}

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[
        { left: "12%",  top: "20%", size: 3, dur: "8s",  del: "0s",   color: "rgba(249,115,22,0.5)" },
        { left: "85%",  top: "15%", size: 2, dur: "11s", del: "2s",   color: "rgba(251,191,36,0.4)" },
        { left: "40%",  top: "60%", size: 2, dur: "9s",  del: "4s",   color: "rgba(167,139,250,0.4)" },
        { left: "70%",  top: "75%", size: 3, dur: "13s", del: "1s",   color: "rgba(56,189,248,0.35)" },
        { left: "25%",  top: "80%", size: 2, dur: "10s", del: "3s",   color: "rgba(249,115,22,0.3)" },
        { left: "60%",  top: "35%", size: 2, dur: "12s", del: "5s",   color: "rgba(251,191,36,0.3)" },
        { left: "90%",  top: "55%", size: 2, dur: "7s",  del: "0.5s", color: "rgba(167,139,250,0.35)" },
        { left: "5%",   top: "45%", size: 3, dur: "14s", del: "2.5s", color: "rgba(56,189,248,0.3)" },
      ].map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: p.left,
          top: p.top,
          width: p.size,
          height: p.size,
          borderRadius: "50%",
          background: p.color,
          animation: `particle ${p.dur} ease-in-out ${p.del} infinite`,
          boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
        }} />
      ))}
    </div>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [pageKey, setPageKey] = useState(0);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [router.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleStart = () => setTransitioning(true);
    const handleDone  = () => {
      setTransitioning(false);
      setPageKey((k) => k + 1);
    };
    router.events.on("routeChangeStart",    handleStart);
    router.events.on("routeChangeComplete", handleDone);
    router.events.on("routeChangeError",    handleDone);
    return () => {
      router.events.off("routeChangeStart",    handleStart);
      router.events.off("routeChangeComplete", handleDone);
      router.events.off("routeChangeError",    handleDone);
    };
  }, [router.events]);

  const navItems = [
    {
      href: "/",
      label: "Live Stock",
      accent: "#f97316",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
    },
    {
      href: "/docs",
      label: "API Docs",
      accent: "#38bdf8",
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    },
  ];

  const current = router.pathname;

  return (
    <>
      {(title || description) && (
        <Head>
          {title && <title>{title}</title>}
          {description && <meta name="description" content={description} />}
          {title && <meta property="og:title" content={title} />}
          {description && <meta property="og:description" content={description} />}
        </Head>
      )}

      <Particles />

      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(6,9,15,0.95)" : "rgba(6,9,15,0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: scrolled ? "0 1px 0 rgba(255,255,255,0.05)" : "none",
        }}
      >
        <div className="h-px w-full animate-border-flow opacity-60"
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
              style={{ filter: "drop-shadow(0 0 8px rgba(249,115,22,0.4))" }}>
              <BloxStockLogo size={36} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-[17px] tracking-tight text-white">
                Blox<span className="text-gradient-orange">Stock</span>
              </span>
              <span className="text-[10px] text-[#4a6080] hidden sm:block font-medium tracking-wide uppercase">
                Fruit Tracker
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, i) => {
              const active = current === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/5"
                  style={{
                    color: active ? "#fff" : "#6b7e94",
                    background: active ? `${item.accent}15` : undefined,
                    border: active ? `1px solid ${item.accent}30` : "1px solid transparent",
                    animationDelay: `${i * 80}ms`,
                  }}>
                  <svg className="w-3.5 h-3.5" style={{ color: item.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                  {item.label}
                  {active && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.accent }} />}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div ref={menuRef} className="relative md:hidden">
              <button onClick={() => setOpen(!open)} aria-label="Toggle menu"
                className="w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-[5px] transition-all duration-200"
                style={{
                  background: open ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${open ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)"}`,
                }}>
                <span className="block w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center"
                  style={{ transform: open ? "translateY(6.5px) rotate(45deg)" : "none" }} />
                <span className="block h-[1.5px] bg-white rounded-full transition-all duration-300"
                  style={{ width: open ? "0px" : "14px", opacity: open ? 0 : 1 }} />
                <span className="block w-[18px] h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center"
                  style={{ transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
              </button>

              <div className={`absolute right-0 top-[calc(100%+10px)] w-72 transition-all duration-200 origin-top-right ${
                open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}>
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/60 animate-slide-up"
                  style={{ background: "rgba(10,15,25,0.97)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(24px)" }}>
                  <div className="p-2 space-y-1">
                    {navItems.map((item) => {
                      const active = current === item.href;
                      return (
                        <Link key={item.href} href={item.href}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all group"
                          style={{
                            background: active ? `${item.accent}10` : undefined,
                            border: `1px solid ${active ? `${item.accent}20` : "transparent"}`,
                          }}>
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${item.accent}10`, border: `1px solid ${item.accent}20` }}>
                            <svg className="w-4 h-4" style={{ color: item.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {item.icon}
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-white">{item.label}</span>
                              {active && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.accent }} />}
                            </div>
                            <span className="text-xs text-[#4a6080]">
                              {item.href === "/" ? "Normal & Mirage island fruits" : "Tài liệu & ví dụ code"}
                            </span>
                          </div>
                        </Link>
                      );
                    })}

                  </div>

                  <div className="px-4 py-3 flex items-center justify-between"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex items-center gap-2">
                      <BloxStockLogo size={20} />
                      <span className="text-xs text-[#4a6080] font-medium">BloxStock © 2025</span>
                    </div>
                    <span className="text-[10px] text-[#2d3f52] font-mono">v1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 top-16 bg-black/70 backdrop-blur-sm md:hidden -z-10"
            onClick={() => setOpen(false)} />
        )}
      </header>

      <div className="pt-16 min-h-screen text-white" style={{ background: "#06090f" }}>
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: "radial-gradient(ellipse 80% 50% at 80% -10%, rgba(249,115,22,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 10% 90%, rgba(167,139,250,0.07) 0%, transparent 60%)",
        }} />

        <div
          key={pageKey}
          className={`relative z-10 ${transitioning ? "page-exit" : "page-enter"}`}
        >
          {children}
        </div>
      </div>

      <footer className="relative z-10 border-t py-8 mt-4"
        style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(6,9,15,0.85)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BloxStockLogo size={28} />
            <div>
              <span className="text-sm font-bold text-white">Blox<span className="text-gradient-orange">Stock</span></span>
              <p className="text-[10px] text-[#2d3f52]">Not affiliated with Roblox or Blox Fruits</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="text-xs text-[#4a6080] hover:text-white transition-colors">Docs</Link>
            <span className="text-[#1e2a3a]">·</span>
            <span className="text-xs text-[#2d3f52]">Data via FruityBlox</span>
          </div>
        </div>
      </footer>
    </>
  );
}
