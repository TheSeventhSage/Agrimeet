import { Logo } from '../shared/components/Logo';
import BackgroundArt from '../shared/components/BackgroundArt';
// import BgAgri from '../assets/images/bg-agri.jpg';

/**
 * Props:
 * - title, subtitle, footer
 * - mode: 'photo' | 'art'  (background style)
 */

const AuthLayout = ({ className, title, subtitle, footer, mode = 'art', children }) => {
    return (
        <div className={`min-h-screen relative overflow-hidden bg-linear-to-br from-brand-50 to-brand-100 ${className}`}>
            {/* Background based on mode */}
            {mode === 'art' ? (
                <div className="absolute inset-0">
                    <BackgroundArt className="absolute w-[120%] h-auto opacity-90" />
                    <div className="absolute inset-0 bg-linear-to-b from-white/40 via-white/20 to-transparent" />
                </div>
            ) : mode === 'photo' ? (
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-linear-to-br from-brand-900/55 via-brand-700/45 to-brand-600/35 mix-blend-multiply" />
                </div>
            ) : null}

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center min-h-screen p-4">
                {/* Logo */}
                <div className="mb-8">
                    <Logo />
                </div>

                <main className="w-full max-w-md">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-brand-800">{title}</h1>
                        {subtitle && <p className="text-brand-600 mt-2">{subtitle}</p>}
                    </div>

                    <div className="rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-white/40">
                        {children}
                    </div>

                    {footer && (
                        <div className="mt-6 text-center text-sm text-brand-700">
                            {footer}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AuthLayout;
