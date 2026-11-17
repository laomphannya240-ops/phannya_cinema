import { useId } from 'react'

/**
 * Locally generated cinematic artwork. Each movie has an `art` variant and a
 * three-colour palette, so the site stays beautiful without external images.
 */

function Starfield({ seed = 1, count = 34, color = '#ffffff' }) {
  const points = []
  let state = seed || 1
  for (let index = 0; index < count; index += 1) {
    state = (state * 9301 + 49297) % 233280
    const x = (state / 233280) * 400
    state = (state * 9301 + 49297) % 233280
    const y = (state / 233280) * 430
    state = (state * 9301 + 49297) % 233280
    const radius = 0.5 + (state / 233280) * 1.4
    points.push({ x, y, radius, key: index })
  }
  return (
    <g>
      {points.map((point) => (
        <circle
          key={point.key}
          cx={point.x}
          cy={point.y}
          r={point.radius}
          fill={color}
          opacity={0.35 + (point.key % 5) * 0.12}
        />
      ))}
    </g>
  )
}

function Skyline({ color, seed = 3, opacity = 0.9, base = 470 }) {
  const buildings = []
  let state = seed || 1
  for (let index = 0; index < 14; index += 1) {
    state = (state * 9301 + 49297) % 233280
    const width = 18 + (state / 233280) * 26
    state = (state * 9301 + 49297) % 233280
    const height = 60 + (state / 233280) * 190
    buildings.push({
      x: index * 30 - 10,
      width,
      height,
      key: index,
    })
  }
  return (
    <g opacity={opacity}>
      {buildings.map((building) => (
        <g key={building.key}>
          <rect x={building.x} y={base - building.height} width={building.width} height={building.height} fill={color} />
          {Array.from({ length: 5 }, (_, row) =>
            Array.from({ length: 2 }, (_, col) => (
              <rect
                key={`${row}-${col}`}
                x={building.x + 5 + col * 9}
                y={base - building.height + 12 + row * 22}
                width="4"
                height="7"
                fill="#ffe9b0"
                opacity={(building.key + row + col) % 3 === 0 ? 0.55 : 0.12}
              />
            )),
          )}
        </g>
      ))}
    </g>
  )
}

function PineTrees({ color, count = 9, base = 500 }) {
  return (
    <g>
      {Array.from({ length: count }, (_, index) => {
        const x = 15 + index * 46 + (index % 2) * 12
        const height = 130 + ((index * 37) % 110)
        return (
          <g key={index} opacity={0.55 + (index % 3) * 0.14}>
            <rect x={x - 3} y={base - 20} width="6" height="30" fill={color} />
            <path d={`M${x} ${base - height} L${x - 34} ${base - 20} L${x + 34} ${base - 20} Z`} fill={color} />
            <path d={`M${x} ${base - height + 45} L${x - 27} ${base - 5} L${x + 27} ${base - 5} Z`} fill={color} />
          </g>
        )
      })}
    </g>
  )
}

function renderScene(art, p, glowId, seed) {
  const light = p[2]
  const mid = p[1]
  const dark = p[0]

  switch (art) {
    case 'desert':
      return (
        <>
          <Starfield seed={seed + 4} count={18} color={light} />
          <circle cx="205" cy="205" r="58" fill={light} opacity="0.9" />
          <circle cx="205" cy="205" r="115" fill={`url(#${glowId})`} />
          <path d="M0 355 Q110 300 215 368 T400 344 V600 H0Z" fill={mid} opacity="0.6" />
          <path d="M0 440 Q140 382 260 452 T400 420 V600 H0Z" fill={dark} opacity="0.9" />
          <path d="M0 522 Q150 470 285 530 T400 505 V600 H0Z" fill="#000" opacity="0.55" />
          <g fill="#000" opacity="0.6">
            <rect x="155" y="374" width="7" height="17" rx="3" />
            <rect x="166" y="377" width="5" height="14" rx="2" />
            <path d="M150 380 h28 l-4 -7 h-20 Z" />
          </g>
        </>
      )
    case 'city':
      return (
        <>
          <circle cx="300" cy="125" r="42" fill={light} opacity="0.82" />
          <circle cx="300" cy="125" r="90" fill={`url(#${glowId})`} />
          <Starfield seed={seed + 7} count={20} color={light} />
          <Skyline color={dark} seed={seed + 2} base={500} />
          <Skyline color={mid} seed={seed + 9} opacity={0.55} base={560} />
          <g opacity="0.18" stroke={light} strokeWidth="1">
            {Array.from({ length: 8 }, (_, index) => (
              <line key={index} x1="0" y1={520 + index * 10} x2="400" y2={520 + index * 10} />
            ))}
          </g>
        </>
      )
    case 'forest':
      return (
        <>
          <circle cx="200" cy="165" r="70" fill={light} opacity="0.25" />
          <circle cx="200" cy="165" r="140" fill={`url(#${glowId})`} />
          <Starfield seed={seed + 6} count={16} color={light} />
          <PineTrees color={dark} />
          <PineTrees color={mid} count={6} base={560} />
          <g opacity="0.16" fill="#ffffff">
            <ellipse cx="130" cy="390" rx="180" ry="18" />
            <ellipse cx="280" cy="450" rx="200" ry="22" />
          </g>
        </>
      )
    case 'space':
      return (
        <>
          <Starfield seed={seed + 11} count={70} color={light} />
          <circle cx="215" cy="235" r="78" fill={mid} />
          <circle cx="195" cy="215" r="78" fill={dark} opacity="0.85" />
          <circle cx="215" cy="235" r="130" fill={`url(#${glowId})`} opacity="0.7" />
          <ellipse
            cx="215"
            cy="235"
            rx="128"
            ry="34"
            fill="none"
            stroke={light}
            strokeWidth="6"
            opacity="0.45"
            transform="rotate(-18 215 235)"
          />
          <path d="M0 520 Q150 470 400 540 V600 H0Z" fill={dark} />
        </>
      )
    case 'romance':
      return (
        <>
          <circle cx="210" cy="230" r="95" fill={light} opacity="0.3" />
          <circle cx="210" cy="230" r="165" fill={`url(#${glowId})`} />
          {Array.from({ length: 12 }, (_, index) => (
            <circle
              key={index}
              cx={30 + ((index * 71) % 350)}
              cy={90 + ((index * 53) % 330)}
              r={6 + (index % 4) * 5}
              fill={light}
              opacity={0.08 + (index % 3) * 0.05}
            />
          ))}
          <path d="M-20 470 Q200 350 420 470" fill="none" stroke={dark} strokeWidth="18" opacity="0.8" />
          <path d="M0 500 H400 V600 H0Z" fill={dark} opacity="0.85" />
          <g fill="#000" opacity="0.6">
            <circle cx="175" cy="438" r="13" />
            <rect x="165" y="450" width="20" height="42" rx="8" />
            <circle cx="228" cy="442" r="12" />
            <rect x="218" y="453" width="19" height="40" rx="8" />
          </g>
        </>
      )
    case 'horror':
      return (
        <>
          <circle cx="205" cy="150" r="60" fill={light} opacity="0.75" />
          <circle cx="205" cy="150" r="120" fill={`url(#${glowId})`} />
          <PineTrees color="#020604" count={11} base={540} />
          <path d="M0 0 L80 0 L160 600 L0 600 Z" fill="#000" opacity="0.35" />
          <path d="M400 0 L330 0 L260 600 L400 600 Z" fill="#000" opacity="0.35" />
          <g opacity="0.12" fill="#d9fff0">
            <ellipse cx="200" cy="430" rx="230" ry="26" />
            <ellipse cx="120" cy="500" rx="180" ry="32" />
          </g>
        </>
      )
    case 'family':
      return (
        <>
          <circle cx="320" cy="110" r="48" fill={light} opacity="0.9" />
          <circle cx="320" cy="110" r="110" fill={`url(#${glowId})`} />
          {Array.from({ length: 6 }, (_, index) => (
            <g key={index} opacity="0.75">
              <circle cx={40 + index * 64} cy={160 + (index % 3) * 34} r="20" fill="#ffffff" opacity="0.35" />
              <circle cx={58 + index * 64} cy={155 + (index % 3) * 34} r="26" fill="#ffffff" opacity="0.3" />
            </g>
          ))}
          <path d="M0 410 Q110 330 220 420 T400 395 V600 H0Z" fill={mid} opacity="0.75" />
          <path d="M0 490 Q130 420 250 500 T400 470 V600 H0Z" fill={dark} />
          {Array.from({ length: 14 }, (_, index) => (
            <circle
              key={index}
              cx={25 + ((index * 83) % 350)}
              cy={300 + ((index * 47) % 150)}
              r="2.5"
              fill={light}
              className="animate-glow"
            />
          ))}
        </>
      )
    case 'action':
      return (
        <>
          <circle cx="200" cy="230" r="115" fill={`url(#${glowId})`} />
          <g stroke={light} strokeWidth="3" opacity="0.3">
            {Array.from({ length: 14 }, (_, index) => (
              <line key={index} x1={-60 + index * 34} y1="600" x2={60 + index * 34} y2="0" />
            ))}
          </g>
          <path d="M0 600 L120 250 L180 420 L255 150 L400 600 Z" fill={dark} opacity="0.9" />
          <path d="M0 600 L150 320 L210 470 L290 260 L400 600 Z" fill={mid} opacity="0.55" />
          <g fill="#000" opacity="0.8">
            <circle cx="205" cy="330" r="17" />
            <path d="M180 350 h50 l18 130 h-86 Z" />
          </g>
        </>
      )
    case 'ocean':
      return (
        <>
          <circle cx="200" cy="170" r="62" fill={light} opacity="0.55" />
          <circle cx="200" cy="170" r="130" fill={`url(#${glowId})`} />
          <Starfield seed={seed + 5} count={14} color={light} />
          <path d="M0 330 Q100 300 200 330 T400 330 V600 H0Z" fill={mid} opacity="0.7" />
          <path d="M0 410 Q100 380 200 410 T400 410 V600 H0Z" fill={dark} opacity="0.85" />
          <path d="M0 495 Q100 465 200 495 T400 495 V600 H0Z" fill="#020910" opacity="0.9" />
          <g stroke={light} strokeWidth="2" fill="none" opacity="0.3">
            <path d="M40 370 Q70 355 100 370" />
            <path d="M230 455 Q265 438 300 455" />
            <path d="M120 530 Q155 514 190 530" />
          </g>
        </>
      )
    case 'noir':
      return (
        <>
          <circle cx="285" cy="130" r="45" fill={light} opacity="0.55" />
          <Skyline color="#05070a" seed={seed + 8} base={520} />
          <path d="M120 0 L240 0 L360 600 L180 600 Z" fill={light} opacity="0.07" />
          <path d="M250 0 L310 0 L400 600 L340 600 Z" fill={light} opacity="0.05" />
          <g stroke={light} strokeWidth="1" opacity="0.18">
            {Array.from({ length: 26 }, (_, index) => (
              <line key={index} x1={index * 17} y1="80" x2={index * 17 - 40} y2="520" />
            ))}
          </g>
          <g fill="#000" opacity="0.8">
            <circle cx="205" cy="400" r="18" />
            <path d="M178 420 h54 l12 150 h-78 Z" />
          </g>
        </>
      )
    case 'fantasy':
      return (
        <>
          <Starfield seed={seed + 13} count={60} color={light} />
          <circle cx="200" cy="220" r="100" fill={`url(#${glowId})`} />
          {Array.from({ length: 5 }, (_, index) => (
            <ellipse
              key={index}
              cx={60 + index * 72}
              cy={330 - (index % 2) * 65}
              rx={38 - index * 3}
              ry="11"
              fill={mid}
              opacity="0.75"
            />
          ))}
          <path d="M150 470 h100 l30 130 h-160 Z" fill={dark} opacity="0.9" />
          <path d="M175 470 v-70 h50 v70" fill={dark} opacity="0.9" />
          <path d="M200 380 l28 -50 h-56 Z" fill={light} opacity="0.8" />
          <g fill={light}>
            {Array.from({ length: 12 }, (_, index) => (
              <circle
                key={index}
                cx={35 + ((index * 97) % 340)}
                cy={100 + ((index * 61) % 330)}
                r="2"
                opacity="0.8"
              />
            ))}
          </g>
        </>
      )
    case 'nebula':
    default:
      return (
        <>
          <Starfield seed={seed + 21} count={64} color={light} />
          <g opacity="0.4" filter={`url(#${blurId})`}>
            <ellipse cx="130" cy="210" rx="140" ry="70" fill={mid} transform="rotate(-25 130 210)" />
            <ellipse cx="280" cy="330" rx="150" ry="65" fill={light} opacity="0.4" transform="rotate(20 280 330)" />
          </g>
          <circle cx="220" cy="250" r="85" fill={mid} />
          <circle cx="198" cy="230" r="85" fill={dark} opacity="0.8" />
          <circle cx="220" cy="250" r="140" fill={`url(#${glowId})`} opacity="0.7" />
          <path d="M0 520 Q160 470 400 545 V600 H0Z" fill={dark} opacity="0.9" />
        </>
      )
  }
}

export default function MovieArt({ movie, className = '', banner = false }) {
  const rawId = useId().replace(/:/g, '')
  const glowId = `glow-${rawId}`
  const vignetteId = `vig-${rawId}`
  const blurId = `blur-${rawId}`
  const palette = movie?.palette || ['#0b1026', '#3b1d6e', '#c56bff']
  const [dark, mid, light] = palette
  const seed = String(movie?.id || 'phannya')
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)

  return (
    <svg
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`bg-${rawId}`} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={dark} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={dark} />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor={light} stopOpacity="0.8" />
          <stop offset="100%" stopColor={light} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={vignetteId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity={banner ? 0.25 : 0.05} />
          <stop offset="55%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity={banner ? 0.65 : 0.8} />
        </linearGradient>
        <filter id={blurId}>
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>
      <rect width="400" height="600" fill={`url(#bg-${rawId})`} />
      {renderScene(movie?.art, palette, glowId, seed)}
      <rect width="400" height="600" fill={`url(#${vignetteId})`} />
    </svg>
  )
}
