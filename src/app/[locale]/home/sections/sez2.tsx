export default function Sez2() {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Top fade gradient for mobile */}
      <div className="absolute top-0 left-0 right-0 h-20 md:h-16 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.9) 80%, white 100%)',
          }}
        />
      </div>
      {/* Section 2 content cleared */}
    </div>
  );
}
