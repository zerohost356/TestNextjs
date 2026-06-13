import Head from "next/head";
import { useState, useEffect, useRef } from "react";

const EXAMPLE_RESPONSE = {
  success: true,
  provider: "FruityBlox",
  data: {
    normal_stock: [
      { name: "Rocket",  price_beli: 5000,   price_robux: 50,   type: "Natural",  image_url: "https://fruityblox.com/images/fruits/rocket.webp" },
      { name: "Light",   price_beli: 650000, price_robux: 1100, type: "Elemental", image_url: "https://fruityblox.com/images/fruits/light.webp" },
    ],
    mirage_stock: [
      { name: "Dragon", price_beli: 3500000, price_robux: 2600, type: "Beast", image_url: "https://fruityblox.com/images/fruits/dragon.webp" },
    ],
  },
  timers: { normal_reset_in: "2:45:12", mirage_reset_in: "0:45:12" },
  meta:   { fetched_at: "2025-06-13T12:00:00.000Z" },
};

const FIELDS = [
  { name: "success",                type: "boolean",       desc: "true nếu request thành công" },
  { name: "provider",               type: "string",        desc: "Nguồn dữ liệu (luôn là \"FruityBlox\")" },
  { name: "data.normal_stock",      type: "Fruit[]",       desc: "Danh sách fruit trên đảo Normal" },
  { name: "data.mirage_stock",      type: "Fruit[]",       desc: "Danh sách fruit trên đảo Mirage" },
  { name: "timers.normal_reset_in", type: "string",        desc: "Thời gian reset Normal stock (H:MM:SS)" },
  { name: "timers.mirage_reset_in", type: "string",        desc: "Thời gian reset Mirage stock (H:MM:SS)" },
  { name: "meta.fetched_at",        type: "string | null", desc: "ISO timestamp lúc fetch dữ liệu từ nguồn" },
];

const FRUIT_FIELDS = [
  { name: "name",        type: "string", desc: "Tên fruit" },
  { name: "price_beli",  type: "number", desc: "Giá tính bằng Beli" },
  { name: "price_robux", type: "number", desc: "Giá tính bằng Robux (0 nếu không bán Robux)" },
  { name: "type",        type: "string", desc: "Loại fruit: Natural, Elemental, Beast, v.v." },
  { name: "image_url",   type: "string", desc: "URL ảnh fruit từ FruityBlox" },
];

const TYPE_COLORS: Record<string, string> = {
  boolean:        "#38bdf8",
  string:         "#4ade80",
  number:         "#fb923c",
  "Fruit[]":      "#a78bfa",
  "string | null":"#f472b6",
};
const typeColor = (t: string) => TYPE_COLORS[t] ?? "#94a3b8";

/* ── Scroll reveal hook ─────────────────────── */
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ── Badge ──────────────────────────────────── */
function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md font-mono"
      style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>
      {children}
    </span>
  );
}

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = { GET: "#4ade80", POST: "#fb923c" };
  const c = colors[method] ?? "#94a3b8";
  return (
    <span className="text-xs font-black px-2.5 py-1 rounded-lg font-mono"
      style={{ color: c, background: `${c}12`, border: `1px solid ${c}30` }}>
      {method}
    </span>
  );
}

/* ── Code block ─────────────────────────────── */
function CodeBlock({ code, lang = "json" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative rounded-2xl overflow-hidden"
      style={{ background: "rgba(6,9,15,0.95)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-[#3a5068]">{lang}</span>
        </div>
        <button onClick={copy}
          className="flex items-center gap-1.5 text-[11px] font-medium transition-all px-2.5 py-1 rounded-lg"
          style={{ color: copied ? "#4ade80" : "#4a6080", background: copied ? "rgba(74,222,128,0.08)" : "transparent" }}>
          {copied ? (
            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>Copied!</>
          ) : (
            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>Copy</>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs leading-relaxed overflow-x-auto font-mono text-[#c9d1d9] whitespace-pre">{code}</pre>
    </div>
  );
}

/* ── Animated section card ──────────────────── */
function DocCard({ id, title, subtitle, delay = 0, children }: {
  id: string; title: string; subtitle?: string; delay?: number; children: React.ReactNode;
}) {
  const ref = useReveal(delay);
  return (
    <section id={id} ref={ref} className="reveal scroll-mt-24">
      <div className="rounded-3xl overflow-hidden transition-all duration-300"
        style={{ background: "rgba(10,15,24,0.75)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}>
        <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-xl font-black text-white">{title}</h2>
          {subtitle && <p className="text-sm text-[#4a6080] mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ── Main docs page ─────────────────────────── */
export default function DocsPage() {
  const exampleJson = JSON.stringify(EXAMPLE_RESPONSE, null, 2);
  const headerRef = useReveal(0);

  const curlGet  = `curl -X GET https://your-domain.com/api/stock`;
  const curlPost = `curl -X POST https://your-domain.com/api/stock`;
  const jsExample = `const res = await fetch('/api/stock');
const data = await res.json();

if (data.success) {
  const { normal_stock, mirage_stock } = data.data;
  const { normal_reset_in, mirage_reset_in } = data.timers;

  console.log('Normal stock:', normal_stock);
  console.log('Mirage stock:', mirage_stock);
  console.log('Resets in:', normal_reset_in);
}`;

  const pyExample = `import requests

res = requests.get('https://your-domain.com/api/stock')
data = res.json()

if data['success']:
    for fruit in data['data']['normal_stock']:
        print(f"{fruit['name']}: {fruit['price_beli']:,} Beli")`;

  const navLinks = [
    { id: "overview",   label: "Tổng quan" },
    { id: "endpoints",  label: "Endpoints" },
    { id: "response",   label: "Response schema" },
    { id: "fruit-type", label: "Fruit object" },
    { id: "example",    label: "Ví dụ response" },
    { id: "code",       label: "Code examples" },
    { id: "errors",     label: "Lỗi" },
  ];

  return (
    <>
      <Head>
        <title>API Docs – BloxStock</title>
        <meta name="description" content="BloxStock API documentation — GET /api/stock endpoint for real-time Blox Fruits stock data." />
      </Head>

      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: "radial-gradient(ellipse 50% 40% at 100% 0%, rgba(56,189,248,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 0% 100%, rgba(167,139,250,0.06) 0%, transparent 60%)",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Page header */}
        <div ref={headerRef} className="reveal mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 animate-pop-in delay-0"
            style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", color: "#38bdf8" }}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            REST API · v1.0
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 animate-fade-up delay-100">
            API <span className="text-gradient-sky">Documentation</span>
          </h1>
          <p className="text-[#4a6080] text-base max-w-xl leading-relaxed animate-fade-up delay-200">
            Truy cập dữ liệu Blox Fruits stock real-time qua API JSON đơn giản.
            Không cần auth, không cần API key.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sticky sidebar */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-24 space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#2d3f52] px-3 mb-3">On this page</p>
              {navLinks.map((link, i) => (
                <a key={link.id} href={`#${link.id}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all animate-slide-in-left"
                  style={{
                    color: "#4a6080",
                    animationDelay: `${i * 50}ms`,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#fff";
                    el.style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.color = "#4a6080";
                    el.style.background = "transparent";
                  }}>
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "currentColor" }} />
                  {link.label}
                </a>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-8">

            <DocCard id="overview" title="Tổng quan" delay={0}>
              <div className="px-6 py-5 space-y-4 text-sm text-[#6b7e94] leading-relaxed">
                <p>
                  BloxStock API cung cấp dữ liệu fruit stock Blox Fruits từ Normal và Mirage island,
                  được fetch tự động từ <span className="text-[#38bdf8] font-mono">fruityblox.com</span> và cache mỗi 10 giây.
                </p>
                <div className="grid sm:grid-cols-3 gap-3 pt-1">
                  {[
                    { icon: "⚡", label: "Không cần auth",  desc: "Gọi trực tiếp, không API key",  delay: 0 },
                    { icon: "🔄", label: "Cache 10s",       desc: "Dữ liệu luôn fresh",             delay: 80 },
                    { icon: "📦", label: "JSON thuần",      desc: "Response dễ parse",              delay: 160 },
                  ].map((f) => (
                    <div key={f.label}
                      className="flex items-start gap-3 p-3.5 rounded-2xl transition-all duration-300 cursor-default animate-fade-up"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        animationDelay: `${f.delay + 200}ms`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                        (e.currentTarget as HTMLElement).style.transform = "none";
                      }}>
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <p className="text-white font-semibold text-xs mb-0.5">{f.label}</p>
                        <p className="text-[10px] text-[#3a5068]">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DocCard>

            <DocCard id="endpoints" title="Endpoints" delay={50}>
              <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {[
                  {
                    method: "GET", desc: "Lấy stock hiện tại",
                    body: "Trả về toàn bộ fruit stock của Normal và Mirage island kèm timer reset và metadata. Dữ liệu được cache — nếu cache < 10 giây tuổi thì trả về luôn.",
                    code: curlGet,
                  },
                  {
                    method: "POST", desc: "Force refresh cache",
                    body: `Buộc fetch lại dữ liệu từ FruityBlox ngay lập tức, bỏ qua cache. Response giống GET nhưng thêm trường "message".`,
                    code: curlPost,
                  },
                ].map((ep, i) => (
                  <div key={ep.method} className="px-6 py-5 space-y-4 animate-fade-up" style={{ animationDelay: `${i * 80 + 100}ms` }}>
                    <div className="flex items-center gap-3 flex-wrap">
                      <MethodBadge method={ep.method} />
                      <code className="text-sm font-mono font-bold text-white">/api/stock</code>
                      <span className="text-xs text-[#4a6080]">{ep.desc}</span>
                    </div>
                    <p className="text-sm text-[#6b7e94]">{ep.body}</p>
                    <CodeBlock code={ep.code} lang="bash" />
                  </div>
                ))}
              </div>
            </DocCard>

            <DocCard id="response" title="Response schema" subtitle="Cấu trúc JSON trả về từ GET /api/stock" delay={80}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {["Field", "Type", "Mô tả"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#2d3f52]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FIELDS.map((f, i) => (
                      <tr key={f.name}
                        className="animate-fade-up transition-colors"
                        style={{
                          borderBottom: i < FIELDS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          animationDelay: `${i * 50 + 100}ms`,
                        }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <td className="px-6 py-3.5"><code className="text-xs font-mono text-[#c9d1d9]">{f.name}</code></td>
                        <td className="px-6 py-3.5"><Badge color={typeColor(f.type)}>{f.type}</Badge></td>
                        <td className="px-6 py-3.5 text-[#6b7e94] text-xs">{f.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DocCard>

            <DocCard id="fruit-type" title="Fruit object"
              subtitle={`Schema của mỗi item trong normal_stock và mirage_stock`} delay={100}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {["Field", "Type", "Mô tả"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#2d3f52]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FRUIT_FIELDS.map((f, i) => (
                      <tr key={f.name}
                        className="animate-fade-up transition-colors"
                        style={{
                          borderBottom: i < FRUIT_FIELDS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          animationDelay: `${i * 50 + 100}ms`,
                        }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <td className="px-6 py-3.5"><code className="text-xs font-mono text-[#c9d1d9]">{f.name}</code></td>
                        <td className="px-6 py-3.5"><Badge color={typeColor(f.type)}>{f.type}</Badge></td>
                        <td className="px-6 py-3.5 text-[#6b7e94] text-xs">{f.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-xs font-bold text-[#4a6080] uppercase tracking-widest mb-3">Các fruit type</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { t: "Natural",   c: "#86efac" }, { t: "Elemental", c: "#7dd3fc" },
                    { t: "Beast",     c: "#fb923c" }, { t: "Mythical",  c: "#fbbf24" },
                    { t: "Legendary", c: "#c084fc" }, { t: "Rare",      c: "#38bdf8" },
                    { t: "Uncommon",  c: "#4ade80" }, { t: "Common",    c: "#94a3b8" },
                  ].map(({ t, c }, i) => (
                    <span key={t}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full animate-pop-in"
                      style={{
                        color: c, background: `${c}12`, border: `1px solid ${c}25`,
                        animationDelay: `${i * 40 + 200}ms`,
                      }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </DocCard>

            <DocCard id="example" title="Ví dụ response" subtitle="Response thực tế từ GET /api/stock (đã rút gọn)" delay={120}>
              <div className="p-5">
                <CodeBlock code={exampleJson} lang="json" />
              </div>
            </DocCard>

            <DocCard id="code" title="Code examples" delay={140}>
              <div className="p-5 space-y-6">
                {[
                  { label: "JavaScript / TypeScript", code: jsExample, lang: "javascript" },
                  { label: "Python", code: pyExample, lang: "python" },
                ].map((ex, i) => (
                  <div key={ex.label} className="animate-fade-up" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                    <p className="text-xs font-bold text-[#4a6080] uppercase tracking-widest mb-3">{ex.label}</p>
                    <CodeBlock code={ex.code} lang={ex.lang} />
                  </div>
                ))}
              </div>
            </DocCard>

            <DocCard id="errors" title="Lỗi" delay={160}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {["HTTP Status", "success", "error", "Nguyên nhân"].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-[#2d3f52]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { status: "200", success: "true",  error: "—",                                           cause: "Request thành công", c: "#4ade80" },
                      { status: "500", success: "false", error: "Could not parse stock data from HTML",         cause: "FruityBlox thay đổi HTML structure", c: "#f87171" },
                      { status: "503", success: "false", error: "Stock data not yet available",                 cause: "Cache chưa khởi tạo (server mới start)", c: "#fb923c" },
                    ].map((row, i) => (
                      <tr key={i}
                        className="animate-fade-up transition-colors"
                        style={{
                          borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          animationDelay: `${i * 60 + 200}ms`,
                        }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                        <td className="px-6 py-3.5">
                          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg"
                            style={{ color: row.c, background: `${row.c}12`, border: `1px solid ${row.c}25` }}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <code className="text-xs font-mono" style={{ color: row.success === "true" ? "#4ade80" : "#f87171" }}>
                            {row.success}
                          </code>
                        </td>
                        <td className="px-6 py-3.5"><code className="text-xs font-mono text-[#6b7e94]">{row.error}</code></td>
                        <td className="px-6 py-3.5 text-[#6b7e94] text-xs">{row.cause}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DocCard>

            <p className="text-center text-xs text-[#2d3f52] pb-4 animate-fade-in delay-700">
              BloxStock API · Data via FruityBlox · Not affiliated with Roblox
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
