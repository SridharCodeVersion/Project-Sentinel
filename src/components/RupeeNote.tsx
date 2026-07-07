export default function RupeeNote() {
  return (
    <div className="w-full aspect-[2/1] relative flex items-center justify-center">
      <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="noteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6B8E5E" />
            <stop offset="50%" stopColor="#558066" />
            <stop offset="100%" stopColor="#4A7C59" />
          </linearGradient>
          <pattern id="microprint" width="20" height="20" patternUnits="userSpaceOnUse">
            <text x="0" y="10" fontSize="3" fill="rgba(0,0,0,0.1)">RBI500</text>
          </pattern>
        </defs>
        
        {/* Base note */}
        <rect x="10" y="10" width="380" height="180" rx="8" fill="url(#noteGrad)" stroke="#3A6345" strokeWidth="2" />
        <rect x="15" y="15" width="370" height="170" rx="6" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        
        {/* Security Thread */}
        <rect x="120" y="10" width="6" height="180" fill="rgba(0,0,0,0.3)" />
        <text x="-100" y="124" fontSize="4" fill="rgba(255,255,255,0.8)" transform="rotate(-90)" letterSpacing="2">RBI ₹500 BHARAT</text>
        <text x="-180" y="124" fontSize="4" fill="rgba(255,255,255,0.8)" transform="rotate(-90)" letterSpacing="2">RBI ₹500 BHARAT</text>

        {/* Microprint Background */}
        <rect x="20" y="20" width="100" height="160" fill="url(#microprint)" />

        {/* Values */}
        <text x="30" y="45" fontSize="24" fontWeight="bold" fill="rgba(0,0,0,0.6)">500</text>
        <text x="330" y="175" fontSize="24" fontWeight="bold" fill="rgba(0,0,0,0.6)">500</text>
        <text x="330" y="45" fontSize="16" fontWeight="bold" fill="rgba(0,0,0,0.4)">₹500</text>

        {/* Text Details */}
        <text x="180" y="40" fontSize="10" fontWeight="bold" fill="rgba(0,0,0,0.7)" textAnchor="middle">RESERVE BANK OF INDIA</text>
        <text x="180" y="55" fontSize="8" fill="rgba(0,0,0,0.6)" textAnchor="middle">GUARANTEED BY THE CENTRAL GOVERNMENT</text>
        <text x="180" y="80" fontSize="14" fontWeight="bold" fill="rgba(0,0,0,0.7)" textAnchor="middle">FIVE HUNDRED RUPEES</text>
        
        {/* Seal */}
        <circle cx="80" cy="140" r="25" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
        <circle cx="80" cy="140" r="20" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
        <path d="M 70 140 Q 80 120 90 140 Q 80 160 70 140" fill="rgba(0,0,0,0.1)" />

        {/* Gandhi Silhouette Placeholder */}
        <path d="M 280 170 Q 280 100 290 80 Q 300 60 320 80 Q 330 100 330 170 Z" fill="rgba(0,0,0,0.15)" />
        <circle cx="310" cy="75" r="15" fill="rgba(0,0,0,0.1)" />
        
        {/* Ashoka Pillar Watermark outline */}
        <circle cx="60" cy="80" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Serial Number */}
        <text x="250" y="30" fontSize="14" fontFamily="monospace" fontWeight="bold" fill="rgba(0,0,0,0.8)" letterSpacing="1">5AA 123456</text>

        {/* Overlay Strip */}
        <rect x="10" y="90" width="380" height="20" fill="rgba(239, 68, 68, 0.15)" />
        <text x="200" y="104" fontSize="12" fill="rgba(239, 68, 68, 0.8)" fontWeight="bold" textAnchor="middle" letterSpacing="4">UNDER FORENSIC ANALYSIS</text>
      </svg>
    </div>
  );
}
