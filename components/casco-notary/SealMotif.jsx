// Shared line-art notarial-seal motif — reused in the hero backdrop, footer
// and disclaimer callout. Pure stroke SVG using currentColor so it can be
// tinted brass-on-navy or navy-on-cream from wherever it's dropped in.
export default function SealMotif({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
      <circle cx="100" cy="100" r="78" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 10 * Math.PI) / 180;
        const x1 = 100 + 86 * Math.cos(angle);
        const y1 = 100 + 86 * Math.sin(angle);
        const x2 = 100 + 94 * Math.cos(angle);
        const y2 = 100 + 94 * Math.sin(angle);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.5"
          />
        );
      })}
      <path
        d="M100 55 L108 82 L136 82 L113 98 L122 125 L100 108 L78 125 L87 98 L64 82 L92 82 Z"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.6"
      />
    </svg>
  );
}
