import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import DashboardLayout from '../../../layouts/DashboardLayout';
import Input from '../../../shared/components/Input';
import Select from '../../../shared/components/Select';
import Button from '../../../shared/components/Button';
import { ConfirmationModal } from '../../../shared/components';
import { Loading } from '../../../shared/components/Loader';
import { showSuccess, showError } from '../../../shared/utils/alert';
import { getVariant, updateVariant, getUnits } from '../api/productsApi';

const EditVariant = () => {
    const { productId, variantId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock_quantity: '',
        unit_id: ''
    });
    const [attributes, setAttributes] = useState([{ attribute_id: '', value: '' }]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [units, setUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [originalData, setOriginalData] = useState(null);

    useEffect(() => {
        // Validate IDs
        if (!productId || !variantId) {
            showError('Invalid product or variant ID');
            navigate('/products');
            return;
        }

        loadData();
    }, [productId, variantId, navigate]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [variantResponse, unitsResponse] = await Promise.all([
                getVariant(productId, variantId),
                getUnits()
            ]);

            const variant = variantResponse.data || variantResponse;

            const mappedData = {
                name: variant.name || '',
                sku: variant.sku || '',
                price: String(variant.price || ''),
                stock_quantity: String(variant.stock_quantity || ''),
                unit_id: String(variant.unit_id || '')
            };

            setFormData(mappedData);
            setOriginalData(mappedData);

            // Map attributes
            if (variant.attributes && variant.attributes.length > 0) {
                setAttributes(variant.attributes.map(attr => ({
                    attribute_id: String(attr.attribute_id || ''),
                    value: attr.value || ''
                })));
            }

            setUnits(unitsResponse.data || []);
        } catch (error) {
            console.error('Error loading variant:', error);
            showError('Failed to load variant data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAttributeChange = (index, field, value) => {
        const newAttributes = [...attributes];
        newAttributes[index][field] = value;
        setAttributes(newAttributes);
    };

    const addAttribute = () => {
        setAttributes([...attributes, { attribute_id: '', value: '' }]);
    };

    const removeAttribute = (index) => {
        if (attributes.length > 1) {
            setAttributes(attributes.filter((_, i) => i !== index));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Variant name is required';
        if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.stock_quantity || formData.stock_quantity < 0) newErrors.stock_quantity = 'Valid stock quantity is required';
        if (!formData.unit_id) newErrors.unit_id = 'Unit is required';

        // Validate attributes
        attributes.forEach((attr, index) => {
            if (!attr.attribute_id.trim()) {
                newErrors[`attribute_${index}_id`] = 'Attribute ID is required';
            }
            if (!attr.value.trim()) {
                newErrors[`attribute_${index}_value`] = 'Attribute value is required';
            }
        });

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
            const variantData = {
                ...formData,
                attributes: attributes.map(attr => ({
                    attribute_id: parseInt(attr.attribute_id),
                    value: attr.value
                }))
            };

            const response = await updateVariant(productId, variantId, variantData);

            showSuccess(response.message || 'Variant updated successfully!');

            // Redirect back to products page
            navigate('/products');
        } catch (error) {
            console.error('Error updating variant:', error);

            if (error.message.includes('Session expired')) {
                showError('Session expired. Please login again.');
                navigate('/login');
            } else {
                showError(error.message || 'Error updating variant. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        // Check if form has been modified
        const hasChanges = originalData && (
            formData.name !== originalData.name ||
            formData.sku !== originalData.sku ||
            formData.price !== originalData.price ||
            formData.stock_quantity !== originalData.stock_quantity ||
            formData.unit_id !== originalData.unit_id
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
                            <Loading />
                            <p className="text-gray-600">Loading variant data...</p>
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
                            <h1 className="text-3xl font-bold text-gray-900">Edit Product Variant</h1>
                            <p className="text-gray-600">Update variant for product ID: {productId}</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Variant Information</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Variant Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Large Red T-Shirt"
                                error={errors.name}
                                required
                            />

                            <Input
                                label="SKU"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                placeholder="e.g., TSH-LRG-RED-001"
                                error={errors.sku}
                                required
                            />

                            <Input
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                placeholder="Enter price"
                                error={errors.price}
                                required
                                min="0"
                                step="0.01"
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
                                options={units.map(unit => ({ value: unit.id, label: unit.name }))}
                                placeholder="Select unit"
                                error={errors.unit_id}
                                required
                            />
                        </div>
                    </div>

                    {/* Attributes */}
                    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Attributes</h2>
                            <Button
                                type="button"
                                onClick={addAttribute}
                                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Attribute
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {attributes.map((attribute, index) => (
                                <div key={index} className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <Input
                                            label="Attribute ID"
                                            value={attribute.attribute_id}
                                            onChange={(e) => handleAttributeChange(index, 'attribute_id', e.target.value)}
                                            placeholder="e.g., 1 (Size)"
                                            error={errors[`attribute_${index}_id`]}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            label="Value"
                                            value={attribute.value}
                                            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                            placeholder="e.g., Large"
                                            error={errors[`attribute_${index}_value`]}
                                            required
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAttribute(index)}
                                        disabled={attributes.length === 1}
                                        className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

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
                            {isSubmitting ? 'Updating...' : 'Update Variant'}
                        </Button>
                    </div>
                </form>

                {/* Cancel Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    onConfirm={handleCancelConfirm}
                    title="Cancel Variant Edit"
                    message="You have unsaved changes. Are you sure you want to leave?"
                    confirmText="Leave"
                    cancelText="Continue Editing"
                    type="warning"
                />
            </div>
        </DashboardLayout>
    );
};

export default EditVariant;