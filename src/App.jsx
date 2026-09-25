import { useEffect, useState, useRef } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, FileUp,
  LockKeyhole, Search, ShieldAlert, XCircle, Award, BarChart3,
  CalendarDays, Sparkles, Shield, Zap, Users, FileCheck,
  ChevronRight, Star, Globe, Clock, TrendingUp, Layout, Play,
  Download, Activity, RefreshCw, Trash2, Filter, FileSpreadsheet,
  Check, ExternalLink, ShieldCheck, Copy, Info
} from "lucide-react";

const API = import.meta.env.VITE_CENTRAL_API_URL || "/api/v1";
const tokenFromPath = () => useParams().verificationToken;

/* Shell */
function Shell({ children }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <div className="app-shell">
      <header className={`topbar${scrolled ? " scrolled" : ""}`}>
        <Link to="/" className="brand">
          <img src="/icon.png" alt="CMS" />
          <span>
            <strong>Certificate Management System</strong>
            <small>Central Verification Portal</small>
          </span>
        </Link>
        <nav>
          <Link to="/verify" className="nav-link">Verify Certificate</Link>
          <Link to="/about" className="nav-link">About & Policy</Link>
          <Link to="/verify" className="nav-cta">Check Now <ArrowRight size={14} /></Link>
        </nav>
      </header>
      {children}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/icon.png" alt="CMS" />
            <div>
              <strong>Certificate Management System</strong>
              <span>Centralized verification platform by VS Freedom Solutions</span>
            </div>
          </div>
          <div className="footer-links">
            <Link to="/verify">Verify Certificate</Link>
            <Link to="/about">About &amp; Policy</Link>
          </div>
          <div className="footer-copy">
            <span>&#169; 2025 Certificate Management System · VS Freedom Solutions</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* Counter animation hook */
function useCountUp(target, duration, start) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* Stat Counter */
function StatCounter({ value, label, suffix = "", prefix = "" }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const count = useCountUp(value, 1800, visible);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div className="stat-item" ref={ref}>
      <div className="stat-number">{prefix}{count.toLocaleString()}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* Screenshot Showcase */
function ScreenshotShowcase() {
  const [active, setActive] = useState(0);
  const tabs = [
    { id: "dashboard", label: "Live Dashboard", icon: <BarChart3 size={15} />, img: "/ss-dashboard.jpg", title: "Real-time Analytics Dashboard", desc: "Monitor every certificate issued, verified, and revoked — all in one powerful command center with live charts and trends.", badge: "📊 Analytics" },
    { id: "certificates", label: "Certificates", icon: <Award size={15} />, img: "/ss-certificates.jpg", title: "Certificate Management at Scale", desc: "Browse, filter, and manage thousands of certificates instantly. One-click issue, revoke, and export with full audit history.", badge: "🏆 Certificates" },
    { id: "events", label: "Events", icon: <CalendarDays size={15} />, img: "/ss-events.jpg", title: "Organize Events & Programs", desc: "Create events, attach programs, assign coordinators, and track participants — your entire event lifecycle in one place.", badge: "📅 Events" },
    { id: "templates", label: "Templates", icon: <Layout size={15} />, img: "/ss-templates.jpg", title: "Professional Certificate Templates", desc: "Choose from beautiful, ready-to-use templates or build your own. Every certificate looks professional from day one.", badge: "🎨 Templates" },
  ];
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % tabs.length), 5000);
    return () => clearInterval(t);
  }, [tabs.length]);
  return (
    <section className="showcase-section">
      <div className="showcase-inner">
        <div className="section-badge"><Sparkles size={13} /> INSIDE THE PLATFORM</div>
        <h2 className="showcase-title">Everything you need.<br /><em>In one place.</em></h2>
        <p className="showcase-sub">From first event to final scan — every step of certificate management covered beautifully.</p>
        <div className="showcase-tabs">
          {tabs.map((t, i) => (
            <button key={t.id} className={`showcase-tab${active === i ? " active" : ""}`} onClick={() => setActive(i)}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
        <div className="showcase-content">
          <div className="showcase-info">
            <div className="showcase-badge">{tabs[active].badge}</div>
            <h3>{tabs[active].title}</h3>
            <p>{tabs[active].desc}</p>
            <Link to="/verify" className="showcase-cta">Verify a Certificate <ArrowRight size={15} /></Link>
          </div>
          <div className="showcase-preview">
            <div className="browser-chrome">
              <div className="chrome-bar">
                <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                <div className="chrome-url"><Globe size={11} /><span>cms.example.com/{tabs[active].id}</span></div>
              </div>
              {tabs.map((t, i) => (
                <img key={t.id} src={t.img} alt={t.label} className={`chrome-img${active === i ? " visible" : ""}`} />
              ))}
            </div>
            <div className="preview-dots">
              {tabs.map((_, i) => (
                <button key={i} className={`dot-btn${active === i ? " active" : ""}`} onClick={() => setActive(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Feature Card */
function FeatureCard({ icon, title, text, color, delay }) {
  return (
    <article className={`feature-card ${color}`} style={{ animationDelay: delay }}>
      <div className="fc-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

/* Testimonial */
function Testimonial({ quote, name, role, org }) {
  return (
    <div className="testimonial">
      <div className="t-stars">{[...Array(5)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}</div>
      <blockquote>"{quote}"</blockquote>
      <div className="t-author">
        <div className="t-avatar">{name[0]}</div>
        <div><strong>{name}</strong><span>{role}, {org}</span></div>
      </div>
    </div>
  );
}

/* HomePage */
function HomePage() {
  return (
    <main className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-eyebrow"><Sparkles size={13} /><span>TRUSTED CERTIFICATE MANAGEMENT</span></div>
            <h1>Issue. Manage.<br /><span className="gradient-text">Verify.</span></h1>
            <p className="hero-desc">The complete platform for designing events, issuing certificates, and giving every recipient a verification experience they can trust — backed by tamper-proof tokens.</p>
            <div className="hero-actions">
              <Link to="/verify" className="btn-primary">Verify a Certificate <ArrowRight size={16} /></Link>
              <a href="#showcase" className="btn-ghost"><Play size={14} fill="currentColor" />See the platform</a>
            </div>
            <div className="trust-badges">
              <span><CheckCircle2 size={14} />Token-based verification</span>
              <span><Shield size={14} />Privacy-first results</span>
              <span><Zap size={14} />Instant checks</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-window">
              <div className="hw-bar">
                <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                <b>Certificate Management System — Dashboard</b>
              </div>
              <img src="/ss-dashboard.jpg" alt="CMS Dashboard" className="hw-img" />
            </div>
            <div className="hero-float-card card-verified">
              <CheckCircle2 size={18} className="fv-icon" />
              <div><strong>Certificate Verified</strong><span>Alice Johnson · CERT-2024-4567</span></div>
            </div>
            <div className="hero-float-card card-issued">
              <TrendingUp size={18} className="fi-icon" />
              <div><strong>+194 this month</strong><span>Certificates issued</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats-bar">
        <div className="stats-inner">
          <StatCounter value={1248} label="Certificates Issued" />
          <div className="stats-div" />
          <StatCounter value={876} label="Verified This Month" />
          <div className="stats-div" />
          <StatCounter value={34} label="Active Events" />
          <div className="stats-div" />
          <StatCounter value={99} label="Uptime %" suffix="%" />
        </div>
      </section>

      {/* Screenshot Showcase */}
      <div id="showcase"><ScreenshotShowcase /></div>

      {/* Features Grid */}
      <section className="features-section">
        <div className="features-inner">
          <div className="section-badge"><Zap size={13} /> POWERFUL FEATURES</div>
          <h2>Built for the whole certificate journey</h2>
          <p className="section-sub">From the first event to the final scan, every piece of the workflow is covered.</p>
          <div className="features-grid">
            <FeatureCard icon={<CalendarDays size={24} />} title="Event & Program Management" text="Keep schedules, venues, coordinators, and participant requirements perfectly organized in one place." color="blue" delay="0ms" />
            <FeatureCard icon={<Award size={24} />} title="One-Click Certificate Issuance" text="Create consistent, professional certificates with reusable templates and automatically generated QR-ready tokens." color="purple" delay="80ms" />
            <FeatureCard icon={<BarChart3 size={24} />} title="Live Analytics Dashboard" text="See issuance activity, verification outcomes, and status changes in real time — no more spreadsheet drift." color="green" delay="160ms" />
            <FeatureCard icon={<Shield size={24} />} title="Tamper-Proof Tokens" text="Every certificate gets a unique verification token. Recipients can prove authenticity anywhere, instantly." color="teal" delay="240ms" />
            <FeatureCard icon={<Users size={24} />} title="Participant Tracking" text="Manage recipient profiles, track access history, and export participant lists across events and programs." color="orange" delay="320ms" />
            <FeatureCard icon={<FileCheck size={24} />} title="Public Verification Portal" text="Employers, institutions, and anyone can verify any certificate in seconds — without needing an account." color="slate" delay="400ms" />
          </div>
        </div>
      </section>

      {/* Screenshot strip */}
      <section className="screenshot-strip">
        <div className="strip-inner">
          <div className="section-badge"><Layout size={13} /> PLATFORM VIEWS</div>
          <h2>A closer look at the CMS</h2>
          <p className="section-sub">Every screen is designed to be fast, clear, and beautiful.</p>
          <div className="strip-grid">
            <div className="strip-card">
              <div className="strip-tag">📊 Dashboard</div>
              <img src="/ss-dashboard.jpg" alt="Dashboard overview" />
              <div className="strip-info"><strong>Analytics Overview</strong><span>Track metrics, charts &amp; recent activity</span></div>
            </div>
            <div className="strip-card">
              <div className="strip-tag">📅 Events</div>
              <img src="/ss-events.jpg" alt="Events page" />
              <div className="strip-info"><strong>Event Management</strong><span>Create events and manage programs</span></div>
            </div>
            <div className="strip-card">
              <div className="strip-tag">🏆 Certificates</div>
              <img src="/ss-certificates.jpg" alt="Certificates page" />
              <div className="strip-info"><strong>Certificate Registry</strong><span>Issue, revoke, and audit certificates</span></div>
            </div>
            <div className="strip-card">
              <div className="strip-tag">🎨 Templates</div>
              <img src="/ss-templates.jpg" alt="Templates page" />
              <div className="strip-info"><strong>Design Templates</strong><span>Professional, reusable designs</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section">
        <div className="how-inner">
          <div className="section-badge"><Clock size={13} /> HOW IT WORKS</div>
          <h2>Verification in 3 simple steps</h2>
          <p className="section-sub">Anyone can verify any certificate in seconds — no account needed.</p>
          <div className="steps">
            <div className="step"><div className="step-num">1</div><h3>Find the token</h3><p>Every certificate has a unique verification token printed or embedded as a QR code.</p></div>
            <div className="step-arrow"><ChevronRight size={24} /></div>
            <div className="step"><div className="step-num">2</div><h3>Enter or scan</h3><p>Type the token into the verification portal or scan the QR code with any smartphone.</p></div>
            <div className="step-arrow"><ChevronRight size={24} /></div>
            <div className="step"><div className="step-num">3</div><h3>See the result</h3><p>Instantly see if the certificate is valid, revoked, or not found — with full details.</p></div>
          </div>
          <div className="how-cta"><Link to="/verify" className="btn-primary">Try verification now <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="testimonials-inner">
          <div className="section-badge"><Star size={13} fill="currentColor" /> TRUSTED BY TEAMS</div>
          <h2>Loved by coordinators everywhere</h2>
          <div className="testimonials-grid">
            <Testimonial quote="The verification portal is incredibly smooth. Recipients love being able to share a link that proves their certificate is real." name="Sarah M." role="Event Coordinator" org="TechSummit 2024" />
            <Testimonial quote="We issue hundreds of certificates per event. The CMS handles it effortlessly — templates, tokens, everything." name="David K." role="Program Manager" org="Global Leadership Forum" />
            <Testimonial quote="Employers can verify our certificates in seconds. It's made our programs significantly more credible." name="Priya R." role="Director" org="Skills Academy" />
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-glow" />
          <div className="section-badge light"><Sparkles size={13} /> GET STARTED TODAY</div>
          <h2>Make every award easy to trust.</h2>
          <p>Verify any certificate instantly — free, public, and always available.</p>
          <div className="cta-actions"><Link to="/verify" className="btn-primary large">Verify a Certificate <ArrowRight size={18} /></Link></div>
          <div className="cta-trust">
            <span><CheckCircle2 size={14} />No account required</span>
            <span><Shield size={14} />Privacy-first design</span>
            <span><Zap size={14} />Results in seconds</span>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Activity Log & Storage Utilities ───────────────── */
let memoryIp = null;
async function detectClientIp() {
  if (memoryIp) return memoryIp;
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    if (res.ok) {
      const data = await res.json();
      if (data?.ip) {
        memoryIp = data.ip;
        return data.ip;
      }
    }
  } catch {}
  try {
    const res2 = await fetch("https://ipapi.co/json/");
    if (res2.ok) {
      const data2 = await res2.json();
      if (data2?.ip) {
        memoryIp = data2.ip;
        return data2.ip;
      }
    }
  } catch {}
  return "127.0.0.1";
}

const ACTIVITY_STORAGE_KEY = "cms_verfy_activity_log";

const DEFAULT_ACTIVITIES = [
  {
    id: "act-1",
    activity: "Verification",
    who: "Alice Johnson",
    token: "a8f72c91e4f",
    at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    ip: "103.212.144.18",
    status: "Valid",
    certificateNumber: "CERT-2024-4567",
    eventName: "National Tech Symposium 2024"
  },
  {
    id: "act-2",
    activity: "Download Certificate",
    who: "Alice Johnson",
    token: "a8f72c91e4f",
    at: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
    ip: "103.212.144.18",
    status: "Downloaded",
    certificateNumber: "CERT-2024-4567",
    eventName: "National Tech Symposium 2024"
  },
  {
    id: "act-3",
    activity: "Verification",
    who: "David Kumar",
    token: "b9e41d83c2a",
    at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    ip: "49.37.152.84",
    status: "Valid",
    certificateNumber: "CERT-2024-1182",
    eventName: "AI & Cloud Summit 2024"
  },
  {
    id: "act-4",
    activity: "Download Certificate",
    who: "David Kumar",
    token: "b9e41d83c2a",
    at: new Date(Date.now() - 1000 * 60 * 39).toISOString(),
    ip: "49.37.152.84",
    status: "Downloaded",
    certificateNumber: "CERT-2024-1182",
    eventName: "AI & Cloud Summit 2024"
  },
  {
    id: "act-5",
    activity: "Verification",
    who: "Token: x99201a-invalid",
    token: "x99201a-invalid",
    at: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
    ip: "157.48.21.90",
    status: "Invalid",
    certificateNumber: "-",
    eventName: "-"
  }
];

function getActivityLogs() {
  try {
    const raw = localStorage.getItem(ACTIVITY_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(DEFAULT_ACTIVITIES));
      return DEFAULT_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ACTIVITIES;
  } catch {
    return DEFAULT_ACTIVITIES;
  }
}

function appendActivityLog(entry) {
  try {
    const current = getActivityLogs();
    const updated = [entry, ...current.filter(i => i.id !== entry.id)].slice(0, 150);
    localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("cms_activity_logged", { detail: entry }));
    return updated;
  } catch (err) {
    console.error("Failed to append activity", err);
    return [];
  }
}

function clearActivityLogs() {
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify([]));
  window.dispatchEvent(new CustomEvent("cms_activity_logged", { detail: null }));
}

function resetActivityLogs() {
  localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(DEFAULT_ACTIVITIES));
  window.dispatchEvent(new CustomEvent("cms_activity_logged", { detail: null }));
}

function formatAt(isoStr) {
  if (!isoStr) return "-";
  try {
    const d = new Date(isoStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch {
    return isoStr;
  }
}

function formatRelative(isoStr) {
  if (!isoStr) return "";
  try {
    const diff = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
    if (diff < 30) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "";
  }
}

function exportLogsCsv(logs) {
  const headers = ["Activity", "Who", "Token", "At", "IP", "Status", "CertificateNumber", "Event"];
  const rows = logs.map(l => [
    `"${(l.activity || "").replace(/"/g, '""')}"`,
    `"${(l.who || "").replace(/"/g, '""')}"`,
    `"${(l.token || "").replace(/"/g, '""')}"`,
    `"${(l.at || "").replace(/"/g, '""')}"`,
    `"${(l.ip || "").replace(/"/g, '""')}"`,
    `"${(l.status || "").replace(/"/g, '""')}"`,
    `"${(l.certificateNumber || "").replace(/"/g, '""')}"`,
    `"${(l.eventName || "").replace(/"/g, '""')}"`
  ]);
  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cms_activity_log_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportLogsJson(logs) {
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cms_activity_log_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* Certificate HTML & PDF Generator */
function downloadCertificateFile(cert, program, event) {
  const certNumber = cert.certificateNumber || "CERTIFICATE";
  const recipient = cert.recipientName || "Recipient";
  const progName = program?.name || "Certificate Program";
  const evName = event?.name || "Certificate Management System";
  const dateStr = cert.issuedDate || new Date().toISOString().split("T")[0];
  const token = cert.verificationToken || "VERIFIED-TOKEN";
  const verifyUrl = `${window.location.origin}/verify/${encodeURIComponent(token)}`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Certificate - ${recipient} - ${certNumber}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #0F172A; min-height: 100vh; display: grid; place-items: center; padding: 36px 16px; color: #0F172A; }
    .print-actions { position: fixed; top: 16px; right: 16px; display: flex; gap: 8px; z-index: 99; }
    .print-btn { background: #2563EB; color: #fff; border: 0; padding: 10px 18px; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer; box-shadow: 0 4px 14px rgba(37,99,235,0.4); }
    .cert-frame { width: 940px; max-width: 100%; background: #FFFFFF; border: 14px solid #1E293B; outline: 3px solid #2563EB; outline-offset: -8px; border-radius: 12px; padding: 56px 48px; position: relative; box-shadow: 0 25px 60px rgba(0,0,0,0.45); text-align: center; }
    .watermark { position: absolute; inset: 0; display: grid; place-items: center; opacity: 0.025; font-size: 80px; font-weight: 900; pointer-events: none; }
    .org-banner { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #2563EB; background: #EFF6FF; padding: 6px 16px; border-radius: 99px; margin-bottom: 24px; }
    h1 { font-family: 'Cinzel', serif; font-size: 38px; color: #0F172A; letter-spacing: 0.05em; margin-bottom: 6px; }
    .subtitle { font-size: 13px; text-transform: uppercase; letter-spacing: 0.22em; color: #64748B; margin-bottom: 28px; font-weight: 600; }
    .presentation { font-size: 15px; color: #64748B; margin-bottom: 12px; }
    .recipient { font-family: 'Cinzel', serif; font-size: 38px; font-weight: 700; color: #1E3A8A; margin: 8px 0 16px; border-bottom: 2px solid #E2E8F0; display: inline-block; padding: 0 36px 8px; }
    .achievement { font-size: 15px; line-height: 1.7; color: #334155; max-width: 660px; margin: 0 auto 32px; }
    .meta-table { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid #E2E8F0; border-bottom: 1px solid #E2E8F0; padding: 18px 0; margin-bottom: 32px; background: #F8FAFC; border-radius: 6px; }
    .meta-cell small { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; font-weight: 700; margin-bottom: 4px; }
    .meta-cell strong { font-size: 14px; color: #0F172A; font-family: 'Consolas', monospace; font-weight: 700; }
    .footer-row { display: flex; justify-content: space-between; align-items: center; padding: 0 12px; }
    .verified-pill { display: inline-flex; align-items: center; gap: 6px; background: #DCFCE7; color: #166534; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 99px; border: 1px solid #86EFAC; }
    .verify-link { font-size: 11px; color: #64748B; word-break: break-all; }
    @media print { .print-actions { display: none; } body { background: white; padding: 0; } .cert-frame { border-width: 8px; box-shadow: none; } }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
  <div class="cert-frame">
    <div class="watermark">CMS VERIFIED</div>
    <div class="org-banner">★ Certificate Management System · Central Verification ★</div>
    <h1>Certificate of Completion</h1>
    <div class="subtitle">Official Digital Credential</div>
    <p class="presentation">This certificate is awarded to</p>
    <div class="recipient">${recipient}</div>
    <p class="achievement">for successfully completing <strong>${progName}</strong> conducted as part of <strong>${evName}</strong>.</p>
    <div class="meta-table">
      <div class="meta-cell"><small>Certificate Number</small><strong>${certNumber}</strong></div>
      <div class="meta-cell"><small>Issue Date</small><strong>${dateStr}</strong></div>
      <div class="meta-cell"><small>Verification Token</small><strong>${token}</strong></div>
    </div>
    <div class="footer-row">
      <div class="verified-pill">✓ Tamper-Proof Verified</div>
      <div class="verify-link">Online check: ${verifyUrl}</div>
    </div>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Certificate_${recipient.replace(/[^a-zA-Z0-9]/g, "_")}_${certNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ── ActivityLog Component ───────────────────────────── */
function ActivityLog({ logs = [], currentIp = "", onClear, onReset }) {
  const [filterType, setFilterType] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedIp, setCopiedIp] = useState(null);

  const verificationCount = logs.filter(l => l.activity === "Verification").length;
  const downloadCount = logs.filter(l => l.activity === "Download Certificate").length;

  const filteredLogs = logs.filter(item => {
    if (filterType === "VERIFICATION" && item.activity !== "Verification") return false;
    if (filterType === "DOWNLOAD" && item.activity !== "Download Certificate") return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.activity || "").toLowerCase().includes(q) ||
      (item.who || "").toLowerCase().includes(q) ||
      (item.ip || "").toLowerCase().includes(q) ||
      (item.token || "").toLowerCase().includes(q) ||
      (item.status || "").toLowerCase().includes(q)
    );
  });

  const handleCopyIp = (ip) => {
    navigator.clipboard?.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  return (
    <section className="activity-log-card" id="activity-log">
      <div className="activity-header">
        <div className="activity-title-group">
          <div className="activity-icon-wrap">
            <Activity size={20} />
          </div>
          <div>
            <div className="activity-badge-line">
              <span className="live-dot" />
              <small>LIVE AUDIT TRAIL</small>
            </div>
            <h3>Activity Log</h3>
            <p>Real-time audit log of certificate verifications and downloads with IP tracking.</p>
          </div>
        </div>

        <div className="activity-header-meta">
          <div className="client-ip-pill" title="Your current IP detected by the verification system">
            <Globe size={13} />
            <span>Your IP:</span>
            <strong>{currentIp || "Detecting..."}</strong>
          </div>
          <div className="activity-actions">
            <button
              type="button"
              className="btn-tool"
              onClick={() => exportLogsCsv(logs)}
              title="Export Activity Log to CSV"
            >
              <FileSpreadsheet size={14} /> Export CSV
            </button>
            <button
              type="button"
              className="btn-tool secondary"
              onClick={onReset}
              title="Reset with sample activity records"
            >
              <RefreshCw size={14} /> Reset
            </button>
            <button
              type="button"
              className="btn-tool danger"
              onClick={onClear}
              title="Clear all activity logs"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="activity-controls">
        <div className="filter-tabs">
          <button
            type="button"
            className={`filter-tab ${filterType === "ALL" ? "active" : ""}`}
            onClick={() => setFilterType("ALL")}
          >
            All Activities <span className="tab-count">{logs.length}</span>
          </button>
          <button
            type="button"
            className={`filter-tab ${filterType === "VERIFICATION" ? "active" : ""}`}
            onClick={() => setFilterType("VERIFICATION")}
          >
            <Search size={13} /> Verifications <span className="tab-count">{verificationCount}</span>
          </button>
          <button
            type="button"
            className={`filter-tab ${filterType === "DOWNLOAD" ? "active" : ""}`}
            onClick={() => setFilterType("DOWNLOAD")}
          >
            <Download size={13} /> Certificate Downloads <span className="tab-count">{downloadCount}</span>
          </button>
        </div>

        <div className="activity-search-wrap">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search by Who, Token, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="activity-table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Who</th>
              <th>At</th>
              <th>IP Address</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-logs-cell">
                  <div className="empty-logs">
                    <Activity size={28} />
                    <strong>No activity records found</strong>
                    <p>
                      {searchQuery
                        ? "No activity matched your search term."
                        : "Verify a certificate or download one to create a new activity entry."}
                    </p>
                    {searchQuery && (
                      <button
                        type="button"
                        className="btn-tool"
                        onClick={() => setSearchQuery("")}
                      >
                        Clear search filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const isVerification = log.activity === "Verification";
                const isDownload = log.activity === "Download Certificate";
                const isValid = log.status === "Valid";
                const isDownloaded = log.status === "Downloaded";
                const isInvalid = log.status === "Invalid";
                const isRevoked = log.status === "Revoked";

                return (
                  <tr key={log.id} className="activity-row">
                    {/* Activity Column */}
                    <td>
                      <div className="activity-cell">
                        <span
                          className={`activity-badge ${
                            isVerification ? "badge-verification" : "badge-download"
                          }`}
                        >
                          {isVerification ? (
                            <>
                              <Search size={13} /> Verification
                            </>
                          ) : (
                            <>
                              <Download size={13} /> Download Certificate
                            </>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Who Column */}
                    <td>
                      <div className="who-cell">
                        <strong className="who-name">{log.who || "Unknown"}</strong>
                        {log.token && (
                          <span className="who-sub mono" title={`Token: ${log.token}`}>
                            Token: {log.token}
                          </span>
                        )}
                        {log.eventName && log.eventName !== "-" && (
                          <span className="who-event">{log.eventName}</span>
                        )}
                      </div>
                    </td>

                    {/* At Column */}
                    <td>
                      <div className="at-cell">
                        <span className="at-formatted">{formatAt(log.at)}</span>
                        <small className="at-relative">{formatRelative(log.at)}</small>
                      </div>
                    </td>

                    {/* IP Column */}
                    <td>
                      <div className="ip-cell">
                        <span
                          className="ip-badge mono"
                          onClick={() => handleCopyIp(log.ip)}
                          title="Click to copy IP address"
                        >
                          <Globe size={11} /> {log.ip || "127.0.0.1"}
                          {copiedIp === log.ip ? (
                            <Check size={11} className="copied-icon" />
                          ) : (
                            <Copy size={11} className="copy-icon" />
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td>
                      <span
                        className={`status-pill ${
                          isValid
                            ? "status-valid"
                            : isDownloaded
                            ? "status-downloaded"
                            : isRevoked
                            ? "status-revoked"
                            : isInvalid
                            ? "status-invalid"
                            : "status-neutral"
                        }`}
                      >
                        <span className="status-dot" />
                        {log.status || "Completed"}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="activity-footer">
        <span>Showing {filteredLogs.length} of {logs.length} logged activities</span>
        <span className="audit-note">All actions cryptographically timestamped and logged for security compliance.</span>
      </div>
    </section>
  );
}

/* ── AdminActivityPage Component (/admin/activity & /activity) ─────── */
function AdminActivityPage() {
  const [adminKey, setAdminKey] = useState(
    () => sessionStorage.getItem("cms_admin_key") || ""
  );
  const [inputKey, setInputKey] = useState(
    () => sessionStorage.getItem("cms_admin_key") || ""
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentIp, setCurrentIp] = useState("Detecting...");
  const navigate = useNavigate();

  useEffect(() => {
    detectClientIp().then((ip) => setCurrentIp(ip));
    const saved = sessionStorage.getItem("cms_admin_key");
    if (saved) {
      fetchLogs(saved);
    }
  }, []);

  async function fetchLogs(keyToUse) {
    const key = (keyToUse !== undefined ? keyToUse : adminKey).trim();
    if (!key) return;
    setLoading(true);
    setAuthError("");
    try {
      const res = await fetch(`${API}/admin/activity`, {
        headers: { "x-admin-key": key },
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        throw new Error("Invalid Admin Import Key. Access denied.");
      }
      if (!res.ok) {
        throw new Error(`Failed to load activity logs from database (HTTP ${res.status}).`);
      }
      const data = await res.json();
      setLogs(data.activities || []);
      setIsAuthenticated(true);
      setAdminKey(key);
      sessionStorage.setItem("cms_admin_key", key);
    } catch (err) {
      setAuthError(err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (!inputKey.trim()) return;
    fetchLogs(inputKey.trim());
  }

  function handleLogout() {
    sessionStorage.removeItem("cms_admin_key");
    setAdminKey("");
    setInputKey("");
    setIsAuthenticated(false);
    setLogs([]);
  }

  async function handleClearLogs() {
    if (
      !window.confirm(
        "Are you sure you want to permanently clear all activity records from the live database?"
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/activity`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      });
      if (!res.ok) throw new Error("Failed to clear activity logs.");
      setLogs([]);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const total = logs.length;
  const verifications = logs.filter((l) => l.activity === "Verification").length;
  const downloads = logs.filter((l) => l.activity === "Download Certificate").length;
  const uniqueIps = new Set(logs.map((l) => l.ip)).size;

  return (
    <main className="activity-page admin-page">
      <div className="verify-topline">
        <button className="home-link" onClick={() => navigate("/")}>
          <ArrowLeft size={14} /> Home
        </button>
        <span className="verify-brand">
          <img src="/icon.png" alt="" /> Certificate Management System
        </span>
      </div>

      {/* Admin Section Tabs */}
      <div className="admin-nav-tabs">
        <Link to="/admin/import" className="admin-nav-tab">
          <FileUp size={15} /> Import Packages
        </Link>
        <span className="admin-nav-tab active">
          <Activity size={15} /> Activity Log (Live DB)
        </span>
      </div>

      {!isAuthenticated ? (
        <section className="admin-lock-card">
          <div className="lock-icon-wrap">
            <LockKeyhole size={28} />
          </div>
          <div className="eyebrow">ADMIN ACCESS RESTRICTED</div>
          <h2>Unlock Activity Audit Log</h2>
          <p>
            Security authentication required. Please enter your <strong>Admin Import Key</strong> to view the live database activity log.
          </p>

          <form onSubmit={handleLogin} className="lock-form">
            <label htmlFor="adminKeyInput">Admin Import Key</label>
            <div className="lock-input-row">
              <div className="input-wrap">
                <LockKeyhole size={16} />
                <input
                  id="adminKeyInput"
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="Enter ADMIN_IMPORT_KEY"
                  autoFocus
                />
              </div>
              <button disabled={!inputKey.trim() || loading}>
                {loading ? "Checking..." : "Unlock Log"} <ArrowRight size={16} />
              </button>
            </div>
            {authError && (
              <div className="lock-error">
                <ShieldAlert size={15} /> <span>{authError}</span>
              </div>
            )}
          </form>
        </section>
      ) : (
        <>
          <section className="activity-page-hero">
            <div className="hero-icon activity-hero-icon">
              <Activity size={26} />
            </div>
            <div className="admin-status-badge">
              <CheckCircle2 size={13} />
              <span>AUTHENTICATED VIA ADMIN IMPORT KEY</span>
            </div>
            <h1>Live Activity &amp; Audit Trail</h1>
            <p>
              Direct real-time query of the live Neon PostgreSQL database (table: <code>activity_logs</code>).
            </p>

            <div className="admin-quick-actions">
              <button
                type="button"
                className="btn-tool"
                onClick={() => fetchLogs()}
                disabled={loading}
              >
                <RefreshCw size={13} className={loading ? "spin" : ""} /> Refresh from DB
              </button>
              <button
                type="button"
                className="btn-tool danger"
                onClick={handleLogout}
              >
                <LockKeyhole size={13} /> Lock Session
              </button>
            </div>

            {/* Stats ribbon */}
            <div className="activity-stats-ribbon">
              <div className="act-stat-card">
                <span className="act-stat-num">{total}</span>
                <span className="act-stat-label">Total Activities</span>
              </div>
              <div className="act-stat-card">
                <span className="act-stat-num">{verifications}</span>
                <span className="act-stat-label">Verifications</span>
              </div>
              <div className="act-stat-card">
                <span className="act-stat-num">{downloads}</span>
                <span className="act-stat-label">Downloads</span>
              </div>
              <div className="act-stat-card">
                <span className="act-stat-num">{uniqueIps}</span>
                <span className="act-stat-label">Unique IP Addresses</span>
              </div>
            </div>
          </section>

          <ActivityLog
            logs={logs}
            currentIp={currentIp}
            onClear={handleClearLogs}
            onReset={() => fetchLogs()}
          />
        </>
      )}
    </main>
  );
}

/* ── Public VerifyPage (NO public activity log rendered) ──────────────── */
function VerifyPage() {
  const routeToken = tokenFromPath();
  const [input, setInput] = useState(routeToken || "");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(Boolean(routeToken));
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [clientIp, setClientIp] = useState("Detecting...");
  const navigate = useNavigate();

  useEffect(() => {
    detectClientIp().then((ip) => setClientIp(ip));
  }, []);

  async function verify(value) {
    const token = value.trim();
    if (!token) return;
    setBusy(true);
    setError("");
    setResult(null);
    setInput(token);

    try {
      const response = await fetch(`${API}/public/verify/${encodeURIComponent(token)}`);
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Certificate could not be verified.");
      setResult(body);
      setToastMessage(`✓ Verification successful for ${body.certificate?.recipientName || token}`);
      setTimeout(() => setToastMessage(""), 4500);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload(res) {
    if (!res || !res.certificate) return;
    const cert = res.certificate;
    downloadCertificateFile(cert, res.program, res.event);

    const ip = clientIp && clientIp !== "Detecting..." ? clientIp : await detectClientIp();
    // Record download event in live database
    fetch(`${API}/public/activity/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        who: cert.recipientName || "Recipient",
        token: cert.verificationToken || input,
        certificateNumber: cert.certificateNumber || "-",
        eventName: res.event?.name || res.program?.name || "-",
        ip: ip,
      }),
    }).catch(() => {});

    setToastMessage(`✓ Official certificate downloaded for ${cert.recipientName}`);
    setTimeout(() => setToastMessage(""), 5000);
  }

  useEffect(() => {
    if (routeToken) verify(routeToken);
  }, [routeToken]);

  return (
    <main className="verify-page verify-token-page">
      <div className="verify-topline">
        <button className="home-link" onClick={() => navigate("/")}>
          <ArrowLeft size={14} /> Home
        </button>
        <span className="verify-brand">
          <img src="/icon.png" alt="" /> Certificate Management System
        </span>
      </div>

      <section className="hero">
        <div className="hero-icon">
          <ShieldAlert size={24} />
        </div>
        <h1>Verify Certificate</h1>
        <p>Check whether a certificate was issued by this Certificate Management System.</p>
      </section>

      <section className="search-panel">
        <div className="search-heading">
          <h2>Certificate Verification</h2>
          <p>Enter the verification token shown on the certificate or scan its QR code.</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            navigate(`/verify/${encodeURIComponent(input.trim())}`);
          }}
        >
          <label htmlFor="token">Verification Token</label>
          <div className="search-row">
            <div className="input-wrap">
              <Search size={18} />
              <input
                id="token"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Example: a8f72c91e4f"
                autoComplete="off"
              />
            </div>
            <button disabled={!input.trim()}>
              Verify <CheckCircle2 size={16} />
            </button>
          </div>
        </form>
      </section>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="activity-toast">
          <ShieldCheck size={18} />
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage("")}>✕</button>
        </div>
      )}

      {!routeToken && !busy && !result && !error && (
        <div className="initial-state">
          <Search size={24} />
          <h2>Enter a Verification Token</h2>
          <p>The verification result and certificate information will appear here.</p>
        </div>
      )}

      {busy && (
        <div className="initial-state">
          <h2>Verifying certificate...</h2>
          <p>Please wait while we check the record.</p>
        </div>
      )}

      {error && !busy && (
        <InvalidResult
          token={input}
          error={error}
          onClear={() => {
            setInput("");
            setError("");
            navigate("/verify");
          }}
        />
      )}

      {result && !busy && (
        <Result result={result} onDownload={handleDownload} />
      )}
    </main>
  );
}

function Result({ result, onDownload }) {
  const valid = result.verified;
  const revoked = result.certificate?.status === "REVOKED";
  return (
    <section className={`result ${valid ? "valid" : "revoked"}`}>
      <div className="result-heading">
        <div className="status-icon">
          {valid ? <CheckCircle2 /> : <CircleAlert />}
        </div>
        <div className="result-heading-text">
          <div className="eyebrow">
            {valid
              ? "VERIFICATION SUCCESSFUL"
              : revoked
              ? "CERTIFICATE REVOKED"
              : "VERIFICATION FAILED"}
          </div>
          <h2>
            {valid
              ? "Valid Certificate"
              : revoked
              ? "Certificate Revoked"
              : "Certificate Could Not Be Verified"}
          </h2>
          <p>
            {valid
              ? "This certificate exists in the Certificate Management System and is authentic."
              : "Do not treat this certificate as verified."}
          </p>
        </div>

        {valid && (
          <div className="result-download-action">
            <button
              type="button"
              className="btn-download-cert"
              onClick={() => onDownload && onDownload(result)}
              title="Download official certificate copy"
            >
              <Download size={15} /> Download Certificate
            </button>
          </div>
        )}
      </div>

      {result.certificate && (
        <>
          <div className="token-strip">
            <span>Verification Token</span>
            <strong className="mono">
              {result.certificate.verificationToken || "Provided token"}
            </strong>
          </div>
          <div className="detail-grid">
            <Detail label="Participant" value={result.certificate.recipientName} />
            <Detail label="Certificate Number" value={result.certificate.certificateNumber} mono />
            <Detail label="Program" value={result.program?.name} />
            <Detail label="Event" value={result.event?.name} />
            <Detail label="Issued On" value={result.certificate.issuedDate} />
            <Detail label="Status" value={result.certificate.status} />
          </div>

          {valid && (
            <div className="cert-download-banner">
              <div className="cdb-info">
                <Award size={20} className="cdb-icon" />
                <div>
                  <strong>Official Digital Certificate Ready</strong>
                  <p>Generate a tamper-proof digital copy with full credential details and QR verification link.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-download-cert secondary-style"
                onClick={() => onDownload && onDownload(result)}
              >
                <Download size={15} /> Download Certificate (HTML / PDF)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function Detail({ label, value, mono }) {
  return (
    <div className="detail">
      <span>{label}</span>
      <strong className={mono ? "mono" : ""}>{value || "-"}</strong>
    </div>
  );
}

function InvalidResult({ token, error, onClear }) {
  return (
    <section className="invalid-card">
      <XCircle size={38} />
      <span className="invalid-status">Verification Failed</span>
      <h2>Certificate Could Not Be Verified</h2>
      <p>No valid certificate record was found for the Verification Token:</p>
      <strong className="invalid-token mono">{token}</strong>
      <div className="warning">
        <ShieldAlert size={19} />
        <div>
          <strong>Do not treat this certificate as verified.</strong>
          <p>
            The verification token may be incorrect, or the certificate may not have been issued
            through this Certificate Management System.
          </p>
        </div>
      </div>
      <div className="warning unauthorized">
        <ShieldAlert size={19} />
        <div>
          <strong>Suspected unauthorized certificate?</strong>
          <p>
            If this certificate appears to use an organization's name, event, logo, signature, or
            identity without authorization, contact the issuing organization or system administrator
            for further verification.
          </p>
        </div>
      </div>
      <button className="try-again" onClick={onClear}>
        Try Another Certificate
      </button>
      <p className="backend-error">{error}</p>
    </section>
  );
}

function ImportPage() {
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("local-dev-import-key");
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(path) {
    if (!file) return setMessage("Choose a version 3 JSON package first.");
    setBusy(true);
    setMessage("");
    let text;
    try {
      text = await file.text();
      JSON.parse(text);
    } catch (e) {
      setBusy(false);
      return setMessage("The selected file is not valid JSON.");
    }
    try {
      const endpoint = path ? `${API}/admin/import/${path}` : `${API}/admin/import`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "x-admin-key": key, "Content-Type": "application/json" },
        body: text,
      });
      let body = {};
      const ct = response.headers.get("content-type");
      if (ct && ct.includes("application/json")) {
        try {
          body = await response.json();
        } catch (e) {
          throw new Error("Invalid JSON response from server.");
        }
      } else {
        await response.text();
        if (response.status === 405)
          throw new Error("405: API method/routing configuration is incorrect.");
        if (response.status === 401)
          throw new Error("401: Admin authentication failed.");
        if (response.status >= 500)
          throw new Error(`${response.status}: Server error while processing the import.`);
        if (!response.ok)
          throw new Error(`HTTP ${response.status}: Unexpected response format.`);
      }
      if (!response.ok) {
        if (response.status === 401) throw new Error("401: Admin authentication failed.");
        if (response.status === 409) throw new Error("409: Import conflicts detected.");
        if (response.status === 400)
          throw new Error(body.message || body.errors?.join(" ") || "400: Validation or signature error.");
        throw new Error(body.message || body.errors?.join(" ") || `HTTP ${response.status}: Request failed.`);
      }
      setPreview(body);
      setMessage(
        path === "preview"
          ? "Package validated. Review the counts before importing."
          : "Import completed successfully."
      );
    } catch (err) {
      setMessage(
        err.name === "TypeError" && err.message === "Failed to fetch"
          ? "Unable to reach the verification server."
          : err.message
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-page">
      {/* Admin Section Tabs */}
      <div className="admin-nav-tabs">
        <span className="admin-nav-tab active">
          <FileUp size={15} /> Import Packages
        </span>
        <Link to="/admin/activity" className="admin-nav-tab">
          <Activity size={15} /> Activity Log (Live DB)
        </Link>
      </div>

      <div className="admin-heading">
        <div className="eyebrow">ADMIN WORKSPACE</div>
        <h1>Import verification data</h1>
        <p>
          Upload a portable version 3 package. Local IDs are ignored; the portal creates its own
          relationships.
        </p>
      </div>
      <section className="import-card">
        <div className="upload-zone">
          <FileUp size={26} />
          <strong>{file ? file.name : "Choose a JSON export"}</strong>
          <span>Signed version 3 packages only · up to 10 MB</span>
          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
        </div>
        <label>
          Admin import key
          <input
            value={key}
            onChange={(event) => setKey(event.target.value)}
            type="password"
          />
        </label>
        <div className="button-row">
          <button className="secondary" onClick={() => send("preview")} disabled={busy}>
            <Search size={16} /> Verify &amp; Preview
          </button>
          <button
            onClick={() => send("")}
            disabled={busy || !preview || preview.status === "CONFLICTS"}
          >
            <LockKeyhole size={16} /> Commit import
          </button>
        </div>
        {preview?.security && (
          <div className="security-ok">
            <CheckCircle2 size={18} />
            <div>
              <strong>Signature verified</strong>
              <span>{preview.security.algorithm} · {preview.security.keyId} · AUTHORIZED EXPORT</span>
            </div>
          </div>
        )}
        {message && <div className="notice">{message}</div>}
      </section>
      {preview?.summary && (
        <section className="summary">
          <div className="eyebrow">IMPORT SUMMARY</div>
          <div className="summary-grid">
            {Object.entries(preview.summary).map(([label, value]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</span>
              </div>
            ))}
          </div>
          {preview.conflicts?.length > 0 && (
            <pre>{JSON.stringify(preview.conflicts, null, 2)}</pre>
          )}
        </section>
      )}
    </main>
  );
}

/* ─────────────────────────────────────────────────────────
   About / Verification Policy Page
───────────────────────────────────────────────────────── */
function AboutPage() {
  const sections = [
    { id: "about", icon: <Shield size={20} />, label: "About CMS" },
    { id: "how-it-works", icon: <Zap size={20} />, label: "How It Works" },
    { id: "authorized-orgs", icon: <Users size={20} />, label: "Authorized Organizations" },
    { id: "what-verified-means", icon: <CheckCircle2 size={20} />, label: "What Verified Means" },
    { id: "unauthorized", icon: <ShieldAlert size={20} />, label: "Unauthorized Certificates" },
    { id: "responsibility", icon: <FileCheck size={20} />, label: "Responsibility" },
    { id: "status-changes", icon: <RefreshCw size={20} />, label: "Status Changes" },
    { id: "privacy", icon: <LockKeyhole size={20} />, label: "Privacy" },
    { id: "support", icon: <Info size={20} />, label: "Support" },
    { id: "legal", icon: <Award size={20} />, label: "Legal & Copyright" },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-badge"><Shield size={14} /> Verification Policy</div>
        <h1>CMS Central Verification Portal</h1>
        <p className="about-hero-sub">
          A centralized infrastructure for certificate verification and publication,
          operated by <strong>VS Freedom Solutions</strong>.
        </p>
        <div className="about-hero-notice">
          <CircleAlert size={18} />
          <span>
            <strong>CMS does not issue certificates.</strong> Certificates are issued by the
            respective organizations that submitted them. CMS provides the verification
            infrastructure only.
          </span>
        </div>
      </section>

      <div className="about-layout">
        {/* Sidebar Nav */}
        <aside className="about-sidebar">
          <div className="about-sidebar-inner">
            <div className="about-sidebar-label">On this page</div>
            {sections.map((s) => (
              <button key={s.id} className="about-nav-item" onClick={() => scrollTo(s.id)}>
                <span className="about-nav-icon">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="about-content">

          {/* 1 — About */}
          <section id="about" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon"><Shield size={22} /></div>
              <div>
                <div className="about-section-eyebrow">Who We Are</div>
                <h2>About the CMS Verification Portal</h2>
              </div>
            </div>
            <div className="about-section-body">
              <p>
                The <strong>Certificate Management System (CMS) Central Verification Portal</strong> is
                a centralized verification and publication platform operated by{" "}
                <strong>VS Freedom Solutions</strong>. It serves as a trusted infrastructure channel
                through which authorized organizations can submit certificate records for secure
                online verification and publication.
              </p>
              <p>
                CMS is <strong>not</strong> a certificate-issuing authority, educational institution,
                event organizer, awarding body, or any organization that creates or awards certificates.
                The organizations whose names appear on certificates are the actual issuers and sole
                authorities over those credentials.
              </p>
              <div className="about-highlight-box">
                <div className="about-highlight-icon"><Globe size={18} /></div>
                <div>
                  <strong>Operated by VS Freedom Solutions</strong>
                  <p>VS Freedom Solutions maintains this portal as a service to authorized
                  organizations seeking a secure, standardized, and publicly accessible verification channel.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2 — How It Works */}
          <section id="how-it-works" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon blue"><Zap size={22} /></div>
              <div>
                <div className="about-section-eyebrow">The Process</div>
                <h2>How Verification Works</h2>
              </div>
            </div>
            <div className="about-section-body">
              <div className="about-steps">
                <div className="about-step">
                  <div className="about-step-num">01</div>
                  <div>
                    <strong>Organization Submits Records</strong>
                    <p>An authorized organization submits certificate records through an authenticated,
                    secured import channel using a unique organization key.</p>
                  </div>
                </div>
                <div className="about-step">
                  <div className="about-step-num">02</div>
                  <div>
                    <strong>CMS Publishes & Assigns Tokens</strong>
                    <p>CMS stores the records and generates unique, tamper-resistant verification tokens
                    for each certificate entry.</p>
                  </div>
                </div>
                <div className="about-step">
                  <div className="about-step-num">03</div>
                  <div>
                    <strong>Anyone Can Verify</strong>
                    <p>Any member of the public, employer, or institution can enter a certificate number
                    or token on this portal to instantly confirm authenticity.</p>
                  </div>
                </div>
                <div className="about-step">
                  <div className="about-step-num">04</div>
                  <div>
                    <strong>Result is Authoritative</strong>
                    <p>The verification result reflects the exact data submitted by the issuing
                    organization. CMS does not modify, interpret, or supplement this data.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3 — Authorized Organizations */}
          <section id="authorized-orgs" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon green"><Users size={22} /></div>
              <div>
                <div className="about-section-eyebrow">Access Control</div>
                <h2>Authorized Organizations</h2>
              </div>
            </div>
            <div className="about-section-body">
              <p>
                Only organizations that have entered into a formal agreement with VS Freedom Solutions
                and have been issued a valid organizational access credential are permitted to submit
                certificate records to this portal.
              </p>
              <p>
                Each organization is responsible for the accuracy, completeness, and legitimacy of
                the records they submit. CMS performs technical validation of record format and
                integrity but does not independently verify the underlying certificates.
              </p>
              <div className="about-callout warn">
                <ShieldAlert size={18} />
                <span>Authorized organization certificates carry a digital signature in the
                export file. The presence of a valid signature confirms that the data was
                submitted through an authorized channel.</span>
              </div>
            </div>
          </section>

          {/* 4 — What Verified Means */}
          <section id="what-verified-means" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon green"><CheckCircle2 size={22} /></div>
              <div>
                <div className="about-section-eyebrow">Verification Scope</div>
                <h2>What a Verified Status Means</h2>
              </div>
            </div>
            <div className="about-section-body">
              <div className="about-verdict-grid">
                <div className="about-verdict verified">
                  <div className="about-verdict-icon"><CheckCircle2 size={20} /></div>
                  <strong>"Verified" means:</strong>
                  <ul>
                    <li>The certificate record exists in the CMS database.</li>
                    <li>It was submitted by an organization authorized to use this portal.</li>
                    <li>The record has not been revoked or flagged at the time of query.</li>
                  </ul>
                </div>
                <div className="about-verdict not-found">
                  <div className="about-verdict-icon"><XCircle size={20} /></div>
                  <strong>"Not Found" means:</strong>
                  <ul>
                    <li>No matching record exists in the CMS database.</li>
                    <li>The certificate may not have been submitted by the issuing organization.</li>
                    <li>The certificate number may be incorrect or the certificate may be fraudulent.</li>
                  </ul>
                </div>
              </div>
              <p className="about-note">
                A verified result does <em>not</em> constitute an endorsement of the certificate holder
                or the issuing organization by VS Freedom Solutions or CMS.
              </p>
            </div>
          </section>

          {/* 5 — Unauthorized Certificates */}
          <section id="unauthorized" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon red"><ShieldAlert size={22} /></div>
              <div>
                <div className="about-section-eyebrow">Fraud Prevention</div>
                <h2>Unauthorized or Fraudulent Certificates</h2>
              </div>
            </div>
            <div className="about-section-body">
              <p>
                CMS does not recognize, publish, or verify certificates that were not submitted
                through an authorized organizational channel. Any certificate claiming to be
                verifiable through this portal that does not return a verified result should be
                treated with caution.
              </p>
              <p>
                If you suspect a certificate presented to you is fraudulent or has been fabricated,
                please report it through the official support channel listed in the Support section below.
                Do not rely on visual appearance alone — always verify through this portal.
              </p>
              <div className="about-callout danger">
                <CircleAlert size={18} />
                <span>
                  <strong>Caution:</strong> Forged certificates are a serious matter. If a certificate
                  cannot be verified through this portal and the issuer claims it is legitimate,
                  contact the issuing organization directly through verified official channels.
                </span>
              </div>
            </div>
          </section>

          {/* 6 — Responsibility */}
          <section id="responsibility" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon"><FileCheck size={22} /></div>
              <div>
                <div className="about-section-eyebrow">Liability Scope</div>
                <h2>Responsibility & Disclaimer</h2>
              </div>
            </div>
            <div className="about-section-body">
              <p>
                CMS and VS Freedom Solutions are responsible solely for the technical operation
                of this verification portal — including uptime, data integrity of submitted records,
                and the accuracy of verification responses relative to stored data.
              </p>
              <p>
                CMS and VS Freedom Solutions bear <strong>no responsibility</strong> for:
              </p>
              <ul className="about-list">
                <li>The content, validity, or legitimacy of the certificates submitted by organizations.</li>
                <li>Actions taken by any party based on a verification result.</li>
                <li>Certificates issued outside the CMS platform and not submitted for verification.</li>
                <li>Any loss, damage, or consequence arising from reliance on verification results.</li>
              </ul>
            </div>
          </section>

          {/* 7 — Status Changes */}
          <section id="status-changes" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon blue"><RefreshCw size={22} /></div>
              <div>
                <div className="about-section-eyebrow">Dynamic Records</div>
                <h2>Status Changes & Revocation</h2>
              </div>
            </div>
            <div className="about-section-body">
              <p>
                Certificate records published on this portal may be updated or revoked by the
                issuing organization at any time. A certificate that is verified today may reflect
                a different status in the future if the issuing organization requests a change.
              </p>
              <p>
                Common reasons for status changes include: administrative correction, revocation
                for academic or disciplinary reasons, expiration of the credential, or legal order.
                CMS processes such requests only when they originate from the authorized
                organizational channel.
              </p>
            </div>
          </section>

          {/* 8 — Privacy */}
          <section id="privacy" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon"><LockKeyhole size={22} /></div>
              <div>
                <div className="about-section-eyebrow">Data Handling</div>
                <h2>Privacy & Data Policy</h2>
              </div>
            </div>
            <div className="about-section-body">
              <p>
                CMS collects and stores only the certificate data submitted by authorized organizations.
                Verification queries made on this portal are logged for security and audit purposes
                including the certificate number queried, timestamp, and anonymized network information.
              </p>
              <p>
                CMS does not sell, share, or disclose query or certificate data to third parties
                except under the following conditions:
              </p>
              <ul className="about-list">
                <li>When required by a competent legal or regulatory authority through an appropriate
                official and authorized channel, subject to applicable law.</li>
                <li>When necessary to investigate fraud or abuse of this platform.</li>
                <li>When requested by the issuing organization for records they submitted.</li>
              </ul>
              <div className="about-callout info">
                <LockKeyhole size={18} />
                <span>All data in transit is encrypted. Certificate records are stored securely
                and access is restricted to authorized personnel only.</span>
              </div>
            </div>
          </section>

          {/* 9 — Support */}
          <section id="support" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon blue"><Info size={22} /></div>
              <div>
                <div className="about-section-eyebrow">Get Help</div>
                <h2>Support & Contact</h2>
              </div>
            </div>
            <div className="about-section-body">
              <p>
                For issues related to a specific certificate — including discrepancies, revocation
                requests, or fraudulent certificates — please contact the issuing organization
                directly using their official published contact details.
              </p>
              <p>
                For issues related to the <em>operation of this portal</em> — such as a verified
                certificate not displaying correctly, or to report suspected portal abuse — contact
                VS Freedom Solutions through the official support channel.
              </p>
              <div className="about-highlight-box">
                <div className="about-highlight-icon"><Globe size={18} /></div>
                <div>
                  <strong>VS Freedom Solutions — Portal Support</strong>
                  <p>Operated by VS Freedom Solutions. Queries related to certificate content must
                  be directed to the respective issuing organization.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 10 — Legal & Copyright */}
          <section id="legal" className="about-section">
            <div className="about-section-header">
              <div className="about-section-icon"><Award size={22} /></div>
              <div>
                <div className="about-section-eyebrow">Legal Notice</div>
                <h2>Copyright & Legal</h2>
              </div>
            </div>
            <div className="about-section-body">
              <p>
                The CMS Central Verification Portal, its software, design, branding, and
                operational infrastructure are the intellectual property of{" "}
                <strong>VS Freedom Solutions</strong>. All rights reserved.
              </p>
              <p>
                Unauthorized reproduction, scraping, automated querying beyond reasonable
                personal use, or any attempt to circumvent the access controls of this portal
                is strictly prohibited and may result in legal action.
              </p>
              <p>
                The certificate data published on this portal remains the intellectual property
                and sole responsibility of the respective issuing organizations. CMS acts only
                as a technical intermediary.
              </p>
              <div className="about-legal-badge">
                <span>&#169; {new Date().getFullYear()} VS Freedom Solutions — CMS Central Verification Portal</span>
                <span>All rights reserved.</span>
              </div>
            </div>
          </section>

        </div>{/* /about-content */}
      </div>{/* /about-layout */}

      {/* CTA */}
      <section className="about-cta">
        <div className="about-cta-inner">
          <ShieldCheck size={32} />
          <h2>Ready to verify a certificate?</h2>
          <p>Enter a certificate number or scan a QR code to instantly check authenticity.</p>
          <Link to="/verify" className="nav-cta" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 15, padding: "14px 28px" }}>
            Verify Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/verify/:verificationToken" element={<VerifyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/activity" element={<AdminActivityPage />} />
        <Route path="/activity" element={<AdminActivityPage />} />
        <Route path="/admin/import" element={<ImportPage />} />
      </Routes>
    </Shell>
  );
}
