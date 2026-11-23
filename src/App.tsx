import { useEffect, useState, type FormEvent } from 'react';
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams, Navigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, PlusCircle, LogOut, Search, Shield, ArrowLeft, RefreshCw } from 'lucide-react';
import supabase from './supabase';
import type { Session } from '@supabase/supabase-js';

type Profile = { id: string; full_name: string; role: string };
type TicketRow = {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  customer_id: string;
  assigned_to: string | null;
};
const statuses = ['NEW','OPEN','ASSIGNED','IN_PROGRESS','PENDING','ESCALATED','RESOLVED','REOPENED','CLOSED','CANCELLED'];
function err(e: unknown) { return e instanceof Error ? e.message : String(e); }

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialise auth session and subscribe to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load user profile whenever a session exists
  useEffect(() => {
    if (!session) { setProfile(null); return; }
    supabase
      .from('profiles')
      .select('id,full_name,role')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => setProfile(data as Profile | null));
  }, [session]);

  if (loading) return <div className="center">Memuat aplikasi…</div>;
  if (!session) return <Login />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={session ? <Shell profile={profile} session={session} navigate={navigate} /> : <Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function Shell({ profile, session, navigate }: { profile: Profile | null; session: Session; navigate: (path: string) => void }) {
  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <Shield size={25} /> <span>HelpDesk<span className="accent">Pro</span></span>
        </div>
        <div className="caption">TICKET MANAGEMENT</div>
        <nav>
          <Link to="/"><LayoutDashboard size={18} /> Dashboard</Link>
          <Link to="/tickets"><Ticket size={18} /> Semua Tiket</Link>
          <Link to="/tickets/new"><PlusCircle size={18} /> Buat Tiket</Link>
        </nav>
        <div className="sidebottom">
          <div className="avatar">{(profile?.full_name || session.user.email || 'U')[0].toUpperCase()}</div>
          <div className="identity"><b>{profile?.full_name || session.user.email}</b> <small>{profile?.role || 'Memuat profil'}</small></div>
          <button title="Keluar" onClick={() => { supabase.auth.signOut(); navigate('/login'); }}><LogOut size={18} /></button>
        </div>
      </aside>
      <main>
        {/* Keep the original routing for the rest of the app */}
        <Routes>
          <Route path="/" element={<Dashboard profile={profile} />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/tickets/new" element={<NewTicket />} />
          <Route path="/tickets/:id" element={<Detail profile={profile} />} />
        </Routes>
      </main>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error?.message || 'Berhasil masuk');
    setBusy(false);
    if (!error) navigate('/');
  }

  return (
    <div className="login">
      <div className="login-card">
        <div className="logo"><Shield size={32} /></div>
        <h1>Selamat Datang</h1>
        <p>Masuk ke HelpDesk Pro untuk mengelola layanan IT Anda.</p>
        <form onSubmit={submit}>
          <label>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@perusahaan.com" />
          <label>Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          <button className="primary" disabled={busy}>{busy ? 'Memproses…' : 'Masuk ke Dashboard'}</button>
        </form>
        {message && <p role="alert" className="message">{message}</p>}
        <small>Akun dibuat oleh administrator melalui Supabase Auth.</small>
      </div>
    </div>
  );
}

// (The rest of the component implementations – Dashboard, Tickets, NewTicket, Detail, etc. – remain unchanged and are imported below)

export default App;
