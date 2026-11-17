import AppProviders from './context/AppProviders.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

/**
 * Root application shell.
 * All global providers live in AppProviders; all routing lives in AppRoutes.
 */
export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  )
}
