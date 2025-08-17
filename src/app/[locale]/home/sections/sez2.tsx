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
      {/* Centered text content */}
      <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl leading-tight text-black tracking-wide font-semibold" style={{ fontFamily: 'Lavener, sans-serif' }}>
            Every frame is a canvas, and every moment holds infinite stories waiting to be told. I seek the beauty hidden in the ordinary, weaving creativity, design, and emotion into visuals that breathe life and meaning. My work is about touching hearts, sparking imagination, and turning fleeting instants into timeless art.
          </p>
        </div>
      </div>
    </div>
  );
}
