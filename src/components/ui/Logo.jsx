export default function Logo({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="rv-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6d3fe0" />
        </linearGradient>
      </defs>
      <path d="M16 2l12 7v14l-12 7L4 23V9z" fill="url(#rv-g)" />
      <path d="M12 21V11h5a3 3 0 010 6h-5m5 0l3.5 4" stroke="#09090b" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
