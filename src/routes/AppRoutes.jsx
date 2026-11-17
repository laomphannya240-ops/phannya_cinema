import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout.jsx'
import AdminLayout from '../components/layout/AdminLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import HomePage from '../pages/home/HomePage.jsx'
import MoviesPage from '../pages/movies/MoviesPage.jsx'
import MovieDetailsPage from '../pages/movies/MovieDetailsPage.jsx'
import ShowtimesPage from '../pages/movies/ShowtimesPage.jsx'
import PromotionsPage from '../pages/movies/PromotionsPage.jsx'
import SeatSelectionPage from '../pages/booking/SeatSelectionPage.jsx'
import CheckoutPage from '../pages/booking/CheckoutPage.jsx'
import ConfirmationPage from '../pages/booking/ConfirmationPage.jsx'
import MyBookingsPage from '../pages/booking/MyBookingsPage.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import RegisterPage from '../pages/auth/RegisterPage.jsx'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage.jsx'
import ProfilePage from '../pages/profile/ProfilePage.jsx'
import FavoritesPage from '../pages/profile/FavoritesPage.jsx'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx'
import AdminResourcePage from '../pages/admin/AdminResourcePage.jsx'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="movies" element={<MoviesPage />} />
          <Route path="movies/:id" element={<MovieDetailsPage />} />
          <Route path="showtimes" element={<ShowtimesPage />} />
          <Route path="promotions" element={<PromotionsPage />} />
          <Route
            path="my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="booking/seats" element={<SeatSelectionPage />} />
          <Route path="booking/checkout" element={<CheckoutPage />} />
          <Route path="booking/confirmation/:id" element={<ConfirmationPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="movies" element={<AdminResourcePage resourceKey="movies" />} />
          <Route path="cinemas" element={<AdminResourcePage resourceKey="cinemas" />} />
          <Route path="halls" element={<AdminResourcePage resourceKey="halls" />} />
          <Route path="seats" element={<AdminResourcePage resourceKey="seats" />} />
          <Route path="showtimes" element={<AdminResourcePage resourceKey="showtimes" />} />
          <Route path="bookings" element={<AdminResourcePage resourceKey="bookings" />} />
          <Route path="users" element={<AdminResourcePage resourceKey="users" />} />
          <Route path="promotions" element={<AdminResourcePage resourceKey="promotions" />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
