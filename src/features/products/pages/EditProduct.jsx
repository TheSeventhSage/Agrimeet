import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Save, Package } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import Textarea from '../../../shared/components/Textarea';
import Button from '../../../shared/components/Button';
import { ConfirmationModal } from '../../../shared/components';
import { generateSKU } from '../utils/skuGenerator';
import DocumentUpload from '../../../shared/components/DocumentUpload';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { getProduct, updateProduct, getCategories, getUnits } from '../api/productsApi';

const EditProduct = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        weight: '',
        slug: '',
        description: '',
        base_price: '',
        discount_price: '',
        stock_quantity: '',
        status: 'active',
        category_id: '',
        unit_id: ''
    });

    const [uploadedImages, setUploadedImages] = useState([]);
    const [thumbnailImages, setThumbnailImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);

    // Load product and categories on mount
    useEffect(() => {
        const loadData = async () => {
            if (!productId) {
                showError('Product ID not found');
                navigate('/products');
                return;
            }

            try {
                setIsLoading(true);
                const [productRes, categoriesRes, unitsRes] = await Promise.all([
                    getProduct(productId),
                    getCategories(),
                    getUnits()
                ]);

                const product = productRes?.data || productRes?.product || productRes;
                const fetchedCategories = categoriesRes?.data || [];
                const fetchedUnits = unitsRes.data || [];

                setCategories(fetchedCategories);
                setUnits(fetchedUnits);

                const findCategoryIdByName = (cats, nameToFind) => {
                    if (!nameToFind) return '';
                    for (const cat of cats) {
                        if (cat.name === nameToFind) return String(cat.id);
                        if (cat.children && cat.children.length > 0) {
                            const foundId = findCategoryIdByName(cat.children, nameToFind);
                            if (foundId) return foundId;
                        }
                    }
                    return '';
                };

                let resolvedCategoryId = '';
                if (typeof product.category === 'string') {
                    resolvedCategoryId = findCategoryIdByName(fetchedCategories, product.category);
                } else if (product.category?.id) {
                    resolvedCategoryId = String(product.category.id);
                } else if (product.category_id) {
                    resolvedCategoryId = String(product.category_id);
                }

                const mapped = {
                    name: product?.name || '',
                    sku: product?.sku || '',
                    weight: product?.weight ? String(product.weight) : '',
                    slug: product?.slug || '',
                    description: product?.description || '',
                    base_price: product?.base_price ? String(product.base_price) : '',
                    discount_price: product?.discount_price ? String(product.discount_price) : '',
                    stock_quantity: product?.stock_quantity ? String(product.stock_quantity) : '',
                    status: product?.status || 'active',
                    category_id: resolvedCategoryId,
                    unit_id: product?.unit?.id
                        ? String(product.unit.id)
                        : (product?.unit_id ? String(product.unit_id) : '')
                };
                setFormData(mapped);
                setOriginalData(mapped);

                const existing = (product?.images || []).map((img, index) => {
                    const url = typeof img === 'string' ? img : (img.url?.startsWith('http') ? img.url : `https://agrimeet.udehcoglobalfoodsltd.com/storage/${img.url}`);
                    return {
                        id: `existing-${index}-${Date.now()}`,
                        url: url
                    };
                });
                setExistingImages(existing);

            } catch (error) {
                console.error('Error loading product:', error);
                showError(error.message || 'Failed to load product data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [productId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const updatedData = { ...prev, [name]: value };

            // AUTOFILL LOGIC: Use unified utility
            if (name === 'name') {
                updatedData.sku = generateSKU(value);
            }

            return updatedData;
        });

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = (files) => {
        setUploadedImages(files);
    };

    const handleThumbnailUpload = (files) => {
        setThumbnailImages(files);
    };

    const removeExistingImage = (imageId) => {
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.base_price || Number(formData.base_price) <= 0) newErrors.base_price = 'Valid base price is required';
        if (!formData.category_id) newErrors.category_id = 'Category is required';
        if (!formData.unit_id) newErrors.unit_id = 'Unit is required';
        if (!formData.stock_quantity || Number(formData.stock_quantity) < 0) newErrors.stock_quantity = 'Valid stock quantity is required';

        if (existingImages.length === 0 && uploadedImages.length === 0 && thumbnailImages.length === 0) {
            newErrors.images = 'Provide at least one image (thumbnail or additional)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const urlToFile = async (url, filename, mimeType) => {
        try {
            // Attempt to fetch with CORS mode enabled. 
            // NOTE: If this fails, you MUST enable CORS on your backend server or use a Chrome Extension.
            const response = await fetch(url, {
                mode: 'cors',
                credentials: 'omit' // Sometimes helps with public buckets
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            return new File([blob], filename, { type: mimeType || blob.type });
        } catch (error) {
            console.error(`Error converting ${url} to file. This is likely a CORS issue.`, error);
            return null;
        }
    };

    const renderCategoryOptions = (cats, depth = 0) => {
        let options = [];
        if (!cats) return options;

        cats.forEach(cat => {
            const prefix = depth > 0 ? '\u00A0\u00A0'.repeat(depth) + '- ' : '';

            options.push({
                value: String(cat.id),
                label: `${prefix}${cat.name}`
            });

            if (cat.children && cat.children.length > 0) {
                options = [...options, ...renderCategoryOptions(cat.children, depth + 1)];
            }
        });
        return options;
    };

    const categoryOptions = renderCategoryOptions(categories);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const fd = new FormData();
            fd.append('name', formData.name);
            if (formData.sku) fd.append('sku', formData.sku);
            if (formData.weight) fd.append('weight', formData.weight);
            if (formData.slug) fd.append('slug', formData.slug);
            fd.append('description', formData.description);
            fd.append('base_price', formData.base_price);
            if (formData.discount_price) fd.append('discount_price', formData.discount_price);
            fd.append('stock_quantity', formData.stock_quantity);
            fd.append('status', formData.status);
            fd.append('category_id', formData.category_id);
            fd.append('unit_id', formData.unit_id);

            fd.append('_method', 'PUT');

            if (thumbnailImages.length > 0) {
                const thumbFile = thumbnailImages[0].file || thumbnailImages[0];
                fd.append('thumbnail', thumbFile);
            }

            // 1. Convert Existing Images
            const convertedExistingFiles = await Promise.all(
                existingImages.map(async (img, i) => {
                    return await urlToFile(img.url, `existing-${i}.jpg`, 'image/jpeg');
                })
            );

            // 2. Append Existing Images
            convertedExistingFiles.forEach(file => {
                if (file) {
                    fd.append('images[]', file);
                }
            });

            // 3. Append New Uploaded Images
            uploadedImages.forEach((img) => {
                const file = img.file || img;
                fd.append('images[]', file);
            });

            const response = await updateProduct(productId, fd);
            showSuccess(response?.message || 'Product updated successfully!');
            navigate('/products');
        } catch (error) {
            console.error('Error updating product:', error);
            showError(error.message || 'Error updating product. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleManageVariants = () => {
        navigate(`/products/${productId}/variants`);
    };

    const goBack = () => {
        const hasChanges = originalData && (
            formData.name !== originalData.name ||
            formData.sku !== originalData.sku ||
            formData.weight !== originalData.weight ||
            formData.description !== originalData.description ||
            formData.base_price !== originalData.base_price ||
            formData.discount_price !== originalData.discount_price ||
            formData.category_id !== originalData.category_id ||
            formData.stock_quantity !== originalData.stock_quantity ||
            uploadedImages.length > 0 ||
            existingImages.length !== (originalData.images?.length || 0)
        );

        if (hasChanges) {
            setShowCancelModal(true);
        } else {
            navigate('/products');
        }
    };

    const handleCancelConfirm = () => {
        setShowCancelModal(false);
        navigate('/products');
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading product data...</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={goBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                            <p className="text-gray-600">Update your product information</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                error={errors.name}
                                required
                            />

                            <Input
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                placeholder="e.g. PROD-001"
                                error={errors.sku}
                            />

                            <Input
                                label="Slug (Optional)"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                placeholder="product-slug (auto-generated if empty)"
                                error={errors.slug}
                            />

                            <Select
                                label="Category"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                options={categoryOptions}
                                placeholder="Select category"
                                error={errors.category_id}
                                required
                            />

                            <Input
                                label="Stock Quantity"
                                name="stock_quantity"
                                type="number"
                                value={formData.stock_quantity}
                                onChange={handleInputChange}
                                placeholder="Enter stock quantity"
                                error={errors.stock_quantity}
                                required
                                min="0"
                            />

                            <Select
                                label="Unit"
                                name="unit_id"
                                value={formData.unit_id}
                                onChange={handleInputChange}
                                options={units.map(unit => ({ value: String(unit.id), label: unit.name }))}
                                placeholder="Select unit"
                                error={errors.unit_id}
                                required
                            />

                            <Select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'draft', label: 'Draft' }]}
                                placeholder="Select status"
                                error={errors.status}
                                required
                            />

                            <Input
                                label="Weight"
                                name="weight"
                                type="number"
                                value={formData.weight}
                                onChange={handleInputChange}
                                placeholder="Enter weight (e.g. 0.5)"
                                error={errors.weight}
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="mt-6">
                            <Textarea
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter product description"
                                error={errors.description}
                                required
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Base Price"
                                name="base_price"
                                type="number"
                                value={formData.base_price}
                                onChange={handleInputChange}
                                placeholder="Enter base price"
                                error={errors.base_price}
                                required
                                min="0"
                                step="0.01"
                            />

                            <Input
                                label="Discount Price (Optional)"
                                name="discount_price"
                                type="number"
                                value={formData.discount_price}
                                onChange={handleInputChange}
                                placeholder="Enter discount price"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-4">
                                    Current Images ({existingImages.length})
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {existingImages.map((image) => (
                                        <div key={image.id} className="relative group">
                                            <img
                                                src={image.url}
                                                alt="Product"
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(image.id)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Thumbnail */}
                        <DocumentUpload
                            label="Product Thumbnail (optional)"
                            onChange={handleThumbnailUpload} // FIXED: Changed onUpload to onChange
                            error={errors.thumbnail}
                            multiple={false}
                            maxFiles={1}
                            helperText="PNG, JPG, GIF up to 10MB"
                        />

                        {/* Upload New Additional Images */}
                        <DocumentUpload
                            label="Add New Images (optional)"
                            onChange={handleImageUpload} // FIXED: Changed onUpload to onChange
                            error={errors.images}
                            multiple={true}
                            maxFiles={10}
                            helperText="PNG, JPG, GIF up to 10MB each"
                        />

                        {errors.images && (
                            <p className="text-sm text-red-600 mt-2">{errors.images}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            onClick={handleManageVariants}
                            className="px-6 py-2 border border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2"
                        >
                            <Package className="w-4 h-4" />
                            Manage Variants
                        </Button>

                        <div className="flex items-center gap-4">
                            <Button
                                type="button"
                                onClick={goBack}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                loading={isSubmitting}
                                className="px-6 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {isSubmitting ? 'Updating...' : 'Update Product'}
                            </Button>
                        </div>
                    </div>
                </form>

                {/* Cancel Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={handleCancelConfirm}
                    title="Cancel Product Edit"
                    message="You have unsaved changes. Are you sure you want to leave? All your changes will be lost."
                    confirmText="Leave"
                    cancelText="Continue Editing"
                    type="warning"
                />
            </div>
        </DashboardLayout>
    );
};

export default EditProduct;