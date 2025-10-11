import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Plus, Trash2, Save } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import Textarea from '../../../shared/components/Textarea';
import Button from '../../../shared/components/Button';
import DocumentUpload from '../../../shared/components/DocumentUpload';
import { ConfirmationModal } from '../../../shared/components';
import { Loading } from '../../../shared/components/Loader';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { createProduct, getCategories, getUnits } from '../api/productsApi';
import { storageManager } from '../../../pages/utils/storageManager';
import { useNavigate } from 'react-router-dom';
const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        base_price: '',
        discount_price: '',
        unit_id: '',
        stock_quantity: '',
        status: 'active',
        category_id: '',
        sku: '',
        images: []
    });

    // const store = storageManager.getUserData();
    // console.log(store.data.seller.id);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [thumbnailImages, setThumbnailImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Add this with the other useState declarations
    const [units, setUnits] = useState([]);
    const navigate = useNavigate();

    // Load categories on component mount
    useEffect(() => {
        const loadFormData = async () => {
            try {
                setIsLoading(true);
                const [categoriesResponse, unitsResponse] = await Promise.all([
                    getCategories(),
                    getUnits()
                ]);

                // Flatten hierarchical categories into a flat array
                const flattenCategories = (categories) => {
                    let flatCategories = [];
                    categories.forEach(category => {
                        flatCategories.push(category);
                        if (category.children && category.children.length > 0) {
                            flatCategories = flatCategories.concat(flattenCategories(category.children));
                        }
                    });
                    return flatCategories;
                };

                setCategories(flattenCategories(categoriesResponse.data || []));
                setUnits(unitsResponse.data || []);
            } catch (error) {
                console.error('Error loading form data:', error);
                showError('Failed to load form data. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };

        loadFormData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageUpload = (files) => {
        setUploadedImages(files);
    };

    const handleThumbnailUpload = (files) => {
        setThumbnailImages(files);
    };

    // const removeImage = (imageId) => {
    //     setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    // };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.base_price || formData.base_price <= 0) newErrors.base_price = 'Valid base price is required';
        if (!formData.category_id) newErrors.category_id = 'Category is required';
        if (!formData.unit_id) newErrors.unit_id = 'Unit is required';
        if (!formData.stock_quantity || formData.stock_quantity < 0) newErrors.stock_quantity = 'Valid stock quantity is required';
        if (thumbnailImages.length === 0) newErrors.thumbnail = 'Thumbnail image is required';
        if (uploadedImages.length < 3) newErrors.images = 'At least 3 additional images are required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Get current user data
            const userData = storageManager.getUserData();
            if (!userData || !userData.data.id) {
                showError('User not authenticated. Please login again.');
                window.location.href = '/login';
                return;
            }

            // Create FormData for file upload
            const formDataToSend = new FormData();

            // Add basic product data
            formDataToSend.append('name', formData.name);
            if (formData.slug) {
                formDataToSend.append('slug', formData.slug);
            }
            formDataToSend.append('description', formData.description);
            formDataToSend.append('base_price', formData.base_price);
            if (formData.discount_price) {
                formDataToSend.append('discount_price', formData.discount_price);
            }
            formDataToSend.append('unit_id', formData.unit_id);
            formDataToSend.append('stock_quantity', formData.stock_quantity);
            formDataToSend.append('status', formData.status);
            formDataToSend.append('category_id', formData.category_id);
            formDataToSend.append('seller_id', userData.data.seller.id);

            // Add thumbnail
            if (thumbnailImages.length > 0) {
                formDataToSend.append('thumbnail', thumbnailImages[0].file);
            }

            // Add additional images
            uploadedImages.forEach((image, index) => {
                formDataToSend.append(`images[${index}]`, image.file);
            });

            console.log('Creating product with data:', {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                base_price: formData.base_price,
                discount_price: formData.discount_price,
                unit_id: formData.unit_id,
                stock_quantity: formData.stock_quantity,
                status: formData.status,
                category_id: formData.category_id,
                seller_id: userData.id,
                thumbnail: thumbnailImages[0]?.file?.name,
                images_count: uploadedImages.length
            });

            const response = await createProduct(formDataToSend);

            showSuccess(response.message || 'Product created successfully!');

            // Redirect to add variants page after successful creation
            const newProductId = response.data?.id || response.product?.id;
            if (newProductId) {
                navigate(`/products/${newProductId}/variants/add`);
            } else {
                // Fallback to products page if no ID returned
                navigate('/products');
            }
        } catch (error) {
            console.error('Error creating product:', error);

            // Handle different types of errors
            if (error.message.includes('Session expired')) {
                showError('Session expired. Please login again.');
                navigate('/login');
            } else if (error.message.includes('Validation error') || error.message.includes('invalid')) {
                showError('Please check your input and try again.');
            } else {
                showError(error.message || 'Error creating product. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        // Check if form has any data
        const hasData = formData.name || formData.description || formData.base_price ||
            formData.category_id || formData.sku || formData.stock_quantity ||
            uploadedImages.length > 0 || thumbnailImages.length > 0;

        if (hasData) {
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
                            <Loading />
                            <p className="text-gray-600">Loading form data...</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={goBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                            <p className="text-gray-600">Create a new product for your store</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
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
                                options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                                placeholder="Select category"
                                error={errors.category_id}
                                required
                            />

                            <Select
                                label="Unit"
                                name="unit_id"
                                value={formData.unit_id}
                                onChange={handleInputChange}
                                options={units.map(unit => ({ value: unit.id, label: unit.name }))}
                                placeholder="Select unit"
                                error={errors.unit_id}
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
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' },
                                    { value: 'draft', label: 'Draft' }
                                ]}
                                placeholder="Select status"
                                error={errors.status}
                                required
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

                    {/* Thumbnail */}
                    <DocumentUpload
                        label="Product Thumbnail"
                        onChange={handleThumbnailUpload}
                        error={errors.thumbnail}
                        multiple={false}
                        maxFiles={1}
                        helperText="PNG, JPG, GIF up to 10MB"
                    />

                    {/* Additional Images */}
                    <DocumentUpload
                        label="Additional Product Images"
                        onChange={handleImageUpload}
                        error={errors.images}
                        multiple={true}
                        maxFiles={10}
                        helperText="PNG, JPG, GIF up to 10MB each (minimum 3 required)"
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
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
                            {isSubmitting ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </form>

                {/* Cancel Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={handleCancelConfirm}
                    title="Cancel Product Creation"
                    message="You have unsaved changes. Are you sure you want to leave? All your progress will be lost."
                    confirmText="Leave"
                    cancelText="Continue Editing"
                    type="warning"
                />
            </div>
        </DashboardLayout>
    );
};

export default AddProduct;
