// pages/ProductDetails.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Star,
    ChevronRight,
    ThumbsUp,
    ThumbsDown,
    Loader2,
    AlertCircle,
    CheckCircle,
    Package,
    User,
    Tag,
    MessageSquare,
    Store,
    Search,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react';

// API and Auth
import { api } from './api/home.api.js'; // Adjust path as needed
import { storageManager } from './utils/storageManager';
import { performRedirect, ROUTES } from './utils/routingManager'
// Utils (assuming you have these from other files)
import { LogoLightIcon } from "../shared/components/Logo";
import { showSuccess, showError } from '../shared/utils/alert'; // Adjust path
import Button from '../shared/components/Button'; // Adjust path

// --- Helper Components ---

/**
 * A reusable loading spinner
 */
const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
    </div>
);

/**
 * A reusable error message display
 */
const ErrorDisplay = ({ message }) => (
    <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {message === 'Product not found' ? '404 - Not Found' : 'An Error Occurred'}
        </h2>
        <p className="text-gray-600 mb-6">
            {message === 'Product not found'
                ? "We couldn't find the product you're looking for."
                : message}
        </p>
        <Link to="/">
            <Button>Go Back Home</Button>
        </Link>
    </div>
);

/**
 * Renders a star rating (read-only)
 */
const StarRating = ({ rating, size = 'sm' }) => {
    const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
    const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    return (
        <div className="flex items-center gap-0.5">
            {stars.map((isFilled, index) => (
                <Star
                    key={index}
                    className={`${isFilled ? 'text-yellow-400' : 'text-gray-300'
                        } ${sizeClass} fill-current`}
                />
            ))}
        </div>
    );
};

// --- Page-Specific Components ---

/**
 * Renders the breadcrumb navigation
 */
const Breadcrumbs = ({ product }) => (
    <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
            <li>
                <Link to="/" className="hover:text-green-600">
                    Home
                </Link>
            </li>
            <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li>
                <span className="hover:text-green-600 cursor-pointer">
                    {product.category?.name || 'Category'}
                </span>
            </li>
            <li>
                <ChevronRight className="w-4 h-4 text-gray-400" />
            </li>
            <li className="font-medium text-gray-700 truncate" aria-current="page">
                {product.name}
            </li>
        </ol>
    </nav>
);

/**
 * Renders the product image gallery
 */
const ProductGallery = ({ images = [], productName }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    // Use a placeholder if images array is empty or undefined
    const validImages = Array.isArray(images) ? images : [];
    const mainImage = validImages[activeIndex]?.url || 'https://via.placeholder.com/600?text=No+Image';

    return (
        <div className="flex flex-col gap-4">
            <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                <img
                    src={mainImage}
                    alt={`Main image of ${productName}`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>
            <div className="grid grid-cols-5 gap-2">
                {validImages.map((image, index) => (
                    <button
                        key={image.id || index}
                        onClick={() => setActiveIndex(index)}
                        className={`aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${index === activeIndex
                            ? 'border-green-600 shadow-md'
                            : 'border-transparent hover:border-gray-300'
                            }`}
                    >
                        <img
                            src={image.url}
                            alt={`Thumbnail ${index + 1} of ${productName}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

/**
 * Renders the main product info, price, and actions
 */
const ProductInfo = ({ product }) => {
    const variantStock = Array.isArray(product.variants)
        ? product.variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0)
        : 0;

    // overall availability boolean
    const isAvailable = variantStock > 0;
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-3">
                <StarRating rating={product.average_rating || 0} size="md" />
                <span className="text-sm text-gray-600">
                    ({product.reviews_count || 0} reviews)
                </span>
            </div>

            <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-green-600">
                    ${Number(product.discount_price || product.base_price).toFixed(2)}
                </span>
                {product.discount_price && (
                    <span className="text-xl text-gray-400 line-through">
                        ${Number(product.base_price).toFixed(2)}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Stock:</span>
                {isAvailable ? (
                    <span className="flex items-center gap-1.5 text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        In Stock ({variantStock})
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 text-sm text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-4 h-4" />
                        Out of Stock
                    </span>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 pt-2">
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    Category: <span className="font-medium text-gray-800">{product.category}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-600" />
                    Unit: <span className="font-medium text-gray-800">{product.unit.name} ({product.unit.symbol})</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                    <Store className="w-4 h-4 text-green-600" />
                    Seller: <span className="font-medium text-gray-800">{product.seller.store_name}</span>
                </div>
            </div>

            <div className="pt-4">
                <Button size="lg" className="w-full md:w-auto" disabled={!isAvailable}>
                    {!isAvailable ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </div>
        </div>
    );
}

/**
 * Renders the "Write a Review" form
 */
const ReviewForm = ({ product, onSubmitSuccess }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (rating === 0) newErrors.rating = 'Please select a rating.';
        if (comment.trim().length < 10) {
            newErrors.comment = 'Review must be at least 10 characters long.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const payload = {
                product_id: product.id,
                seller_id: product.seller.id,
                rating: rating,
                review_comment: comment,
                review_status: 'pending',
            };
            await api.submitReview(payload);
            showSuccess('Review submitted successfully! It will be visible after approval.');
            // Reset form
            setRating(0);
            setComment('');
            setErrors({});
            // Notify parent to refetch reviews
            onSubmitSuccess();
        } catch (error) {
            console.error('Failed to submit review:', error);
            showError(error.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Write your review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                    </label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`w-6 h-6 cursor-pointer transition-colors ${star <= rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-gray-300 hover:text-yellow-400'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    {errors.rating && <p className="text-xs text-red-600 mt-1">{errors.rating}</p>}
                </div>

                <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                        Your Review
                    </label>
                    <textarea
                        id="comment"
                        name="comment"
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts on the product..."
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    ></textarea>
                    {errors.comment && <p className="text-xs text-red-600 mt-1">{errors.comment}</p>}
                </div>

                <div className="text-right">
                    <Button type="submit" loading={submitting}>
                        Submit Review
                    </Button>
                </div>
            </form>
        </div>
    );
};

/**
 * Renders a single review card
 */
const ReviewCard = ({ review, onLike, onUnlike }) => {
    const defaultPhoto = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

    return (
        <article className="py-6 border-b border-gray-200 last:border-b-0">
            <div className="flex items-start gap-4">
                <img
                    src={review.user?.profile_photo || defaultPhoto}
                    alt={review.user?.name || 'Reviewer'}
                    className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900">
                                {review.user?.name || 'Anonymous User'}
                            </h4>
                            <p className="text-xs text-gray-500">
                                {new Date(review.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <StarRating rating={review.rating} />
                    </div>

                    <p className="text-sm text-gray-700 mt-3">{review.review_comment}</p>

                    {/* Like/Unlike buttons */}
                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={onLike}
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-green-600 transition-colors focus:outline-none"
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{review.likes_count || 0}</span>
                        </button>
                        <button
                            onClick={onUnlike}
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors focus:outline-none"
                        >
                            <ThumbsDown className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Seller Reply */}
                    {review.review_reply && (
                        <div className="mt-4 ml-4 pl-4 border-l-2 border-green-200 bg-green-50/50 p-4 rounded-r-lg">
                            <h5 className="text-sm font-semibold text-green-800">
                                Reply from seller
                            </h5>
                            <p className="text-sm text-gray-700 mt-1">{review.review_reply}</p>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

// --- Main Page Component ---

export default function ProductDetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [userRoles, setUserRoles] = useState([]);

    // Fetch user from storage on mount
    useEffect(() => {
        const userData = storageManager.getUserData();
        const tokens = storageManager.getTokens(); // Get tokens to check roles

        if (userData) {
            // user object contains id, name, email, and maybe 'seller' object
            setUser(userData);
        }

        if (tokens) {
            // Use the same robust role-checking logic as ProtectedRoutes
            const roles = tokens?.role
                ? (Array.isArray(tokens.role) ? tokens.role : [tokens.role])
                : (tokens?.roles ? tokens.roles : []);
            setUserRoles(roles);
        }
    }, []);

    // Fetch product and review data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // This Promise.all is now safe, because getProductReviews
            // will no longer throw a 404 error.
            const [productData, reviewsData] = await Promise.all([
                api.getProduct(productId),
                api.getProductReviews(productId)
            ]);

            setProduct(productData.data);
            console.log(productData.data);
            setReviews(reviewsData.data || []);

        } catch (err) {
            // This catch block will now only run for *actual* errors,
            // like the product 404 or a 500 server error.
            console.error('Error loading product page:', err);
            if (err.status === 404 || err.message.includes('Product not found')) {
                setError('Product not found');
            } else {
                setError(err.message || 'Failed to load product details.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchData();
    }, [productId]);

    // Function to check auth and redirect if needed
    const checkAuthAndRedirect = () => {
        if (!user) {
            showError('Please log in to perform this action.');
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/login', { state: { from: location.pathname } });
            return false;
        }
        return true;
    };

    // --- Event Handlers ---

    const handleLike = async (reviewId) => {
        if (!checkAuthAndRedirect()) return;

        try {
            await api.likeReview(reviewId);
            showSuccess('Review liked!');
            // Refetch all data to get updated like count
            fetchData();
        } catch (error) {
            console.error('Error liking review:', error);
            showError(error.data?.message || 'You may have already liked this review.');
        }
    };

    const handleUnlike = async (reviewId) => {
        if (!checkAuthAndRedirect()) return;

        try {
            await api.unlikeReview(reviewId);
            showSuccess('Review unliked!');
            // Refetch all data to get updated like count
            fetchData();
        } catch (error) {
            console.error('Error unliking review:', error);
            showError(error.data?.message || 'Could not unlike review.');
        }
    };

    const handleReviewSubmitted = () => {
        // Refetch reviews to show the new "pending" one if the API returns it
        api.getProductReviews(productId).then(reviewsData => {
            setReviews(reviewsData.data || []);
        });
    };

    // --- Memoized Values ---

    const { averageRating, totalReviews } = useMemo(() => {
        if (!reviews || reviews.length === 0) {
            return { averageRating: 0, totalReviews: 0 };
        }
        const total = reviews.reduce((acc, review) => acc + review.rating, 0);
        return {
            averageRating: (total / reviews.length).toFixed(1),
            totalReviews: reviews.length,
        };
    }, [reviews]);

    const canReview = user && userRoles.includes('buyer');
    const isOwner = user && product && user.seller?.id === product.seller.id;

    // --- Render Logic ---

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (!product) {
        return null; // Should be covered by loading/error states
    }

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4 lg:py-6">
                        <div className="flex items-center">
                            <div className="relative">
                                <div className="w-12 h-12 bg-linear-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                                    <LogoLightIcon className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-50 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold text-gray-900">AgriMeet</h1>
                                <p className="text-xs text-gray-500 -mt-1">
                                    Farm Fresh Marketplace
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 max-w-2xl mx-8 hidden sm:block">
                            <div className="relative group">
                                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search premium produce, organic products..."
                                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-green-600 focus:bg-white focus:outline-hidden transition-all text-gray-900 placeholder-gray-500"
                                    // value={searchQuery}
                                    // onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                className="hidden lg:flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all cursor-pointer"
                                onClick={() => performRedirect(ROUTES.LOGIN)}
                            >
                                <User className="w-5 h-5" />
                                <span className="text-sm font-medium">Account</span>
                            </button>

                            <button
                                className="relative flex items-center gap-2 px-2 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all cursor-pointer"
                                onClick={() => performRedirect(ROUTES.REGISTER)}
                            >
                                Get Started
                            </button>

                            {/* <button
                                onClick={() => setIsMenuOpen(true)}
                                className="p-2 sm:hidden rounded-lg hover:bg-gray-100"
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button> */}
                        </div>
                    </div>
                </div>
            </header>
            <main className="bg-gray-50/50">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {/* -- Breadcrumbs -- */}
                    <Breadcrumbs product={product} />

                    {/* -- Product Overview Section -- */}
                    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                            <ProductGallery images={product.images} productName={product.name} />
                            <ProductInfo product={product} />
                        </div>
                    </section>

                    {/* -- Description & Variants Section -- */}
                    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Product Description
                        </h2>
                        <div
                            className="prose prose-sm sm:prose-base max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />

                        {/* -- UPDATED: VARIANTS TABLE -- */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Available Sizes / Variants
                                </h3>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Variant
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Unit
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Stock
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Price
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {product.variants.map((variant) => (
                                                <tr key={variant.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {variant.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {variant.sku}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {variant.stock_quantity > 0 ? (
                                                            <span className="text-green-700">In Stock ({variant.stock_quantity})</span>
                                                        ) : (
                                                            <span className="text-red-700">Out of Stock</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                                        ${Number(variant.price).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {/* -- END VARIANTS TABLE -- */}
                    </section>

                    {/* -- Customer Reviews Section -- */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Customer Reviews ({totalReviews})
                        </h2>

                        {/* Summary */}
                        {totalReviews > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
                                <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
                                <div className="flex-1">
                                    <StarRating rating={averageRating} size="md" />
                                    <p className="text-sm text-gray-600">Based on {totalReviews} reviews</p>
                                </div>
                            </div>
                        )}

                        {/* Review List and Form */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
                                {totalReviews > 0 ? (
                                    <div className="divide-y divide-gray-200">
                                        {reviews.map((review) => (
                                            <ReviewCard
                                                key={review.id}
                                                review={review}
                                                onLike={() => handleLike(review.id)}
                                                onUnlike={() => handleUnlike(review.id)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
                                        <p className="text-sm text-gray-600 mt-1">Be the first to review this product!</p>

                                    </div>
                                )}
                            </div>

                            {/* Review Form */}
                            <div className="lg:col-span-1">
                                {canReview ? (
                                    isOwner ? (
                                        // Case 1: User is a buyer, but is the product owner
                                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                                            <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                You cannot review your own product
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Reviews are for buyers purchasing from other sellers.
                                            </p>
                                        </div>
                                    ) : (
                                        // Case 2: User is a buyer and NOT the owner
                                        <ReviewForm product={product} onSubmitSuccess={handleReviewSubmitted} />
                                    )
                                ) : (
                                    // Case 3: User is not logged in or is not a buyer
                                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Want to share your thoughts?</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Please log in as a buyer to write a review.
                                        </p>
                                        <Button onClick={checkAuthAndRedirect}>
                                            {user ? 'Not a Buyer Account' : 'Login to Review'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-linear-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center text-white">
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
                                <a
                                    href="#"
                                    aria-label="Facebook"
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <Facebook className="w-5 h-5 text-gray-600" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Twitter"
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <Twitter className="w-5 h-5 text-gray-600" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <Instagram className="w-5 h-5 text-gray-600" />
                                </a>
                                <a
                                    href="#"
                                    aria-label="LinkedIn"
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <Linkedin className="w-5 h-5 text-gray-600" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3">Marketplace</h5>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-green-600">
                                        Browse Products
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-600">
                                        Become a Seller
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-600">
                                        Pricing
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-600">
                                        Gift Cards
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h5 className="font-semibold mb-3">Support</h5>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>
                                    <a href="#" className="hover:text-green-600">
                                        Help Center
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-600">
                                        Shipping
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-600">
                                        Returns
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-green-600">
                                        Contact Us
                                    </a>
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

                    <div className="border-t border-gray-100 mt-8 pt-8 text-sm text-gray-500 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            © {new Date().getFullYear()} AgriMeet. All rights reserved.
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-green-600">
                                Terms
                            </a>
                            <a href="#" className="hover:text-green-600">
                                Privacy
                            </a>
                            <a href="#" className="hover:text-green-600">
                                Security
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}