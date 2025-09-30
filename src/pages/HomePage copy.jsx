import { useState, useEffect } from 'react';
import {
    Search,
    User,
    Menu,
    X,
    Star,
    ArrowRight,
    Package,
    Shield,
    Users,
    TrendingUp,
    Play,
    Heart,
    Filter,
    ChevronRight,
    Zap,
    Award,
    Clock,
    CheckCircle,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
    Leaf,
    Sprout,
    Apple,
    Wheat,
    Milk,
    Drumstick,
    Flower,
    Wrench,
    Eye,
    CreditCard,
    Headphones,
    Globe,
    ChevronDown,
} from 'lucide-react';
import { performRedirect, ROUTES } from './utils/routingManager';
import { LogoLightIcon } from '../shared/components/Logo';
import { api } from './api/home.api';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(true);

    const colors = {
        primary: 'bg-green-600',
        primaryHover: 'hover:bg-green-700',
        primaryLight: 'bg-green-50',
        primaryText: 'text-green-600',
        primaryGradient: 'from-green-600 to-green-700'
    };

    // Default icon mapping for categories
    const categoryIconMap = {
        'vegetables': Leaf,
        'fruits': Apple,
        'grains': Wheat,
        'dairy': Milk,
        'meat': Drumstick,
        'herbs': Flower,
        'seeds': Sprout,
        'tools': Wrench,
    };

    // Get icon for category based on name or slug
    const getCategoryIcon = (category) => {
        const slug = category.slug?.toLowerCase() || '';
        const name = category.name?.toLowerCase() || '';

        // Try to match by slug or name
        for (const [key, icon] of Object.entries(categoryIconMap)) {
            if (slug.includes(key) || name.includes(key)) {
                return icon;
            }
        }

        // Default icon
        return Package;
    };

    // Enhanced mock products
    const mockProducts = {
        vegetables: [
            {
                id: 1,
                name: 'Organic Baby Spinach',
                price: 3.50,
                originalPrice: 4.20,
                image: '/api/placeholder/300/300',
                rating: 4.8,
                reviews: 156,
                seller: 'Green Valley Farm',
                location: 'California',
                inStock: true,
                fastDelivery: true,
                organic: true
            },
            {
                id: 2,
                name: 'Heirloom Tomatoes',
                price: 5.99,
                originalPrice: 7.50,
                image: '/api/placeholder/300/300',
                rating: 4.9,
                reviews: 89,
                seller: 'Sunset Gardens',
                location: 'Oregon',
                inStock: true,
                fastDelivery: true,
                organic: true
            },
        ]
    };

    // Premium hero slides
    const heroSlides = [
        {
            title: 'Farm to Table Excellence',
            subtitle: 'Premium Quality Guaranteed',
            description: 'Experience the finest agricultural products delivered fresh from local farms to your doorstep with our commitment to quality and sustainability.',
            cta: 'Shop Premium Products',
            image: '/api/placeholder/800/500'
        },
        {
            title: 'Supporting Local Agriculture',
            subtitle: 'Community-Driven Marketplace',
            description: 'Join our mission to support local farmers while enjoying the freshest produce, ethically sourced and sustainably grown.',
            cta: 'Discover Local Farms',
            image: '/api/placeholder/800/500'
        }
    ];

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setFetchingCategories(true);
                const data = await api.getAllCategories();

                // Transform API data to match component needs
                const transformedCategories = data.map(cat => ({
                    id: cat.slug,
                    name: cat.name,
                    icon: getCategoryIcon(cat),
                    count: '0',
                    description: cat.description || 'Browse our selection'
                }));

                setCategories(transformedCategories);

                // Set first category as selected if available
                if (transformedCategories.length > 0) {
                    setSelectedCategory(transformedCategories[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                // You could show an error message to the user here
            } finally {
                setFetchingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // Handle category selection
    const handleCategoryClick = async (categoryId) => {
        setLoading(true);
        setSelectedCategory(categoryId);

        // Simulate API call for products
        setTimeout(() => {
            const products = mockProducts[categoryId] || [];
            setCategoryProducts(products);
            setLoading(false);
        }, 500);
    };

    // Auto-rotate hero slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroSlides.length]);

    // Load products when category changes
    useEffect(() => {
        if (selectedCategory) {
            handleCategoryClick(selectedCategory);
        }
    }, [selectedCategory]);

    return (
        <div className="">
            {/* Premium Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4 lg:py-6">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                                    <LogoLightIcon className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-50 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold text-gray-900">AgriMeet</h1>
                                <p className="text-xs text-gray-500 -mt-1">Farm Fresh Marketplace</p>
                            </div>
                        </div>

                        <div className="flex-1 max-w-2xl mx-8 hidden sm:block">
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search premium produce, organic products..."
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-600 focus:bg-white focus:outline-none transition-all text-gray-900 placeholder-gray-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="hidden lg:flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all">
                                <User className="w-5 h-5" />
                                <span className="text-sm font-medium">Account</span>
                            </button>

                            <button className="relative flex items-center gap-2 px-2 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all" onClick={() => performRedirect(ROUTES.REGISTER)}>
                                Get Started
                            </button>

                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 sm:hidden rounded-lg hover:bg-gray-100"
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex">
                    <div className="w-80 bg-white h-full shadow-2xl p-6 overflow-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow">
                                    <Leaf className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">AgriMeet</h3>
                                    <p className="text-xs text-gray-500">Farm Fresh Marketplace</p>
                                </div>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="space-y-3">
                            {categories.map(cat => {
                                const Icon = cat.icon;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => { handleCategoryClick(cat.id); setIsMenuOpen(false); }}
                                        className={`w-full text-left flex items-center gap-3 p-3 rounded-lg ${selectedCategory === cat.id ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedCategory === cat.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold text-sm">{cat.name}</div>
                                            <div className="text-xs text-gray-500">{cat.description}</div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className='grid grid-cols-1 lg:grid-cols-4 lg:gap-6 mb-12 md:mb-24'>
                    <section className="relative h-[550px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl col-span-3">
                        {heroSlides.map((slide, index) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-green-600/95 to-green-700/95"></div>
                                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                                <div className="absolute inset-0 flex items-center">
                                    <div className="px-8 lg:px-16 text-white max-w-3xl">
                                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                                            <Leaf className="w-4 h-4" />
                                            {slide.subtitle}
                                        </div>
                                        <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">{slide.title}</h1>
                                        <p className="text-xl mb-8 text-gray-100 leading-relaxed max-w-2xl">{slide.description}</p>
                                        <button className="bg-white text-green-600 px-8 py-4 rounded-2xl font-semibold hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl">
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
                                    className={`transition-all duration-300 ${index === currentSlide ? 'w-8 h-3 bg-white rounded-full' : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'}`}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Vendor CTA */}
                    <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-sidebar-600 rounded-xl p-8 mt-7 lg:mt-0 text-white relative overflow-hidden shadow-2xl flex flex-col justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/20"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Start Selling Today</h3>
                            <p className="text-green-50 mb-6 leading-relaxed">Join thousands of successful farmers on our premium marketplace</p>
                            <button onClick={() => performRedirect(ROUTES.REGISTER)} className="w-full block bg-sidebar-100 text-sidebar-600 text-center font-semibold py-4 px-6 rounded-2xl hover:bg-brand-50 transition-all transform hover:scale-105 shadow-xl">
                                Become a Vendor
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
                    {/* Categories Sidebar */}
                    <aside className="hidden lg:block sticky top-28 self-start max-h-screen overflow-y-auto rounded-2xl">
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 space-y-6">
                            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5">
                                <h3 className="font-bold text-white text-lg flex items-center gap-3">
                                    <Filter className="w-5 h-5" />
                                    Product Categories
                                </h3>
                                <p className="text-green-100 text-sm mt-1">Browse our premium selection</p>
                            </div>
                            <div className="p-6 max-h-[500px] overflow-auto">
                                {fetchingCategories ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                    </div>
                                ) : categories.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No categories available</p>
                                ) : (
                                    categories.map((category) => {
                                        const IconComponent = category.icon;
                                        return (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryClick(category.id)}
                                                disabled={loading}
                                                className={`w-full group relative overflow-hidden rounded-2xl p-4 mb-3 transition-all duration-300 transform hover:scale-[1.02] ${selectedCategory === category.id
                                                    ? 'bg-green-50 border-2 border-green-600 shadow-lg'
                                                    : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'}`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${selectedCategory === category.id
                                                        ? 'bg-green-600 text-white shadow-lg'
                                                        : 'bg-gray-100 text-gray-600 group-hover:bg-green-50 group-hover:text-green-600'}`}>
                                                        <IconComponent className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <h4 className="font-semibold text-gray-900 group-hover:text-green-900">{category.name}</h4>
                                                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{category.description}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* Products Area */}
                    <main className="space-y-8">
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                            {categories.find((c) => c.id === selectedCategory)?.name || 'Products'}
                                        </h2>
                                        <p className="text-gray-600">Premium quality products from verified farmers</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                {loading ? (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                    </div>
                                ) : categoryProducts.length === 0 ? (
                                    <div className="p-12 flex flex-col items-center justify-center text-center">
                                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                            <Package className="w-12 h-12 text-gray-400" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                                        <p className="text-sm text-gray-500 max-w-lg">
                                            We're working with farmers to bring more items to this category.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {categoryProducts.map((product) => (
                                            <div key={product.id} className="group relative bg-white border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:scale-[1.02]">
                                                <div className="absolute top-4 left-4 z-10 space-y-2">
                                                    {product.organic && (
                                                        <span className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">Organic</span>
                                                    )}
                                                </div>

                                                <button className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white shadow-sm transition-all">
                                                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                                                </button>

                                                <div className="relative mb-6 rounded-2xl overflow-hidden bg-gray-50">
                                                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                                </div>

                                                <div className="space-y-3">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {product.seller} • {product.location}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 text-yellow-400" />
                                                            <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                                                        </div>
                                                        <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</span>
                                                            {product.originalPrice && (
                                                                <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <button className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-2xl hover:bg-green-700 transition-all transform active:scale-95">
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Enhanced Vendor CTA Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-green-600"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="absolute top-40 right-40 w-60 h-60 bg-green-400/20 rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full text-white font-medium mb-8 shadow-lg">
                            <Zap className="w-5 h-5" />
                            Start Your Agricultural Business
                        </div>

                        <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                            Grow Your <span className="text-green-200">Farm Business</span> Online
                        </h2>

                        <p className="text-xl text-green-100 max-w-4xl mx-auto mb-16 leading-relaxed">
                            Join our premium marketplace and connect with customers who value quality.
                            Get the tools, support, and platform you need to scale your agricultural business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                icon: TrendingUp,
                                title: "Increase Revenue by 40%",
                                description: "Our sellers see average revenue increases within 3 months of joining our platform"
                            },
                            {
                                icon: Users,
                                title: "25,000+ Active Buyers",
                                description: "Connect with a growing community of customers who prioritize fresh, local produce"
                            },
                            {
                                icon: Shield,
                                title: "Seller Protection Program",
                                description: "Comprehensive protection with secure payments and dispute resolution support"
                            }
                        ].map((benefit, idx) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-4">{benefit.title}</h3>
                                    <p className="text-green-100 leading-relaxed">{benefit.description}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                            <button className="bg-white text-green-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-green-50 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-3" onClick={() => performRedirect(ROUTES.KYC_REGISTER)}>
                                Start Selling Now
                                <ArrowRight className="w-6 h-6" />
                            </button>
                            <button className="bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border-2 border-white/20 flex items-center justify-center gap-3"  >
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
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white">
                                    <Leaf className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold">AgriMeet</h4>
                                    <p className="text-sm text-gray-500">Farm Fresh Marketplace</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 max-w-sm">Connecting local farmers with customers who value sustainable, high-quality produce.</p>
                            <div className="flex items-center gap-3 mt-4">
                                <a href="#" aria-label="Facebook" className="p-2 rounded-lg hover:bg-gray-100"><Facebook className="w-5 h-5 text-gray-600" /></a>
                                <a href="#" aria-label="Twitter" className="p-2 rounded-lg hover:bg-gray-100"><Twitter className="w-5 h-5 text-gray-600" /></a>
                                <a href="#" aria-label="Instagram" className="p-2 rounded-lg hover:bg-gray-100"><Instagram className="w-5 h-5 text-gray-600" /></a>
                                <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg hover:bg-gray-100"><Linkedin className="w-5 h-5 text-gray-600" /></a>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3">Marketplace</h5>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-green-600">Browse Products</a></li>
                                <li><a href="#" className="hover:text-green-600">Become a Seller</a></li>
                                <li><a href="#" className="hover:text-green-600">Pricing</a></li>
                                <li><a href="#" className="hover:text-green-600">Gift Cards</a></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3">Support</h5>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-green-600">Help Center</a></li>
                                <li><a href="#" className="hover:text-green-600">Shipping</a></li>
                                <li><a href="#" className="hover:text-green-600">Returns</a></li>
                                <li><a href="#" className="hover:text-green-600">Contact Us</a></li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3">Contact</h5>
                            <div className="text-sm text-gray-600 space-y-3">
                                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>hello@agrimeet.com</span></div>
                                <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>+1 (555) 123-4567</span></div>
                                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>123 Farm Lane, AgriTown</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 mt-8 pt-8 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>Â© {new Date().getFullYear()} AgriMeet. All rights reserved.</div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-green-600">Terms</a>
                            <a href="#" className="hover:text-green-600">Privacy</a>
                            <a href="#" className="hover:text-green-600">Security</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;