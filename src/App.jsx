import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleAlert, FileUp, LockKeyhole, Search, ShieldAlert, XCircle, Award, BarChart3, CalendarDays, Files, Play, Sparkles } from "lucide-react";

const API = import.meta.env.VITE_CENTRAL_API_URL || "/api/v1";
const tokenFromPath = () => useParams().verificationToken;

function Shell({ children }) {
  return <div className="app-shell"><header className="topbar"><Link to="/verify" className="brand"><img src="/icon.png" alt="Certificate Management System" /><span><strong>Certificate Management System</strong><small>Central Verification Portal</small></span></Link><nav><Link to="/verify">Verify</Link><Link to="/admin/import">Admin import</Link></nav></header>{children}<footer>Certificate Management System · Central verification portal</footer></div>;
}

function HomePage() {
  return <main className="home-page"><section className="home-hero"><div className="hero-copy"><div className="eyebrow"><Sparkles size={13} /> CERTIFICATE MANAGEMENT SYSTEM</div><h1>Every certificate.<br /><em>One trusted story.</em></h1><p>Design events, manage programs, issue certificates, and give every recipient a verification experience they can trust.</p><div className="home-actions"><Link className="primary-action" to="/verify">Verify a certificate <ArrowRight size={17} /></Link><Link className="text-action" to="/admin/import">Open admin import <ArrowRight size={15} /></Link></div><div className="trust-line"><span><CheckCircle2 size={15} /> Token-based verification</span><span><ShieldAlert size={15} /> Privacy-first public results</span></div></div><div className="hero-snapshot"><div className="snapshot-window"><div className="window-bar"><span /><span /><span /><b>Certificate overview</b></div><div className="snapshot-body"><div className="snapshot-side"><div className="mini-logo"><img src="/icon.png" alt="" /></div><i /><i /><i /><i /></div><div className="snapshot-main"><div className="mini-top"><span>Good morning, admin</span><strong>+ Create event</strong></div><div className="metric-row"><div><small>Total certificates</small><b>1,248</b><span>↗ 18.4%</span></div><div><small>Verified this month</small><b>876</b><span>↗ 12.8%</span></div></div><div className="chart-card"><div><small>Issuance activity</small><b>Certificates generated</b></div><div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div></div></div></div></div></div></section><section className="snapshots-section"><div className="section-heading"><div><div className="eyebrow">A CLEARER WORKFLOW</div><h2>Built for the whole certificate journey.</h2></div><p>From the first event to the final scan, the CMS keeps your records organized and your public verification simple.</p></div><div className="snapshot-grid"><Snapshot icon={<CalendarDays />} title="Events & programs" text="Keep schedules, venues, coordinators, and participant requirements in one place." tone="blue" /><Snapshot icon={<Award />} title="Certificate generation" text="Create consistent, professional certificates with reusable templates and QR-ready tokens." tone="slate" /><Snapshot icon={<BarChart3 />} title="Live oversight" text="See issuance activity, statuses, and verification outcomes without spreadsheet drift." tone="green" /></div></section><section className="cta-band"><div><div className="eyebrow">READY WHEN YOU ARE</div><h2>Make every award easy to trust.</h2></div><Link className="primary-action" to="/verify">Check a certificate <ArrowRight size={17} /></Link></section></main>;
}

function Snapshot({ icon, title, text, tone }) {
  return <article className={`feature-snapshot ${tone}`}><div className="feature-icon">{icon}</div><div className="feature-preview"><div className="preview-line wide" /><div className="preview-line" /><div className="preview-grid"><span /><span /><span /></div></div><h3>{title}</h3><p>{text}</p></article>;
}

function VerifyPage() {
  const routeToken = tokenFromPath();
  const [input, setInput] = useState(routeToken || "");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(Boolean(routeToken));
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function verify(value) {
    const token = value.trim(); if (!token) return;
    setBusy(true); setError(""); setResult(null); setInput(token);
    try { const response = await fetch(`${API}/public/verify/${encodeURIComponent(token)}`); const body = await response.json(); if (!response.ok) throw new Error(body.message || "Certificate could not be verified."); setResult(body); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  useEffect(() => { if (routeToken) verify(routeToken); }, [routeToken]);
  return <main className="verify-page verify-token-page"><div className="verify-topline"><button className="home-link" onClick={() => navigate("/verify")}><ArrowLeft size={14} /> Home</button><span className="verify-brand"><img src="/icon.png" alt="" /> Certificate Management System</span></div><section className="hero"><div className="hero-icon"><ShieldAlert size={24} /></div><h1>Verify Certificate</h1><p>Check whether a certificate was issued by this Certificate Management System.</p></section><section className="search-panel"><div className="search-heading"><h2>Certificate Verification</h2><p>Enter the verification token shown on the certificate or scan its QR code.</p></div><form onSubmit={(event) => { event.preventDefault(); navigate(`/verify/${encodeURIComponent(input.trim())}`); }}><label htmlFor="token">Verification Token</label><div className="search-row"><div className="input-wrap"><Search size={18} /><input id="token" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Example: a8f72c91e4f" autoComplete="off" /></div><button disabled={!input.trim()}>Verify <CheckCircle2 size={16} /></button></div></form></section>{!routeToken && !busy && !result && !error && <div className="initial-state"><Search size={24} /><h2>Enter a Verification Token</h2><p>The verification result and certificate information will appear here.</p></div>}{busy && <div className="initial-state"><h2>Verifying certificate...</h2><p>Please wait while we check the record.</p></div>}{error && !busy && <InvalidResult token={input} error={error} onClear={() => { setInput(""); setError(""); navigate("/verify"); }} />}{result && !busy && <Result result={result} />}</main>;
}

function Result({ result }) {
  const valid = result.verified; const revoked = result.certificate?.status === "REVOKED";
  return <section className={`result ${valid ? "valid" : "revoked"}`}><div className="result-heading"><div className="status-icon">{valid ? <CheckCircle2 /> : <CircleAlert />}</div><div><div className="eyebrow">{valid ? "VERIFICATION SUCCESSFUL" : revoked ? "CERTIFICATE REVOKED" : "VERIFICATION FAILED"}</div><h2>{valid ? "Valid Certificate" : revoked ? "Certificate Revoked" : "Certificate Could Not Be Verified"}</h2><p>{valid ? "This certificate exists in the Certificate Management System." : "Do not treat this certificate as verified."}</p></div></div>{result.certificate && <><div className="token-strip"><span>Verification Token</span><strong className="mono">{result.certificate.verificationToken || "Provided token"}</strong></div><div className="detail-grid"><Detail label="Participant" value={result.certificate.recipientName} /><Detail label="Certificate Number" value={result.certificate.certificateNumber} mono /><Detail label="Program" value={result.program?.name} /><Detail label="Event" value={result.event?.name} /><Detail label="Issued On" value={result.certificate.issuedDate} /><Detail label="Status" value={result.certificate.status} /></div></>} </section>;
}
function Detail({ label, value, mono }) { return <div className="detail"><span>{label}</span><strong className={mono ? "mono" : ""}>{value || "-"}</strong></div>; }
function InvalidResult({ token, error, onClear }) { return <section className="invalid-card"><XCircle size={38} /><span className="invalid-status">Verification Failed</span><h2>Certificate Could Not Be Verified</h2><p>No valid certificate record was found for the Verification Token:</p><strong className="invalid-token mono">{token}</strong><div className="warning"><ShieldAlert size={19} /><div><strong>Do not treat this certificate as verified.</strong><p>The verification token may be incorrect, or the certificate may not have been issued through this Certificate Management System.</p></div></div><div className="warning unauthorized"><ShieldAlert size={19} /><div><strong>Suspected unauthorized certificate?</strong><p>If this certificate appears to use an organization's name, event, logo, signature, or identity without authorization, contact the issuing organization or system administrator for further verification.</p></div></div><button className="try-again" onClick={onClear}>Try Another Certificate</button><p className="backend-error">{error}</p></section>; }

function ImportPage() {
  const [file, setFile] = useState(null); const [key, setKey] = useState("local-dev-import-key"); const [preview, setPreview] = useState(null); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  async function send(path) {
    if (!file) return setMessage("Choose a version 3 JSON package first.");
    setBusy(true); setMessage("");
    const form = new FormData(); form.append("file", file);
    try {
      const endpoint = path ? `${API}/admin/import/${path}` : `${API}/admin/import`;
      const response = await fetch(endpoint, { method: "POST", headers: { "x-admin-key": key }, body: form });
      let body = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try { body = await response.json(); } catch (e) { throw new Error("Invalid JSON response from server."); }
      } else {
        await response.text();
        if (response.status === 405) throw new Error("405: API method/routing configuration is incorrect.");
        if (response.status === 401) throw new Error("401: Admin authentication failed.");
        if (response.status >= 500) throw new Error(`${response.status}: Server error while processing the import.`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: Unexpected response format.`);
      }
      if (!response.ok) {
         if (response.status === 401) throw new Error("401: Admin authentication failed.");
         if (response.status === 409) throw new Error("409: Import conflicts detected.");
         if (response.status === 400) throw new Error(body.message || body.errors?.join(" ") || "400: Validation or signature error.");
         throw new Error(body.message || body.errors?.join(" ") || `HTTP ${response.status}: Request failed.`);
      }
      setPreview(body);
      setMessage(path === "preview" ? "Package validated. Review the counts before importing." : "Import completed successfully.");
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
         setMessage("Unable to reach the verification server.");
      } else {
         setMessage(err.message);
      }
    } finally {
      setBusy(false);
    }
  }
  return <main className="admin-page"><div className="admin-heading"><div className="eyebrow">ADMIN WORKSPACE</div><h1>Import verification data</h1><p>Upload a portable version 3 package. Local IDs are ignored; the portal creates its own relationships.</p></div><section className="import-card"><div className="upload-zone"><FileUp size={26} /><strong>{file ? file.name : "Choose a JSON export"}</strong><span>Signed version 3 packages only · up to 10 MB</span><input type="file" accept="application/json,.json" onChange={(event) => setFile(event.target.files?.[0] || null)} /></div><label>Admin import key<input value={key} onChange={(event) => setKey(event.target.value)} type="password" /></label><div className="button-row"><button className="secondary" onClick={() => send("preview")} disabled={busy}><Search size={16} /> Verify & Preview</button><button onClick={() => send("")} disabled={busy || !preview || preview.status === "CONFLICTS"}><LockKeyhole size={16} /> Commit import</button></div>{preview?.security && <div className="security-ok"><CheckCircle2 size={18} /><div><strong>Signature verified</strong><span>{preview.security.algorithm} · {preview.security.keyId} · AUTHORIZED EXPORT</span></div></div>}{message && <div className="notice">{message}</div>}</section>{preview?.summary && <section className="summary"><div className="eyebrow">IMPORT SUMMARY</div><div className="summary-grid">{Object.entries(preview.summary).map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}</span></div>)}</div>{preview.conflicts?.length > 0 && <pre>{JSON.stringify(preview.conflicts, null, 2)}</pre>}</section>}</main>;
}

export default function App() { return <Shell><Routes><Route path="/" element={<HomePage />} /><Route path="/verify" element={<VerifyPage />} /><Route path="/verify/:verificationToken" element={<VerifyPage />} /><Route path="/admin/import" element={<ImportPage />} /></Routes></Shell>; }
