// pages/ProductDetails.jsx
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Star,
    ChevronRight,
    Loader2,
    AlertCircle,
    CheckCircle,
    Package,
    Tag,
    MessageSquare,
    Store,
} from 'lucide-react';
import { api } from './api/home.api.js';
import { storageManager } from '../shared/utils/storageManager.js';
import { showSuccess, showError } from '../shared/utils/alert';
import Button from '../shared/components/Button';
import Navbar from './components/Navbar';
import { NairaIcon } from '../shared/components/Currency';
import Footer from './components/Footer';

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
                    {product.category || 'Category'}
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
 * FIXED: Handles array of strings (URLs) correctly
 */
const ProductGallery = ({ images = [], productName }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    // Use a placeholder if images array is empty or undefined
    const validImages = Array.isArray(images) ? images : [];

    // FIX: Access the string directly, not .url
    const mainImage = validImages[activeIndex] || 'https://via.placeholder.com/600?text=No+Image';

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
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer border-2 transition-all ${index === activeIndex
                            ? 'border-green-600 shadow-md'
                            : 'border-transparent hover:border-gray-300'
                            }`}
                    >
                        <img
                            // FIX: Access the string directly
                            src={image}
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
 * FIXED: Accepts calculated averageRating and totalReviews as props
 */
const ProductInfo = ({ product, averageRating, totalReviews }) => {
    const variantStock = Array.isArray(product.variants)
        ? product.variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0)
        : 0;

    // Fallback to main stock_quantity if no variants or variants sum is 0
    // (Your JSON shows a main stock_quantity field)
    const finalStock = variantStock > 0 ? variantStock : (product.stock_quantity || 0);

    const isAvailable = finalStock > 0;

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-3">
                {/* FIX: Use passed props instead of missing product fields */}
                <StarRating rating={Number(averageRating) || 0} size="md" />
                <span className="text-sm text-gray-600">
                    ({totalReviews || 0} reviews)
                </span>
            </div>

            <div className="flex items-baseline gap-3 h-fit">
                <span className="text-3xl flex items-baseline font-bold text-[#15803d]">
                    <NairaIcon color='#15803d' size={24} className='inline font-[800]' />  <b>{Number(product.discount_price || product.base_price).toFixed(2)}</b>
                </span>
                {product.discount_price && (
                    <span className="text-xl text-gray-400 line-through">
                        ₦{Number(product.base_price).toFixed(2)}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Stock:</span>
                {isAvailable ? (
                    <span className="flex items-center gap-1.5 text-sm text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                        In Stock ({finalStock})
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 text-sm text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-4 h-4" />
                        Out of Stock
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 pt-2">
                <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    Category: <span className="font-medium text-gray-800">{product.category}</span>
                </div>
                {product.unit && (
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-600" />
                        Unit: <span className="font-medium text-gray-800">{product.unit.name} ({product.unit.symbol})</span>
                    </div>
                )}
                <div className="flex items-center gap-2 col-span-2">
                    <Store className="w-4 h-4 text-green-600" />
                    Seller: <span className="font-medium text-gray-800">{product.seller?.store_name || 'AgriMeet Seller'}</span>
                </div>
            </div>
            {/* 
            <div className="pt-4">
                <Button size="lg" className="w-full md:w-auto" disabled={!isAvailable}>
                    {!isAvailable ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </div> */}
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

    useEffect(() => {
        const userData = storageManager.getUserData();
        const tokens = storageManager.getTokens();

        if (userData) {
            setUser(userData);
        }

        if (tokens) {
            const roles = tokens?.role
                ? (Array.isArray(tokens.role) ? tokens.role : [tokens.role])
                : (tokens?.roles ? tokens.roles : []);
            setUserRoles(roles);
        }
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [productData, reviewsData] = await Promise.all([
                api.getProduct(productId),
                api.getProductReviews(productId)
            ]);

            setProduct(productData.data);
            setReviews(reviewsData.data || []);

        } catch (err) {
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

    useEffect(() => {
        fetchData();
    }, [productId]);

    const checkAuthAndRedirect = () => {
        if (!user) {
            showError('Please log in to perform this action.');
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate('/login', { state: { from: location.pathname } });
            return false;
        }
        return true;
    };

    const handleReviewSubmitted = () => {
        api.getProductReviews(productId).then(reviewsData => {
            setReviews(reviewsData.data || []);
        });
    };

    // --- Memoized Values for Ratings ---
    const { averageRating, totalReviews } = useMemo(() => {
        if (!reviews || reviews.length === 0) {
            return { averageRating: 0, totalReviews: 0 };
        }
        // Calculate average from the reviews array provided by the second API response
        const total = reviews.reduce((acc, review) => acc + (Number(review.rating) || 0), 0);
        return {
            averageRating: (total / reviews.length).toFixed(1),
            totalReviews: reviews.length,
        };
    }, [reviews]);

    const canReview = user && userRoles.includes('buyer');
    const isOwner = user && product && user.seller?.id === product.seller.id;

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    if (!product) {
        return null;
    }

    return (
        <>
            <Navbar />

            <main className="bg-gray-50/50">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                    {/* -- Breadcrumbs -- */}
                    <Breadcrumbs product={product} />

                    {/* -- Product Overview Section -- */}
                    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
                        <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-8 md:gap-12">
                            {/* Updated to use string arrays */}
                            <ProductGallery images={product.images} productName={product.name} />

                            {/* Updated to pass calculated ratings */}
                            <ProductInfo
                                product={product}
                                averageRating={averageRating}
                                totalReviews={totalReviews}
                            />
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

                        {product.variants && product.variants.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Available Variants
                                </h3>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Id
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sku
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
                                                        {variant.id}
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

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
                                {totalReviews > 0 ? (
                                    <div className="divide-y divide-gray-200">
                                        {reviews.map((review) => (
                                            <ReviewCard
                                                key={review.id}
                                                review={review}
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

                            <div className="lg:col-span-1">
                                {canReview ? (
                                    isOwner ? (
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
                                        <ReviewForm product={product} onSubmitSuccess={handleReviewSubmitted} />
                                    )
                                ) : (
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
            <Footer />
        </>
    );
}