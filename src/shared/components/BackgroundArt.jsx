// Responsive BackgroundArt Component (components/BackgroundArt.jsx)
import '../../index.css';
const BackgroundArt = ({ className = '' }) => {
    return (
        <div className={`fixed inset-0 w-full h-full overflow-hidden -z-1 ${className}`}>
            <svg
                viewBox="0 0 800 600"
                className="w-full h-full min-h-screen object-cover"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#71CB2A" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#83C541" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F1F3E5" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#003024" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#001F18" stopOpacity="0.4" />
                    </linearGradient>
                </defs>
                <g opacity="0.8">
                    {/* Main background shapes */}
                    <path d="M0,400 C150,300 250,520 420,420 C600,320 650,520 800,420 L800,600 L0,600 Z" fill="url(#g1)" />
                    <circle cx="650" cy="140" r="160" fill="url(#g2)" />
                    <circle cx="160" cy="120" r="110" fill="#71CB2A" opacity=".35" />

                    {/* Additional decorative elements */}
                    
                    <rect x="50" y="300" width="80" height="80" rx="10" fill="#83C541" opacity="0.2" transform="rotate(45 50 300)" />
                    <rect x="700" y="400" width="60" height="60" rx="8" fill="#003024" opacity="0.2" transform="rotate(-30 700 400)" />

                    {/* Leaf/plant motifs */}
                    <path d="M200,200 C220,180 240,190 250,210 C260,230 240,250 220,250 C200,250 180,230 190,210 C200,190 220,180 200,200Z" fill="#71CB2A" opacity="0.4" />
                    <path d="M500,300 C520,280 540,290 550,310 C560,330 540,350 520,350 C500,350 480,330 490,310 C500,290 520,280 500,300Z" fill="#83C541" opacity="0.4" />
                </g>
            </svg>
        </div>
    );
};

export default BackgroundArt;