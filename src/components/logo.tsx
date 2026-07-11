export function Logo({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-extrabold tracking-tight text-white ${className}`}
      aria-label="Skarrel"
    >
      Ska<span className="text-coral">rr</span>el
    </span>
  )
}
