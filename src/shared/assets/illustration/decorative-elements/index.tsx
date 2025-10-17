export default function DecorativeElements() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Blue dots */}
      <div className="absolute top-20 left-1/4 w-3 h-3 bg-blue-400 rounded-full opacity-60 animate-pulse" />
      <div
        className="absolute top-32 right-1/3 w-2 h-2 bg-blue-500 rounded-full opacity-50 animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
      <div
        className="absolute top-40 right-1/4 w-2.5 h-2.5 bg-blue-400 rounded-full opacity-40 animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      {/* Red X marks */}
      <svg
        className="absolute top-24 left-1/3 w-6 h-6 text-red-400 opacity-60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 6l12 12M18 6l-12 12" />
      </svg>
      <svg
        className="absolute top-32 left-1/2 w-5 h-5 text-red-500 opacity-50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M6 6l12 12M18 6l-12 12" />
      </svg>

      {/* Green plus signs */}
      <svg
        className="absolute top-28 left-1/4 w-6 h-6 text-green-500 opacity-60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      <svg
        className="absolute top-36 left-1/3 w-5 h-5 text-green-400 opacity-50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    </div>
  );
}
