// src/components/layout/Navbar.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Menu,
  X,
  Mail,
  Phone,
  Download,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';
import { LogoLightIcon } from '../../shared/components/Logo';
import { storageManager } from '../../shared/utils/storageManager';
import { contactDetails } from '../../shared/utils/contact';

const Navbar = ({ handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // --- Auth state logic is now inside the Navbar ---
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: {},
    userName: '',
    isSeller: false,
    roles: [],
  });

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = storageManager.hasActiveSession();
      if (isAuthenticated) {
        const userData = storageManager.getUserData();
        console.log(userData)
        const tokens = storageManager.getTokens();

        const userRoles = tokens?.role
          ? Array.isArray(tokens.role)
            ? tokens.role
            : [tokens.role]
          : tokens?.roles
            ? tokens.roles
            : []
          ;

        const isSeller = userRoles.includes('seller');
        console.log(isSeller);
        const name = isSeller ? userData?.user || userData?.data.first_name + ' ' + userData?.data.last_name : userData.roles.includes('admin') ? 'Admin' : userData.roles.includes('buyer') ? userData.user : '';
        console.log(name)

        setAuthState({
          isAuthenticated: true,
          userName: name || 'User',
          isSeller: isSeller,
          user: userData,
          roles: userRoles,
        });


      }
    };
    checkAuth();

    // Optional: Add event listener to update auth state on login/logout
    // window.addEventListener('authChange', checkAuth);
    // return () => window.removeEventListener('authChange', checkAuth);

  }, []); // Runs once on mount

  // --- Search logic is now inside the Navbar ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search query after navigation
    }
  };

  const logout = () => {
    handleLogout();
  };

  console.log(authState);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  // const user =/ user

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-green-800 text-white text-xs py-2 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{contactDetails.email}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <a href={`tel:${contactDetails.phoneNumber}`}>{contactDetails.phoneNumber}</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/contact" className="hover:underline">
              Help & Support
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 sm:px-[35px] lg:px-5 py-4">
        <div className="flex justify-between gap-4 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-linear-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <LogoLightIcon className="w-7 h-7 text-white" />
            </div>
            <h3 className="lg:block hidden lg:text-3xl font-bold text-gray-900">Agrimeet</h3>
          </div>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full md:w-[50%]"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, farmers..."
                className="w-full pl-4 pr-12 py-2 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 flex items-center justify-center border-l border-gray-200 text-gray-500 hover:text-green-600 cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Nav Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4 ml-">
            {authState.isAuthenticated ? (
              authState.isSeller ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-gray-900 font-semibold hover:text-green-600 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              ) : (
                <div className='flex gap-3'>
                  <button
                    onClick={() => authState.user.roles.includes('seller') ? navigate('/dashboard') : authState.user.roles.includes('admin') ? navigate('/admin/dashboard') : navigate('/login')}
                    className="text-gray-900 font-semibold hover:text-green-600 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Hi, {authState.userName}</span>
                  </button>
                  <button
                    className="bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-all transform active:scale-95 cursor-pointer"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-900 font-semibold hover:text-green-600 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </button>
                <button
                  className="bg-green-600 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-green-700 transition-all transform active:scale-95 cursor-pointer"
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(true)}>
              <Menu className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu (Drawer) */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[rgba(0,0,0,0.6)] z-50">
          <div className="fixed top-0 left-0 w-4/5 max-w-sm h-full bg-white shadow-xl overflow-y-auto z-60">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-linear-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <LogoLightIcon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="block text-2xl font-bold text-gray-900">Agrimeet</h3>
                </div>
                <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Welcome Message (only when authenticated) */}
              {authState.isAuthenticated && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 mb-6 border border-green-200">
                  <p className="text-green-800 text-sm font-medium mb-1">Welcome back!</p>
                  <p className="text-green-900 font-bold text-lg">{authState.userName}</p>
                </div>
              )}

              {/* Navigation Links */}
              {/* <nav className="flex flex-col gap-4 mb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="font-semibold text-gray-900 text-lg hover:text-green-600 transition-colors py-2"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav> */}

              {/* Auth Buttons Section */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                {authState.isAuthenticated && authState.isSeller ? (
                  <button
                    onClick={() => {
                      (authState.roles.includes('seller') || authState.roles.includes('seller')) ? navigate('/dashboard') : authState.roles.includes('admin') ? navigate('/admin/dashboard') : navigate('/');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <User className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <User className="w-5 h-5" />
                      <span>Login</span>
                    </button>
                    <button
                      className="w-full bg-transparent text-green-600 font-semibold py-3 px-6 rounded-2xl border border-green-600 hover:bg-green-700 hover:text-white transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      onClick={logout}
                    >
                      Logout
                    </button>
                    {(!authState.isAuthenticated && (
                      <button
                        onClick={() => {
                          navigate('/register');
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-green-600 font-semibold py-3 px-6 rounded-2xl border-2 border-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Register</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Download App Button */}
              {/* <button
                onClick={() => {
                  // Add your download app logic here
                  setIsMenuOpen(false);
                }}
                className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mb-6 shadow-md"
              >
                <Download className="w-5 h-5" />
                <span>Download App</span>
              </button> */}

              <div className='w-full'>
                {/* Social Links */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-gray-600 text-sm font-medium mb-4 text-center">
                    Connect with us
                  </p>
                  <div className="flex justify-center gap-4">
                    {socialLinks.map((social) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-green-600 hover:text-white transition-all"
                          aria-label={social.label}
                        >
                          <Icon className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center">
                  <p className="text-gray-500 text-xs">
                    © 2025 AgriMeet. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;