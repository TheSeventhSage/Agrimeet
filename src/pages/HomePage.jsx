import { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import {
  X,
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  Play,
  Zap,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Leaf,
} from "lucide-react";
import { LogoLightIcon } from '../shared/components/Logo';
import { performRedirect, ROUTES } from "../shared/utils/routingManager";
import { images } from "../assets";
import VideoModal from "./VideoModal";
import ProductsList from "./components/ProductList";
import Navbar from './components/Navbar';


const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [categories, setCategories] = useState([]);
  // const [fetchingCategories, setFetchingCategories] = useState(true);

  // Hero Slides
  const heroSlides = [
    {
      title: "Farm to Table Excellence",
      subtitle: "Premium Quality Guaranteed",
      description:
        "Experience the finest agricultural products delivered fresh from local farms to your doorstep with our commitment to quality and sustainability.",
      cta: "Shop Premium Products",
      clickAction: () => (window.location.href = "/#products"),
      image: images.heroAgriMeet,
    },
    {
      title: "Supporting Local Agriculture",
      subtitle: "Community-Driven Marketplace",
      description:
        "Join our mission to support local farmers while enjoying the freshest produce, ethically sourced and sustainably grown.",
      cta: "Discover Local Farms",
      clickAction: () => (window.location.href = "/register"),
      image: images.heroAgriMeet2,
    },
    {
      title: "Natural, Sustaiable, and Fresh",
      subtitle: "Fresh farm foods at every turn",
      description:
        "Join our mission to support local farmers while enjoying the freshest produce, ethically sourced and sustainably grown.",
      cta: "Shop Now",
      clickAction: () => (window.location.href = "/#products"),
      image: images.heroAgriMeet3,
    },
  ];

  // Fetch categories
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       setFetchingCategories(true);
  //       const data = await api.getAllCategories();
  //       setCategories(data);
  //     } catch (error) {
  //       console.error("Failed to fetch categories:", error);
  //     } finally {
  //       setFetchingCategories(false);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  // Fetch products

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const [openVideo, setOpenVideo] = useState(false);

  // example YouTube embed url (use the embed form: https://www.youtube.com/embed/VIDEO_ID)
  const youtubeEmbed = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

  return (
    <div className="">
      {/* Premium Header */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-6 mb-12 md:mb-24">
          <section className="relative h-[550px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl col-span-3">
            {heroSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide
                  ? "opacity-[1]"
                  : "opacity-0 pointer-events-none"
                  }`}
              >
                <div className="absolute inset-0 bg-linear-to-r from-green-600/85 to-green-700/75"></div>
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center">
                  <div className="px-8 lg:px-16 text-white max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-4 py-2 rounded-full text-sm font-medium mb-6">
                      <Leaf className="w-4 h-4" />
                      {slide.subtitle}
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl mb-8 text-gray-100 leading-relaxed max-w-2xl">
                      {slide.description}
                    </p>
                    <button
                      className="bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl cursor-pointer"
                      onClick={slide.clickAction}
                    >
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 ${index === currentSlide
                    ? "w-8 h-3 bg-white rounded-full"
                    : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/70"
                    }`}
                />
              ))}
            </div>
          </section>

          {/* Vendor CTA */}
          <div className="bg-linear-to-br from-brand-600 via-brand-700 to-sidebar-600 rounded-xl p-8 mt-7 lg:mt-0 text-white relative overflow-hidden shadow-2xl flex flex-col justify-center">
            <div className="absolute inset-0 bg-linear-to-br from-black/10 to-black/20"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Start Selling Today</h3>
              <p className="text-green-50 mb-6 leading-relaxed">
                Join thousands of successful farmers on our premium marketplace
              </p>
              <button
                onClick={() => performRedirect(ROUTES.REGISTER)}
                className="w-full block bg-sidebar-100 text-sidebar-600 text-center font-semibold py-4 px-6 rounded-2xl hover:bg-brand-50 transition-all transform hover:scale-105 shadow-xl"
              >
                Become a Vendor
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-8" id="products">
          <ProductsList
            filters={{ status: "active" }}
            title="All Products"
            description="Premium quality products from verified farmers"
          />
        </div>
      </div>

      {/* Enhanced Vendor CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-green-600 via-green-700 to-green-600"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-40 right-40 w-60 h-60 bg-green-400/20 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs px-6 py-3 rounded-full text-white font-medium mb-8 shadow-lg">
              <Zap className="w-5 h-5" />
              Start Your Agricultural Business
            </div>

            <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Grow Your <span className="text-green-200">Farm Business</span>{" "}
              Online
            </h2>

            <p className="text-xl text-green-100 max-w-4xl mx-auto mb-16 leading-relaxed">
              Join our premium marketplace and connect with customers who value
              quality. Get the tools, support, and platform you need to scale
              your agricultural business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: TrendingUp,
                title: "Increase Revenue by 40%",
                description:
                  "Our sellers see average revenue increases within 3 months of joining our platform",
              },
              {
                icon: Users,
                title: "25,000+ Active Buyers",
                description:
                  "Connect with a growing community of customers who prioritize fresh, local produce",
              },
              {
                icon: Shield,
                title: "Seller Protection Program",
                description:
                  "Comprehensive protection with secure payments and dispute resolution support",
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-green-100 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <button
                className="bg-white text-green-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3 cursor-pointer"
                onClick={() => performRedirect(ROUTES.REGISTER)}
              >
                Start Selling Now
                <ArrowRight className="w-6 h-6" />
              </button>
              <button
                onClick={() => setOpenVideo(true)}
                className="bg-white/10 backdrop-blur-xs text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/20 flex items-center justify-center gap-3 cursor-pointer"
              >
                <Play className="w-6 h-6" />
                Watch Success Stories
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-green-100 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Secure payouts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                  <span>hello@agrimeet.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>123 Farm Lane, AgriTown</span>
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

      <VideoModal
        open={openVideo}
        onClose={() => setOpenVideo(false)}
        videoUrl={youtubeEmbed}
        title="Seller Success Story"
      />
    </div>
  );
};

export default Home;
