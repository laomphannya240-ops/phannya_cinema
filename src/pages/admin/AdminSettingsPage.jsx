import { CheckCircle2, Database, Globe, Moon, Server, ShieldCheck, Sun } from 'lucide-react'
import { Badge } from '../../components/common/Display.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'
import { isDemoMode } from '../../services/api.js'

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()
  const apiUrl = import.meta.env.VITE_API_URL || 'Not configured (demo mode)'

  return (
    <div className="space-y-5">
      <div>
        <p className="eyebrow mb-2">System</p>
        <h2 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Settings</h2>
        <p className="mt-1 text-sm text-muted">Configure your admin experience and review backend readiness.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <h3 className="mb-5 font-display text-xl font-semibold text-ink">Appearance</h3>
          <p className="label">Theme</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`btn ${theme === 'dark' ? 'btn-gold' : 'btn-outline'}`}
            >
              <Moon className="h-4 w-4" /> Dark
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`btn ${theme === 'light' ? 'btn-gold' : 'btn-outline'}`}
            >
              <Sun className="h-4 w-4" /> Light
            </button>
          </div>
          <p className="label mt-6">Default language</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`btn ${language === 'en' ? 'btn-gold' : 'btn-outline'}`}
            >
              <Globe className="h-4 w-4" /> English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('km')}
              className={`btn ${language === 'km' ? 'btn-gold' : 'btn-outline'}`}
            >
              <Globe className="h-4 w-4" /> ខ្មែរ
            </button>
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <h3 className="mb-5 font-display text-xl font-semibold text-ink">Backend readiness</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line p-3.5">
              <span className="flex items-center gap-2 text-sm text-ink">
                <Server className="h-4 w-4 text-gold" /> API base URL
              </span>
              <span className="max-w-[55%] truncate font-mono text-xs text-muted">{apiUrl}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line p-3.5">
              <span className="flex items-center gap-2 text-sm text-ink">
                <Database className="h-4 w-4 text-gold" /> Data source
              </span>
              <Badge tone={isDemoMode ? 'gold' : 'green'}>
                {isDemoMode ? 'Demo store' : 'Laravel API'}
              </Badge>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-line p-3.5">
              <span className="flex items-center gap-2 text-sm text-ink">
                <ShieldCheck className="h-4 w-4 text-gold" /> Authentication
              </span>
              <Badge tone="blue">Bearer token ready</Badge>
            </div>
            <p className="flex items-start gap-2 text-xs text-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              Set VITE_API_URL in a .env file to switch every service from demo data to your Laravel
              backend. No UI changes required.
            </p>
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h3 className="mb-2 font-display text-xl font-semibold text-ink">Architecture notes</h3>
        <ul className="grid gap-2 text-sm text-muted sm:grid-cols-2">
          <li>• Services are isolated from presentation components.</li>
          <li>• Axios client attaches an in-memory bearer token.</li>
          <li>• Role-based routes protect the admin area.</li>
          <li>• No credentials or tokens are stored in localStorage.</li>
        </ul>
      </div>
    </div>
  )
}
