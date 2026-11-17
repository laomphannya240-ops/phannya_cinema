import { halls } from './cinemas.js'

const seatTypes = ['standard', 'standard', 'standard', 'vip']

/** Flattened seat inventory for the admin "Manage Seats" table. */
export const seats = halls.flatMap((hall) =>
  Array.from({ length: hall.rows }, (_, rowIndex) =>
    Array.from({ length: hall.seatsPerRow }, (_, seatIndex) => {
      const label = `${String.fromCharCode(65 + rowIndex)}${seatIndex + 1}`
      const isVip = hall.vipRows.includes(rowIndex)
      const number = seatIndex + 1
      return {
        id: `${hall.id}-${label}`,
        hallId: hall.id,
        hallName: hall.name,
        row: String.fromCharCode(65 + rowIndex),
        number,
        label,
        type: isVip ? 'vip' : seatTypes[number % seatTypes.length] === 'vip' ? 'vip' : 'standard',
        status: (rowIndex * 17 + seatIndex * 7) % 11 === 0 ? 'maintenance' : 'available',
      }
    }),
  ),
)
