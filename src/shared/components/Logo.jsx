import LogoImageIcon from '../../assets/images/Logo/Offwhite-Logo-transparent-bd.png';
import LogoImageText from '../../assets/images/Logo/Offwhite-Type-transprent-bd.png';
import LogoImage from '../../assets/images/Logo/logo-agrimeet.png';
import LogoImageDark from '../../assets/images/Logo/logo-auth-agrimeet.png';
import LogoImageIconDark from '../../assets/images/Logo/Logo-transparent-bd.png';
// Link
import { Link } from 'react-router-dom';

export const Logo = () => {
    return (
        <Link to={"/"}>
            <div
                className="grid place-self-center rounded-md text-white w-[70%] md:w-[25%] shadow-soft"
                aria-label="Agrimeet"
                title="Agrimeet"
            >
                <img src={LogoImage} alt="Agrimeet" className="w-full h-full object-contain" />
            </div>
        </Link>
    );
};

export const LogoMerge = ({ classNameDraw, classNameText, classNameMain }) => {
    return (
        <Link to={"/"}>
            <div className={`${classNameMain} flex h-[40px] w-[80%] overflow-hidden`}>
                <div
                    className={`grid place-self-center rounded-md text-white ${classNameDraw} shadow-soft w-[50%] `}
                    aria-label="Agrimeet"
                    title="Agrimeet"
                >
                    <img src={LogoImageIcon} alt="Agrimeet" className="w-full h-full object-contain" />
                </div>

                <div
                    className={`grid place-self-center rounded-md text-white ${classNameText} shadow-soft w-[100%] -ms-2`}
                    aria-label="Agrimeet"
                    title="Agrimeet"
                >
                    <img src={LogoImageText} alt="Agrimeet" className="w-full h-full object-contain" />
                </div>
            </div>
        </Link>
    );
}

export const LogoDark = () => {
    return (
        <Link to={"/"}>
            <div
                className="grid items-start rounded-md text-white w-[70%] md:hidden h-16 overflow-hidden"
                aria-label="Agrimeet"
                title="Agrimeet"
            >
                <img src={LogoImageDark} alt="Agrimeet" className="w-full h-full object-contain" />
            </div>
        </Link>
    );
}

export const LogoDarkIcon = () => {
    return (
        <Link to={"/"}>
            <div
                className="grid place-self-center rounded-md text-white w-[70%] md:w-[25%] shadow-soft"
                aria-label="Agrimeet"
                title="Agrimeet"
            >
                <img src={LogoImageIconDark} alt="Agrimeet" className="w-full h-full object-contain" />
            </div>
        </Link>
    );
};

export const LogoLightIcon = () => {
    return (
        <Link to={"/"}>
            <div
                className="grid place-self-center rounded-md text-white w-[70%] md:w-[95%] shadow-soft"
                aria-label="Agrimeet"
                title="Agrimeet"
            >
                <img src={LogoImageIcon} alt="Agrimeet" className="w-full h-full object-contain" />
            </div>
        </Link>
    );
};
