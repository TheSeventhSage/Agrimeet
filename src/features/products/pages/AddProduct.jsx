import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
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
import { storageManager } from '../../../shared/utils/storageManager';
import { generateSKU } from '../utils/skuGenerator';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();

    // Retrieve Seller ID from storage
    const store = storageManager.getUserData();
    const sellerId = store?.data?.seller?.id;

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        weight: '', // Added missing field
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
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDependencies();
    }, []);

    const loadDependencies = async () => {
        try {
            setIsLoading(true);
            const [categoriesResponse, unitsResponse] = await Promise.all([
                getCategories(),
                getUnits()
            ]);

            // Keep hierarchical structure (do not flatten)
            setCategories(categoriesResponse.data || []);
            setUnits(unitsResponse.data || []);
        } catch (error) {
            console.error('Error loading dependencies:', error);
            showError('Failed to load form data');
        } finally {
            setIsLoading(false);
        }
    };

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

        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleImageUpload = (files) => {
        setUploadedImages(files);
    };

    const handleThumbnailUpload = (files) => {
        setThumbnailImages(files);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.base_price) newErrors.base_price = 'Base price is required';
        if (!formData.stock_quantity) newErrors.stock_quantity = 'Stock quantity is required';
        if (!formData.category_id) newErrors.category_id = 'Category is required';
        if (!formData.unit_id) newErrors.unit_id = 'Unit is required';

        if (uploadedImages.length === 0 && thumbnailImages.length === 0) {
            newErrors.images = 'At least one image or thumbnail is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Recursive function to generate options with indentation for hierarchy
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
            showError('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();

            // Append Seller ID if available
            if (sellerId) {
                submitData.append('seller_id', sellerId);
            }

            // Append text fields
            Object.keys(formData).forEach(key => {
                if (formData[key] !== '' && formData[key] !== null) {
                    submitData.append(key, formData[key]);
                }
            });

            // Append Gallery Images
            uploadedImages.forEach((img) => {
                const file = img.file || img;
                submitData.append('images[]', file);
            });

            // Append Thumbnail
            if (thumbnailImages.length > 0) {
                const thumbFile = thumbnailImages[0].file || thumbnailImages[0];
                submitData.append('thumbnail', thumbFile);
            }

            const response = await createProduct(submitData);

            showSuccess('Product created successfully!');
            navigate('/products');

        } catch (error) {
            console.error('Error creating product:', error);
            showError(error.message || 'Failed to create product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        const hasData = Object.values(formData).some(val => val !== '' && val !== 'active') ||
            uploadedImages.length > 0;
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
                        <Loading />
                        <p className="text-gray-600 ml-3">Loading form data...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto pb-12">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <button
                            onClick={goBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-4"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                            <p className="text-gray-600 mt-1">Create a new product listing</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Organic Bananas"
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
                                required
                            />

                            <Input
                                label="Slug (Optional)"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                placeholder="Auto-generated if empty"
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
                                placeholder="0"
                                error={errors.stock_quantity}
                                required
                                min="0"
                            />

                            <Select
                                label="Unit"
                                name="unit_id"
                                value={formData.unit_id}
                                onChange={handleInputChange}
                                options={units.map(unit => ({
                                    value: String(unit.id),
                                    label: `${unit.name} (${unit.symbol})`
                                }))}
                                placeholder="Select unit"
                                error={errors.unit_id}
                                required
                            />

                            <Select
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'draft', label: 'Draft' },
                                    { value: 'inactive', label: 'Inactive' }
                                ]}
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
                                placeholder="Describe your product..."
                                error={errors.description}
                                required
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Base Price"
                                name="base_price"
                                type="number"
                                value={formData.base_price}
                                onChange={handleInputChange}
                                placeholder="0.00"
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
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Images</h2>

                        <DocumentUpload
                            label="Product Thumbnail (Required)"
                            onChange={handleThumbnailUpload}
                            error={errors.images}
                            multiple={false}
                            maxFiles={1}
                            helperText="PNG, JPG, GIF up to 10MB"
                        />

                        <DocumentUpload
                            label="Gallery Images"
                            onChange={handleImageUpload}
                            multiple={true}
                            maxFiles={5}
                            helperText="PNG, JPG, GIF up to 10MB each"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-4">
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