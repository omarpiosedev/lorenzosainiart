export default function HeroHome() {
  return (
    <section className="min-h-screen">
      <div
        className="relative w-full h-[80vh] md:min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/images/new-background.jpg)',
        }}
      >
        {/* Cloud layer */}
        <div className="absolute inset-0 z-2 flex items-center justify-center overflow-hidden">
          <img
            src="/assets/images/cloud-layer.png"
            alt="Clouds"
            className="w-full h-auto object-cover scale-150"
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden">
          <img
            src="/assets/images/sposi.png"
            alt="Couple"
            className="w-full md:w-3/4 lg:w-1/2 h-auto"
            style={{ transform: 'translate(20px, 40px)' }}
          />
        </div>

        {/* Small signature top-left */}
        <div className="absolute top-4 left-4 z-15">
          <p className="text-sm text-white opacity-60 leading-tight">
            Lorenzo Saini
            <br />
            Photographer
          </p>
        </div>

        {/* Contact button top-right */}
        <div className="absolute top-4 right-4 z-15">
          <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30 hover:bg-white/30 transition-colors">
            Contact
          </button>
        </div>

        {/* Main text container */}
        <div className="absolute inset-0 flex items-start justify-center pt-24 z-5">
          <h1 className="text-7xl font-bold text-white leading-none text-center tracking-wider" style={{ fontFamily: 'Lavener' }}>
            LORENZO
            <br />
            SAINI'S ART
          </h1>
        </div>

        {/* Overlay gradient at bottom with progressive blur */}
        <div className="absolute bottom-0 left-0 right-0 h-96 pointer-events-none z-20">
          {/* Base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, white 0%, white 15%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.5) 70%, rgba(255,255,255,0.2) 85%, transparent 100%)',
            }}
          >
          </div>

          {/* Progressive blur layers */}
          <div
            className="absolute bottom-0 left-0 right-0 h-20"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backdropFilter: 'blur(16px)',
            }}
          >
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0.1) 70%, transparent 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-64"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.03) 80%, transparent 100%)',
              backdropFilter: 'blur(8px)',
            }}
          >
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-80"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.01) 75%, transparent 100%)',
              backdropFilter: 'blur(4px)',
            }}
          >
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-96"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.008) 70%, transparent 100%)',
              backdropFilter: 'blur(2px)',
            }}
          >
          </div>
        </div>
      </div>
    </section>
  );
}
