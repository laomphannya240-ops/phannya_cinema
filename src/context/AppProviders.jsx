import { ThemeProvider } from './ThemeContext.jsx'
import { LanguageProvider } from './LanguageContext.jsx'
import { ToastProvider } from './ToastContext.jsx'
import { NotificationProvider } from './NotificationContext.jsx'
import { AuthProvider } from './AuthContext.jsx'
import { BookingProvider } from './BookingContext.jsx'
import { FavoritesProvider } from './FavoritesContext.jsx'

/** Provider order matters: lower providers can consume the ones above them. */
export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <NotificationProvider>
            <AuthProvider>
              <BookingProvider>
                <FavoritesProvider>{children}</FavoritesProvider>
              </BookingProvider>
            </AuthProvider>
          </NotificationProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
