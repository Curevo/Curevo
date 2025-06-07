import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, X, Edit3, Eye } from "lucide-react";
import { useAxiosInstance } from "@/Config/axiosConfig.js";

const ProductManagement = () => {
    const axios = useAxiosInstance();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [allStores, setAllStores] = useState([]); // State for all available stores

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');

    // Refs for file inputs to clear them programmatically
    const primaryImageInputRef = useRef(null);
    const hoverImageInputRef = useRef(null);

    // State for image files to be sent (will be null if not selected)
    const [primaryImageFile, setPrimaryImageFile] = useState(null);
    const [hoverImageFile, setHoverImageFile] = useState(null);

    // Consolidated currentProduct state
    const [currentProduct, setCurrentProduct] = useState({
        productId: null,
        name: "",
        description: "",
        image: "", // This will store the URL from the backend for display
        hoverImage: "", // This will store the URL from the backend for display
        quantity: "",
        prescriptionRequired: false,
        category: "",
        price: 0,
        inventoryDetails: [], // Array of { storeId, stock, inventoryId (for existing) }
    });

    // State for 'View Stock' modal
    const [isViewStockModalOpen, setIsViewStockModalOpen] = useState(false);
    const [productInStockView, setProductInStockView] = useState(null);

    // --- Data Fetching ---

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/products/categories');
            if (response.data.success) {
                setCategories(response.data.data);
            } else {
                console.error("Failed to fetch categories:", response.data.message);
                setError(response.data.message || "Failed to load categories.");
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories for the form.");
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/products/get-all-with-inventory'); // Assuming this now returns ProductWithInventoryDTOs
            setProducts(response.data.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch products. Please try again later.");
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllStores = async () => {
        try {
            const response = await axios.get('/api/stores');
            if (response.data.success) {
                setAllStores(response.data.data);
            } else {
                console.error("Failed to fetch stores:", response.data.message);
                setError(response.data.message || "Failed to load stores.");
            }
        } catch (err) {
            console.error("Error fetching stores:", err);
            setError("Failed to load stores for inventory management.");
        }
    };

    // Load initial data on component mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchAllStores();
    }, []);

    // --- Form State Management ---

    // Function to reset currentProduct form state and file inputs
    const resetCurrentProduct = () => {
        setCurrentProduct({
            productId: null,
            name: "",
            description: "",
            image: "",
            hoverImage: "",
            quantity: "",
            prescriptionRequired: false,
            category: "",
            price: 0,
            inventoryDetails: [],
        });
        setPrimaryImageFile(null);
        setHoverImageFile(null);
        if (primaryImageInputRef.current) primaryImageInputRef.current.value = '';
        if (hoverImageInputRef.current) hoverImageInputRef.current.value = '';
        setError(null); // Clear any previous errors
    };

    // Handle general text/select input changes for currentProduct
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle number input changes for currentProduct (price)
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    // Handle image file selection (stores the File object)
    const handleFileChange = (e, fieldName) => { // fieldName can be 'primaryImageFile' or 'hoverImageFile'
        const file = e.target.files[0];
        if (fieldName === 'primaryImageFile') {
            setPrimaryImageFile(file);
        } else if (fieldName === 'hoverImageFile') {
            setHoverImageFile(file);
        }
    };

    // **FIXED:** Handle prescription requirement change
    const handlePrescriptionChange = (newValue) => {
        setCurrentProduct(prev => ({
            ...prev,
            prescriptionRequired: newValue // newValue is already a boolean (true or false)
        }));
    };

    // --- Inventory Details Management within Modal ---

    // Adds a new empty row for inventory details
    const handleAddInventoryRow = () => {
        setCurrentProduct(prev => ({
            ...prev,
            inventoryDetails: [...prev.inventoryDetails, { storeId: '', stock: '' }]
        }));
    };

    // Removes an inventory row by index
    const handleRemoveInventoryRow = (index) => {
        setCurrentProduct(prev => ({
            ...prev,
            inventoryDetails: prev.inventoryDetails.filter((_, i) => i !== index)
        }));
    };

    // Handles changes in storeId or stock for a specific inventory row
    const handleInventoryDetailChange = (index, field, value) => {
        const updatedInventoryDetails = [...currentProduct.inventoryDetails];
        updatedInventoryDetails[index] = {
            ...updatedInventoryDetails[index],
            // **FIXED:** Ensure storeId is also parsed as integer, or empty string if not selected
            [field]: field === 'stock' ? (parseInt(value, 10) || 0) : (field === 'storeId' ? (value === '' ? '' : parseInt(value, 10)) : value)
        };
        setCurrentProduct(prev => ({
            ...prev,
            inventoryDetails: updatedInventoryDetails
        }));
    };

    // --- Modal Control Functions ---

    const openAddModal = () => {
        setModalMode('add');
        resetCurrentProduct(); // Clear form and file inputs
        // Initialize with one empty inventory row for new product
        setCurrentProduct(prev => ({ ...prev, inventoryDetails: [{ storeId: '', stock: '' }] }));
        setIsProductModalOpen(true);
    };

    const openEditModal = (product) => {
        setModalMode('edit');
        // Populate currentProduct state with data from the selected product
        setCurrentProduct({
            productId: product.productId,
            name: product.name,
            description: product.description || "",
            image: product.image || "", // Use existing URL for display
            hoverImage: product.hoverImage || "", // Use existing URL for display
            quantity: product.quantity || "",
            prescriptionRequired: product.prescriptionRequired,
            category: product.category,
            price: product.price,
            inventoryDetails: product.inventoryDetails.map(detail => ({
                inventoryId: detail.inventoryId, // Crucial for backend updates
                storeId: detail.storeId,
                stock: detail.stock,
                storeName: detail.storeName // Keep for display if available
            })) || [],
        });
        // Clear file inputs, so user has to select new ones if they want to update
        setPrimaryImageFile(null);
        setHoverImageFile(null);
        if (primaryImageInputRef.current) primaryImageInputRef.current.value = '';
        if (hoverImageInputRef.current) hoverImageInputRef.current.value = '';
        setIsProductModalOpen(true);
    };

    const closeProductModal = () => {
        setIsProductModalOpen(false);
        resetCurrentProduct();
    };

    // --- Main Product Submission Logic ---

    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation for product details
        if (!currentProduct.name || !currentProduct.category || currentProduct.price <= 0 || !currentProduct.quantity) {
            setError("Please fill all required product fields (Name, Quantity, Category, Price) with valid values.");
            setLoading(false);
            return;
        }

        // Validate inventory details
        const hasInvalidInventory = currentProduct.inventoryDetails.some(detail =>
            !detail.storeId || detail.stock < 0 || detail.stock === ''
        );
        if (hasInvalidInventory) {
            setError("Please ensure all inventory entries have a selected store and a valid non-negative stock quantity.");
            setLoading(false);
            return;
        }
        // Validate unique stores in inventory details
        const storeIds = currentProduct.inventoryDetails.map(detail => detail.storeId);
        const uniqueStoreIds = new Set(storeIds);
        if (storeIds.length !== uniqueStoreIds.size) {
            setError("Each product can only have one stock entry per store. Please remove duplicate stores.");
            setLoading(false);
            return;
        }


        try {
            const formData = new FormData();

            // Prepare product data for backend (ProductAndInventoryRequestDTO)
            const productDataForBackend = {
                productId: currentProduct.productId, // Will be null for add, present for edit
                name: currentProduct.name,
                description: currentProduct.description,
                price: parseFloat(currentProduct.price),
                quantity: currentProduct.quantity,
                prescriptionRequired: currentProduct.prescriptionRequired,
                category: currentProduct.category,
                inventoryDetails: currentProduct.inventoryDetails.map(detail => ({
                    ...(detail.inventoryId && { inventoryId: detail.inventoryId }),
                    storeId: parseInt(detail.storeId, 10),
                    stock: parseInt(detail.stock, 10),
                })),
            };

            // --- UPDATED LINE ---
            // Create a Blob with the JSON string and explicitly set its Content-Type to application/json
            const productJsonBlob = new Blob([JSON.stringify(productDataForBackend)], { type: 'application/json' });
            formData.append('product', productJsonBlob);
            // --- END UPDATED LINE ---

            // Append image files ONLY IF they are selected (not null)
            if (primaryImageFile) {
                formData.append('image', primaryImageFile);
            }
            if (hoverImageFile) {
                formData.append('hoverImage', hoverImageFile);
            }

            // Send the request to the unified endpoint
            // IMPORTANT: Axios will automatically set the correct 'multipart/form-data' header with the boundary
            // You do NOT need to manually set the Content-Type header here.
            console.log("Sending product data to backend:", formData);
            console.log("Sending product data to backend:", productDataForBackend);
            const response = await axios.post('/api/products/save-or-update', formData);

            if (response.data.success) {
                alert(response.data.message);
                closeProductModal();
                fetchProducts(); // Refresh product list to show changes
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error("Error saving product:", err);
            setError(err.response?.data?.message || "An unexpected error occurred while saving the product.");
        } finally {
            setLoading(false);
        }
    };

    // --- Other Product Actions ---

    // Delete product
    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            return;
        }
        try {
            setLoading(true);
            await axios.delete(`/api/products/${id}`);
            setProducts(products.filter(product => product.productId !== id));
            setError(null);
        } catch (err) {
            setError("Failed to delete product. Please try again.");
            console.error("Error deleting product:", err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- View Stock Modal Functions ---

    // Open 'View Stock' modal
    const openViewStockModal = (product) => {
        setProductInStockView(product);
        setIsViewStockModalOpen(true);
    };

    const closeViewStockModal = () => {
        setIsViewStockModalOpen(false);
        setProductInStockView(null);
    };

    // Get the name of a store by its ID for display purposes
    const getStoreNameById = (storeId) => {
        const store = allStores.find(s => s.storeId === storeId);
        return store ? store.name : 'Unknown Store';
    };


    if (loading && products.length === 0) {
        return <div className="p-6 text-center text-gray-600">Loading products...</div>;
    }

    if (error && !isProductModalOpen && !isViewStockModalOpen) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-4 md:p-6 w-full">
            {/* Header with Add Product button */}
            <div className="flex justify-between items-center mb-6 mt-10">
                <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    disabled={loading}
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {/* Products List */}
            {products.length === 0 && !loading ? (
                <div className="col-span-full text-center text-gray-500 py-10">
                    No products found. Add one!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.productId}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
                        >
                            {/* Product Images */}
                            <div className="h-48 bg-gray-100 relative group overflow-hidden flex items-center justify-center">
                                {product.image || product.hoverImage ? (
                                    <>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain transition-opacity duration-300 group-hover:opacity-0"
                                            onError={(e) => {
                                                e.currentTarget.src = "/placeholder-product.jpg";
                                            }}
                                        />
                                        {product.hoverImage && (
                                            <img
                                                src={product.hoverImage}
                                                alt={`${product.name} Hover`}
                                                className="w-full h-full object-contain absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/placeholder-product.jpg";
                                                }}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{product.name}</h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded ml-2 flex-shrink-0">
                                        {product.category}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                                    <span className="font-medium">Description:</span> {product.description || 'N/A'}
                                </p>
                                <p className="text-gray-600 text-sm mb-1">
                                    <span className="font-medium">Price:</span> ${product.price ? product.price.toFixed(2) : '0.00'}
                                </p>
                                {product.quantity && (
                                    <p className="text-gray-600 text-sm mb-1">
                                        <span className="font-medium">Qty/Unit:</span> {product.quantity}
                                    </p>
                                )}
                                <p className="text-gray-600 text-sm mb-2">
                                    <span className="font-medium">Prescription:</span>{" "}
                                    {product.prescriptionRequired ? (
                                        <span className="text-red-500">Required</span>
                                    ) : (
                                        <span className="text-green-500">Not Required</span>
                                    )}
                                </p>

                                {/* Action Buttons */}
                                <div className="mt-auto flex justify-between items-center pt-2">
                                    <button
                                        onClick={() => openViewStockModal(product)}
                                        className="flex items-center gap-1 text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition"
                                        aria-label={`View Stock for ${product.name}`}
                                        disabled={loading}
                                    >
                                        <Eye size={18} />
                                        <span className="text-sm">View Stock</span>
                                    </button>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition"
                                            aria-label={`Edit ${product.name}`}
                                            disabled={loading}
                                        >
                                            <Edit3 size={20} />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.productId)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
                                            aria-label={`Delete ${product.name}`}
                                            disabled={loading}
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">
                                {modalMode === "add" ? "Add New Product" : "Edit Product"}
                            </h2>
                            <button
                                onClick={closeProductModal}
                                className="text-gray-500 hover:text-gray-700"
                                disabled={loading}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmitProduct}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Product Details */}
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={currentProduct.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Product Name"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={currentProduct.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Brief description of the product"
                                            disabled={loading}
                                        ></textarea>
                                    </div>

                                    {/* Primary Image Upload */}
                                    <div>
                                        <label htmlFor="primaryImageFile" className="block text-sm font-medium text-gray-700 mb-1">
                                            Primary Image {modalMode === 'add' && '*'}
                                        </label>
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden mr-4 border flex-shrink-0">
                                                {currentProduct.image && !primaryImageFile ? (
                                                    <img
                                                        src={currentProduct.image}
                                                        alt="Primary Current"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : primaryImageFile ? (
                                                    <img
                                                        src={URL.createObjectURL(primaryImageFile)}
                                                        alt="Primary Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center">
                                                        No image
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                id="primaryImageFile"
                                                name="primaryImageFile"
                                                ref={primaryImageInputRef}
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'primaryImageFile')}
                                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 flex-grow"
                                                disabled={loading}
                                                required={modalMode === 'add' && !currentProduct.image} // Required only for new products if no current image exists
                                            />
                                        </div>
                                        {currentProduct.image && (
                                            <p className="text-xs text-gray-500 mt-1">Current: <a href={currentProduct.image} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Current Image</a></p>
                                        )}
                                    </div>

                                    {/* Hover Image Upload */}
                                    <div>
                                        <label htmlFor="hoverImageFile" className="block text-sm font-medium text-gray-700 mb-1">
                                            Hover Image
                                        </label>
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 rounded bg-gray-200 overflow-hidden mr-4 border flex-shrink-0">
                                                {currentProduct.hoverImage && !hoverImageFile ? (
                                                    <img
                                                        src={currentProduct.hoverImage}
                                                        alt="Hover Current"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : hoverImageFile ? (
                                                    <img
                                                        src={URL.createObjectURL(hoverImageFile)}
                                                        alt="Hover Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center">
                                                        No image
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                id="hoverImageFile"
                                                name="hoverImageFile"
                                                ref={hoverImageInputRef}
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'hoverImageFile')}
                                                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 flex-grow"
                                                disabled={loading}
                                            />
                                        </div>
                                        {currentProduct.hoverImage && (
                                            <p className="text-xs text-gray-500 mt-1">Current: <a href={currentProduct.hoverImage} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Current Image</a></p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Product Details & Stock Management */}
                                <div className="space-y-4">
                                    {/* Category */}
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            value={currentProduct.category}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                            disabled={loading}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                            Price ($) *
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            min="0"
                                            step="0.01"
                                            value={currentProduct.price}
                                            onChange={handleNumberChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0.00"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity (e.g., "10 tablets") *
                                        </label>
                                        <input
                                            type="text"
                                            id="quantity"
                                            name="quantity"
                                            value={currentProduct.quantity}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 100ml, 50 tablets"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Prescription Required Radio Buttons */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Prescription Required *
                                        </label>
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="prescriptionRequired"
                                                    value="true"
                                                    checked={currentProduct.prescriptionRequired === true}
                                                    onChange={() => handlePrescriptionChange(true)} // Correctly pass boolean true
                                                    className="form-radio text-blue-600"
                                                    disabled={loading}
                                                />
                                                <span className="ml-2 text-gray-700">Yes</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name="prescriptionRequired"
                                                    value="false"
                                                    checked={currentProduct.prescriptionRequired === false}
                                                    onChange={() => handlePrescriptionChange(false)} // Correctly pass boolean false
                                                    className="form-radio text-blue-600"
                                                    disabled={loading}
                                                />
                                                <span className="ml-2 text-gray-700">No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* --- Inventory Details Section --- */}
                                    <div className="border p-4 rounded-md bg-gray-50">
                                        <h3 className="text-lg font-semibold mb-3">Inventory Details</h3>
                                        {currentProduct.inventoryDetails.length === 0 && modalMode === 'add' && (
                                            <p className="text-sm text-gray-500 mb-3">Add initial stock for your product.</p>
                                        )}
                                        {currentProduct.inventoryDetails.map((detail, index) => (
                                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 p-2 border border-gray-200 rounded-md bg-white">
                                                {/* Store Dropdown */}
                                                <div className="flex-1 w-full">
                                                    <label htmlFor={`store-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Store *</label>
                                                    <select
                                                        id={`store-${index}`}
                                                        value={detail.storeId || ''} // Handle empty value
                                                        onChange={(e) => handleInventoryDetailChange(index, 'storeId', e.target.value)}
                                                        required
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                                        // **FIXED:** Only disable if it's an existing inventory item (has inventoryId)
                                                        disabled={loading || detail.inventoryId}
                                                    >
                                                        <option value="">Select Store</option>
                                                        {allStores.map(store => (
                                                            <option key={store.storeId} value={store.storeId}>
                                                                {store.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {/* Stock Input */}
                                                <div className="w-full sm:w-24 flex-shrink-0">
                                                    <label htmlFor={`stock-${index}`} className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
                                                    <input
                                                        type="number"
                                                        id={`stock-${index}`}
                                                        value={detail.stock}
                                                        onChange={(e) => handleInventoryDetailChange(index, 'stock', e.target.value)}
                                                        required
                                                        min="0"
                                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                                        disabled={loading}
                                                    />
                                                </div>
                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveInventoryRow(index)}
                                                    className="p-1.5 mt-0 sm:mt-4 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 flex-shrink-0"
                                                    title="Remove this store's stock"
                                                    disabled={loading}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                        {/* Add Another Store Button */}
                                        <button
                                            type="button"
                                            onClick={handleAddInventoryRow}
                                            className="mt-3 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                                            disabled={loading}
                                        >
                                            + Add Another Store
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeProductModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : (modalMode === 'add' ? 'Add Product' : 'Update Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Stock Modal */}
            {isViewStockModalOpen && productInStockView && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Stock Details for "{productInStockView.name}"</h2>
                            <button
                                onClick={closeViewStockModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        {productInStockView.inventoryDetails && productInStockView.inventoryDetails.length > 0 ? (
                            <div className="space-y-3">
                                {productInStockView.inventoryDetails.map((detail, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md border border-gray-200">
                                        <span className="font-medium text-gray-800">{getStoreNameById(detail.storeId)}:</span>
                                        <span className="text-lg font-semibold text-blue-700">{detail.stock} units</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No stock information available for this product.</p>
                        )}
                        <div className="mt-6 text-right">
                            <button
                                onClick={closeViewStockModal}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;