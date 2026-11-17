import { Check } from 'lucide-react'
import { cn } from '../../utils/format.js'

const defaultSteps = ['Showtime', 'Seats', 'Checkout', 'Confirmed']

export default function Stepper({ steps = defaultSteps, current = 0 }) {
  return (
    <div className="card mb-6 flex items-center justify-between gap-1 overflow-x-auto p-3 sm:p-4">
      {steps.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <div key={step} className="flex flex-1 items-center gap-1 sm:gap-2">
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold transition sm:h-8 sm:w-8',
                  done && 'border-gold bg-gold text-[#151006]',
                  active && 'border-gold bg-gold/15 text-gold shadow-[0_0_0_4px_color-mix(in_srgb,var(--gold)_12%,transparent)]',
                  !done && !active && 'border-line text-muted',
                )}
              >
                {done ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  'hidden text-xs font-semibold sm:inline',
                  active ? 'text-ink' : done ? 'text-gold' : 'text-muted',
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn('mx-1 h-px flex-1', done ? 'bg-gold' : 'bg-line')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
