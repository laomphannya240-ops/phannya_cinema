import { Play, Video } from 'lucide-react'
import Modal from '../common/Modal.jsx'
import MovieArt from '../common/MovieArt.jsx'

export default function TrailerModal({ movie, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={`${movie?.title || 'Movie'} — Trailer`} size="lg">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-line">
        <MovieArt movie={movie} banner className="h-full w-full opacity-75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/35 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition hover:scale-105">
            <Play className="h-7 w-7 fill-white text-white" />
          </div>
          <div>
            <p className="font-display text-2xl text-white">{movie?.tagline}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">
              Trailer preview — demo only
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted">
        <Video className="h-4 w-4" />
        Connect a video source through the Laravel API to play the official trailer here.
      </p>
    </Modal>
  )
}
