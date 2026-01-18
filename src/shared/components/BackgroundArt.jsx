// components/BackgroundArt.jsx
import '../../index.css';

const BackgroundArt = ({ className = '', variant = 'default' }) => {
    // Check if we are in minimal mode (for dashboard)
    const isMinimal = variant === 'minimal';

    return (
        <div className={`fixed inset-0 w-full h-full overflow-hidden z-0 ${className}`}>
            <svg
                viewBox="0 0 800 600"
                className="w-full h-full min-h-screen object-cover"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
            >
                <defs>
                    {/* Thicker Gradients for bolder look */}
                    <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#71CB2A" stopOpacity="1" /> {/* Increased opacity */}
                        <stop offset="100%" stopColor="#83C541" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="g2" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F1F3E5" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#003024" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#001F18" stopOpacity="0.5" />
                    </linearGradient>
                </defs>

                {/* Dynamic Opacity: 
                   - Minimal: 0.6 (Visible but background)
                   - Default: 1.0 (Thick, bold for Auth pages)
                */}
                <g opacity={isMinimal ? "0.6" : "1"}>

                    {/* --- CORE SHAPES (Visible in both, providing flow) --- */}
                    <path d="M0,400 C150,300 250,520 420,420 C600,320 650,520 800,420 L800,600 L0,600 Z" fill="url(#g1)" />
                    <circle cx="650" cy="140" r="160" fill="url(#g2)" />
                    <circle cx="160" cy="120" r="110" fill="#71CB2A" opacity=".45" /> {/* Thicker opacity */}

                    {/* --- DECORATIVE ELEMENTS (Hidden in Minimal) --- */}
                    {!isMinimal && (
                        <>
                            {/* Existing Geometric Shapes */}
                            <rect x="50" y="300" width="80" height="80" rx="10" fill="#83C541" opacity="0.25" transform="rotate(45 50 300)" />
                            <rect x="700" y="400" width="60" height="60" rx="8" fill="#003024" opacity="0.15" transform="rotate(-30 700 400)" />

                            {/* --- NEW FRUIT SHAPES --- */}

                            {/* Apple Shape (Bottom Left) */}
                            <path
                                d="M120,450 C100,430 80,450 80,470 C80,500 100,530 120,530 C140,530 160,500 160,470 C160,450 140,430 120,450 Z M120,450 Q125,430 135,425"
                                fill="#83C541"
                                opacity="0.3"
                                transform="rotate(-15 120 480)"
                            />

                            {/* Pear Shape (Top Right) */}
                            <path
                                d="M680,180 C680,160 695,150 705,150 C715,150 730,160 730,180 C730,200 750,230 750,260 C750,290 730,310 705,310 C680,310 660,290 660,260 C660,230 680,200 680,180 Z"
                                fill="#F1F3E5"
                                opacity="0.6"
                            />

                            {/* Citrus/Round Fruit (Middle Right) */}
                            <circle cx="550" cy="350" r="25" fill="#71CB2A" opacity="0.5" />
                            <path d="M550,325 L550,335" stroke="#003024" strokeWidth="2" opacity="0.3" />

                            {/* Existing Leaves (Thicker) */}
                            <path d="M200,200 C220,180 240,190 250,210 C260,230 240,250 220,250 C200,250 180,230 190,210 C200,190 220,180 200,200Z" fill="#71CB2A" opacity="0.5" />
                            <path d="M500,300 C520,280 540,290 550,310 C560,330 540,350 520,350 C500,350 480,330 490,310 C500,290 520,280 500,300Z" fill="#83C541" opacity="0.5" />

                            {/* Floating Particles */}
                            <circle cx="400" cy="300" r="6" fill="#71CB2A" opacity="0.6" />
                            <circle cx="500" cy="200" r="8" fill="#83C541" opacity="0.5" />
                            <circle cx="300" cy="450" r="7" fill="#5AA321" opacity="0.5" />
                        </>
                    )}
                </g>
            </svg>
        </div>
    );
};

export default BackgroundArt;