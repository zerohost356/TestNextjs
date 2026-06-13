import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Custom404() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 500);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <Head>
        <title>404 – Page Not Found | BloxStock</title>
        <meta name="description" content="Page not found" />
      </Head>

      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-md w-full">
          <div className="relative mb-10 select-none">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-orange-600/8 blur-3xl"></div>
            </div>
            <div className="relative text-[7rem] sm:text-[9rem] font-black leading-none tracking-tighter">
              <span className="text-[#21262d]">4</span>
              <span className="relative inline-block">
                <span className="text-orange-500">0</span>
              </span>
              <span className="text-[#21262d]">4</span>
            </div>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center mx-auto mb-6 animate-float text-3xl">
            🍃
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
          <p className="text-[#8b949e] text-sm mb-1.5 leading-relaxed">
            The page you{"'"}re looking for doesn{"'"}t exist or has been moved.
          </p>
          <p className="text-[#484f58] text-xs font-mono mb-8">Searching{dots}</p>

          <Link href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-sm font-semibold transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Stock
          </Link>
        </div>
      </div>
    </>
  );
}
