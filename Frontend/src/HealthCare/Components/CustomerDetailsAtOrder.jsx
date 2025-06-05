import { useState } from 'react';
import axios from 'axios';
import AddressMap from './map.jsx';

export default function CustomerDetailsAtOrder() {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        phone: '',
        email: '',
        address: '',
        location: null,
        prescription: null
    });

    const [addressSearch, setAddressSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value,
        }));
        
        if (name === 'address') {
        setAddressSearch(value);
        }
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
        ...prev,
        prescription: e.target.files[0]
        }));
    };

    const handleLocationSelect = (location) => {
        setFormData(prev => ({
        ...prev,
        location,
        }));
    };

    const handleAddressUpdate = (address) => {
        setFormData(prev => ({
        ...prev,
        address,
        }));
        setAddressSearch(address);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
        const formPayload = new FormData();
        formPayload.append('name', formData.name);
        formPayload.append('age', formData.age);
        formPayload.append('phone', formData.phone);
        formPayload.append('email', formData.email);
        formPayload.append('address', formData.address);
        formPayload.append('latitude', formData.location?.lat || '');
        formPayload.append('longitude', formData.location?.lng || '');
        if (formData.prescription) {
            formPayload.append('prescription', formData.prescription);
        }

        const response = await axios.post('/api/customers', formPayload, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });

        setSubmitMessage('Data submitted successfully!');
        console.log('Server response:', response.data);
        } catch (error) {
        console.error('Submission error:', error);
        setSubmitMessage('Error submitting data. Please try again.');
        } finally {
        setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
        name: '',
        age: '',
        phone: '',
        email: '',
        address: '',
        location: null,
        prescription: null
        });
        setAddressSearch('');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Registration</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    required
                />
                </div>

                <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age *
                </label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    min="1"
                    max="120"
                    required
                />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    required
                />
                </div>

                <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    required
                />
                </div>
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address *
                </label>
                <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Location on Map *
                </label>
                <AddressMap 
                onLocationSelect={handleLocationSelect} 
                setAddress={handleAddressUpdate}
                address={addressSearch}
                initialPosition={formData.location}
                />
                {formData.location && (
                <p className="mt-2 text-sm text-gray-600">
                    Coordinates: Latitude {formData.location.lat.toFixed(4)}, Longitude {formData.location.lng.toFixed(4)}
                </p>
                )}
            </div>

            <div>
                <label htmlFor="prescription" className="block text-sm font-medium text-gray-700">
                Upload Prescription (PDF/Image)
                </label>
                <input
                type="file"
                id="prescription"
                name="prescription"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                accept=".pdf,.jpg,.jpeg,.png"
                />
                {formData.prescription && (
                <p className="mt-2 text-sm text-gray-600">
                    Selected file: {formData.prescription.name}
                </p>
                )}
            </div>

            {submitMessage && (
                <div className={`p-3 rounded-md ${submitMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {submitMessage}
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button
                type="button"
                onClick={resetForm}
                className="mr-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                disabled={isSubmitting}
                >
                Reset Form
                </button>
                <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={isSubmitting}
                >
                {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}