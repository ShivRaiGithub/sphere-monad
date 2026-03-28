'use client';

export default function HeroEnvironment() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      
      {/* Central main anchor: Forest Area */}
      <div className="absolute top-1/2 right-[10%] lg:right-[15%] -translate-y-1/2 w-[600px] h-[600px] flex items-center justify-center z-10">
        <div className="relative w-full h-full flex items-center justify-center" style={{ animation: 'float 8s infinite ease-in-out' }}>
          
          {/* Main glowing aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/20 blur-[100px] rounded-full mix-blend-screen" />
          
          <img 
            src="/nature/forestArea.png" 
            alt="Forest Foundation" 
            className="w-[90%] max-w-[600px] pixel-img drop-shadow-[0_30px_50px_rgba(0,0,0,0.3)]" 
          />
        </div>
      </div>

      {/* Scattered background/foreground elements for depth */}
      
      {/* Top Left Cloud */}
      <img src="/nature/cloud.png" alt="Cloud" className="absolute top-[8%] left-[10%] w-56 opacity-40 pixel-img z-0" style={{ animation: 'float 12s infinite ease-in-out' }} />
      {/* Top Right Cloud */}
      <img src="/nature/cloud.png" alt="Cloud" className="absolute top-[18%] right-[5%] w-[300px] opacity-30 pixel-img z-0" style={{ animation: 'float 15s infinite ease-in-out reverse' }} />
      {/* Bottom Left Cloud */}
      <img src="/nature/cloud.png" alt="Cloud" className="absolute bottom-[5%] left-[20%] w-64 opacity-50 pixel-img z-20" style={{ animation: 'float 10s infinite ease-in-out 2s' }} />

      {/* Distant islands / fragments */}
      <img src="/nature/grassTiles.png" alt="Fragment" className="absolute top-[25%] left-[30%] w-32 opacity-60 pixel-img blur-[2px] z-0 drop-shadow-xl" style={{ animation: 'tree-bob 7s infinite ease-in-out 1s' }} />
      <img src="/nature/grassTiles.png" alt="Fragment" className="absolute bottom-[15%] right-[25%] w-40 opacity-70 pixel-img z-20 drop-shadow-xl" style={{ animation: 'tree-bob 6s infinite ease-in-out 3s' }} />

      {/* Floating pond fragment */}
      <div className="absolute top-[20%] right-[35%] w-40 opacity-60 blur-[1px] z-0 drop-shadow-xl" style={{ animation: 'float 9s infinite ease-in-out 2s' }}>
        <img src="/nature/pond.png" alt="Pond fragment" className="w-full pixel-img" />
      </div>

      {/* Scattered rocks */}
      <img src="/nature/rocks.png" alt="Rocks" className="absolute bottom-[35%] left-[15%] w-20 opacity-50 pixel-img blur-[2px] z-0" style={{ animation: 'tree-bob 5s infinite ease-in-out' }} />
      <img src="/nature/rocks.png" alt="Rocks" className="absolute top-[35%] right-[10%] w-24 opacity-60 pixel-img z-20 transform -scale-x-100 drop-shadow-lg" style={{ animation: 'float 8s infinite ease-in-out 1s' }} />

      {/* Magical Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-accent-glow rounded-full shadow-[0_0_12px_#4ade80]"
          style={{
            left: `${5 + Math.random() * 90}%`,
            top: `${5 + Math.random() * 90}%`,
            opacity: 0.2 + Math.random() * 0.6,
            zIndex: Math.random() > 0.5 ? 0 : 30,
            animation: `float ${3 + Math.random() * 5}s infinite ease-in-out ${Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );
}
