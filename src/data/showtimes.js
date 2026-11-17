import { nowShowingMovies } from './movies.js'
import { cinemas, halls } from './cinemas.js'

/** Local-date key (avoids UTC shifting used by toISOString). */
export function toDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const dateOptions = Array.from({ length: 7 }, (_, index) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + index)
  return {
    key: toDateKey(date),
    day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    date: date.getDate(),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    full: date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    isToday: index === 0,
  }
})

function hash(text) {
  let value = 0
  for (let i = 0; i < text.length; i += 1) {
    value = (value * 31 + text.charCodeAt(i)) | 0
  }
  return Math.abs(value)
}

function occupiedSeats(id, total) {
  const seed = hash(id)
  const count = Math.floor(total * (0.18 + (seed % 18) / 100))
  const taken = new Set()
  let state = seed || 1
  while (taken.size < count) {
    state = (state * 9301 + 49297) % 233280
    taken.add(1 + Math.floor((state / 233280) * total))
  }
  return [...taken].sort((a, b) => a - b)
}

const showTimeSlots = ['10:30', '13:15', '16:00', '18:45', '21:30']

/** Deterministic demo showtimes for the next seven days. */
export const showtimes = dateOptions.flatMap((day) =>
  nowShowingMovies.flatMap((movie) =>
    cinemas.flatMap((cinema, cinemaIndex) => {
      const hall = halls.find((item) => item.id === cinema.hallIds[cinemaIndex % cinema.hallIds.length])
      const slots = showTimeSlots.slice(0, 3 + (hash(movie.id + day.key) % 3))
      return slots.map((time, slotIndex) => {
        const id = `s-${movie.id}-${cinema.id}-${day.key}-${slotIndex}`
        const totalSeats = hall.rows * hall.seatsPerRow
        return {
          id,
          movieId: movie.id,
          cinemaId: cinema.id,
          hallId: hall.id,
          date: day.key,
          time,
          price: hall.price,
          totalSeats,
          occupiedSeats: occupiedSeats(id, totalSeats),
        }
      })
    }),
  ),
)

export const getShowtimeById = (id) => showtimes.find((item) => item.id === id)

export function findShowtimes({ movieId, cinemaId, date } = {}) {
  return showtimes.filter((showtime) => {
    if (movieId && showtime.movieId !== movieId) return false
    if (cinemaId && showtime.cinemaId !== cinemaId) return false
    if (date && showtime.date !== date) return false
    return true
  })
}
