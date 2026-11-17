/** Shared seat helpers used by the interactive map and checkout summary. */

export function rowLetter(index) {
  return String.fromCharCode(65 + index)
}

export function seatGlobalIndex(rowIndex, seatIndex, seatsPerRow) {
  return rowIndex * seatsPerRow + seatIndex + 1
}

export function isVipSeat(hall, rowIndex) {
  return Boolean(hall?.vipRows?.includes(rowIndex))
}

export function priceForSeat(showtime, hall, label = '') {
  const rowIndex = label.charCodeAt(0) - 65
  const base = showtime?.price ?? hall?.price ?? 10
  return isVipSeat(hall, rowIndex) ? base + 6 : base
}

export function buildSeatRows(hall) {
  if (!hall) return []
  return Array.from({ length: hall.rows }, (_, rowIndex) =>
    Array.from({ length: hall.seatsPerRow }, (_, seatIndex) => {
      const label = `${rowLetter(rowIndex)}${seatIndex + 1}`
      return {
        label,
        rowIndex,
        seatIndex,
        globalIndex: seatGlobalIndex(rowIndex, seatIndex, hall.seatsPerRow),
        vip: isVipSeat(hall, rowIndex),
      }
    }),
  )
}
