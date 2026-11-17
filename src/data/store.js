import { movies } from './movies.js'
import { cinemas, halls } from './cinemas.js'
import { showtimes } from './showtimes.js'
import { bookings } from './bookings.js'
import { users } from './users.js'
import { promotions } from './promotions.js'
import { seats } from './adminData.js'

/**
 * In-memory mutable store used by the demo services.
 * Swap each service implementation for a Laravel API call without touching UI code.
 */
export const store = {
  movies: [...movies],
  cinemas: [...cinemas],
  halls: [...halls],
  seats: [...seats],
  showtimes: [...showtimes],
  bookings: [...bookings],
  users: [...users],
  promotions: [...promotions],
}
