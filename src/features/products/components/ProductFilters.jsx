import React, { useState } from 'react';
import { Search } from 'lucide-react';

const ProductFilters = ({ onFilterChange }) => {
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedPriceRange, setSelectedPriceRange] = useState("All Price");
    const [priceRange, setPriceRange] = useState([0, 200]);
    const [searchTerm, setSearchTerm] = useState("");

    const categories = [
        "All Categories",
        "Fashion Men",
        "Women & Kid's",
        "Eye Ware & Sunglass",
        "Watches",
        "Electronics Items",
        "Furniture",
        "Headphones",
        "Beauty & Health",
        "Foot Ware"
    ];

    const priceRanges = [
        { label: "All Price", count: null, min: null, max: null },
        { label: "Below $200", count: 145, min: 0, max: 200 },
        { label: "$200 - $500", count: 1885, min: 200, max: 500 },
        { label: "$500 - $800", count: 2276, min: 500, max: 800 },
        { label: "$800 - $1000", count: 12676, min: 800, max: 1000 },
        { label: "$1000 - $1100", count: 13123, min: 1000, max: 1100 }
    ];

    const applyFilters = () => {
        const filters = {
            category: selectedCategory === "All Categories" ? null : selectedCategory,
            priceRange: selectedPriceRange === "All Price" ? null : {
                min: priceRanges.find(r => r.label === selectedPriceRange)?.min || priceRange[0],
                max: priceRanges.find(r => r.label === selectedPriceRange)?.max || priceRange[1]
            },
            searchTerm: searchTerm.trim() || null
        };

        if (onFilterChange) {
            onFilterChange(filters);
        }
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handlePriceRangeChange = (e) => {
        setSelectedPriceRange(e.target.value);
    };

    const handleCustomPriceChange = (index, value) => {
        const newRange = [...priceRange];
        newRange[index] = parseInt(value) || 0;
        setPriceRange(newRange);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="category"
                                value={category}
                                checked={selectedCategory === category}
                                onChange={handleCategoryChange}
                                className="text-orange-500 focus:ring-orange-500"
                            />
                            <span className="text-sm text-gray-700">{category}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Product Price */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Product Price</h4>
                <div className="space-y-2">
                    {priceRanges.map((range) => (
                        <label key={range.label} className="flex items-center justify-between cursor-pointer">
                            <div className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="priceRange"
                                    value={range.label}
                                    checked={selectedPriceRange === range.label}
                                    onChange={handlePriceRangeChange}
                                    className="text-orange-500 focus:ring-orange-500"
                                />
                                <span className="text-sm text-gray-700">{range.label}</span>
                            </div>
                            {range.count && (
                                <span className="text-xs text-gray-500">({range.count})</span>
                            )}
                        </label>
                    ))}
                </div>
            </div>

            {/* Custom Price Range */}
            <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Custom Price Range</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => handleCustomPriceChange(0, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-sm text-sm"
                        />
                        <span className="text-sm text-gray-500">to</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => handleCustomPriceChange(1, e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded-sm text-sm"
                        />
                    </div>
                    <div className="relative flex flex-col gap-6">
                        <input
                            type="range"
                            min="0"
                            max="2000"
                            value={priceRange[0]}
                            onChange={(e) => handleCustomPriceChange(0, e.target.value)}
                            className="w-full h-2 bg-gray-200 block rounded-lg appearance-none cursor-pointer slider"
                        />
                        <input
                            type="range"
                            min="0"
                            max="2000"
                            value={priceRange[1]}
                            onChange={(e) => handleCustomPriceChange(1, e.target.value)}
                            className="w-full h-2 bg-gray-200 block rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>
                </div>
            </div>

            {/* Apply Button */}
            <button
                type="button"
                onClick={applyFilters}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
            >
                Apply
            </button>
        </div>
    );
};

export default ProductFilters;
