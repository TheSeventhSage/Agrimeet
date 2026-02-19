
import { Link } from 'react-router-dom';
import {
    X,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";
import { LogoLightIcon } from '../../shared/components/Logo';
import { contactDetails } from '../../shared/utils/contact';

const Footer = () => (
    <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div className="flex  flex-col justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-linear-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <LogoLightIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold">AgriMeet</h4>
                            <p className="text-sm text-gray-500">
                                Farm Fresh Marketplace
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 max-w-sm">
                        Connecting local farmers with customers who value sustainable,
                        high-quality produce.
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                        <Link
                            to="#"
                            aria-label="Facebook"
                            className="p-1 rounded-lg hover:bg-gray-100"
                        >
                            <Facebook className="w-5 h-5 text-gray-600" />
                        </Link>
                        <Link
                            to="#"
                            aria-label="Twitter"
                            className="p-1 rounded-lg hover:bg-gray-100"
                        >
                            <Twitter className="w-5 h-5 text-gray-600" />
                        </Link>
                        <Link
                            to="#"
                            aria-label="Instagram"
                            className="p-1 rounded-lg hover:bg-gray-100"
                        >
                            <Instagram className="w-5 h-5 text-gray-600" />
                        </Link>
                        <Link
                            to="#"
                            aria-label="LinkedIn"
                            className="p-1 rounded-lg hover:bg-gray-100"
                        >
                            <Linkedin className="w-5 h-5 text-gray-600" />
                        </Link>
                    </div>
                </div>

                <div>
                    <h5 className="font-semibold mb-3">Marketplace</h5>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                            <a href="#products" className="hover:text-green-600">
                                Browse Products
                            </a>
                        </li>
                        <li>
                            <button className="hover:text-green-600" onClick={() => performRedirect(ROUTES.REGISTER)}>
                                Become a Seller
                            </button>
                            {/* <Link to="/register" >
                       
                      </Link> */}
                        </li>
                        <li>
                            <Link to="/terms" className="hover:text-green-600">
                                Terms & Conditions
                            </Link>
                        </li>
                        {/* <li>
                      <Link to="/pricing" className="hover:text-green-600">
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link to="/gift-cards" className="hover:text-green-600">
                        Gift Cards
                      </Link>
                    </li> */}
                    </ul>
                </div>

                <div>
                    <h5 className="font-semibold mb-3">Support</h5>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>
                            <Link to="/help-support" className="hover:text-green-600">
                                Help Center
                            </Link>
                        </li>
                        <li>
                            <Link to="/privacy-policy" className="hover:text-green-600">
                                Privacy
                            </Link>
                        </li>
                        <li>
                            <Link to="/faqs" className="hover:text-green-600">
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="hover:text-green-600">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h5 className="font-semibold mb-3">Contact</h5>
                    <div className="text-sm text-gray-600 space-y-3">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{contactDetails.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{contactDetails.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{contactDetails.address}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 mt-8 pt-8 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-center gap-4">
                <div>
                    © {new Date().getFullYear()} AgriMeet. All rights reserved.
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;