import React, { useState, useEffect } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const [user, setUser] = useState({
    customerId: null,
    name: '',
    age: '',
    email: '',
    phone: '', // This will hold the current value in the input field
    address: '',
    image: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [initialPhoneValue, setInitialPhoneValue] = useState(null); // To store phone's original null/non-null status from API
  const axios = useAxiosInstance();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/customers/me')
        .then(res => {
          const customerData = res.data.data;
          const phoneFromApi = customerData.user?.phone; // Get phone from nested user
          setUser({
            customerId: customerData.customerId,
            name: customerData.name || '',
            age: customerData.age || '',
            address: customerData.address || '',
            image: customerData.image || 'https://via.placeholder.com/120?text=No+Image',
            email: customerData.user?.email || '',
            phone: phoneFromApi || '', // Set to empty string if null for controlled input
          });
          setInitialPhoneValue(phoneFromApi); // Store the actual null/value from API for logic
        })
        .catch(err => {
          console.error('Failed to fetch profile', err);
          setToast({ message: 'Failed to fetch profile data.', type: 'error' });
        })
        .finally(() => setLoading(false));
  }, [axios]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setUser(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.customerId) {
      showToast('Error: Customer ID not found. Cannot update profile.', 'error');
      return;
    }

    const formData = new FormData();

    const customerData = {
      name: user.name,
      age: user.age ? parseInt(user.age, 10) : null,
      address: user.address,
    };

    if (initialPhoneValue === null && user.phone.trim() !== '') {
      customerData.phone = user.phone;
    }

    formData.append('customer', new Blob([JSON.stringify(customerData)], { type: 'application/json' }));

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axios.put(`/api/customers/update/${user.customerId}`, formData);
      showToast('Profile updated successfully!', 'success');
      if (initialPhoneValue === null && user.phone.trim() !== '') {
        setInitialPhoneValue(user.phone);
      }
    } catch (err) {
      console.error('Update failed', err);
      const errorMessage = err.response?.data?.message || err.message || 'Please try again.';
      showToast(`Failed to update profile: ${errorMessage}`, 'error');
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
        {toast && (
            <div
                className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-xl animate-fade-in-down ${
                    toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}
            >
              {toast.type === 'success' ? (
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              ) : (
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              )}
              <span className="font-semibold text-lg">{toast.message}</span>
            </div>
        )}

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 sm:p-10 lg:p-12">
          <header className="mb-10 border-b pb-6 border-gray-300">
            <h1 className="text-4xl font-extrabold text-gray-900 text-center">Account Settings</h1>
            <p className="text-lg text-gray-600 mt-2 text-center">Manage your profile and password securely.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Personal Information Section */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-100">Personal Information</h2>

              <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* Profile Picture */}
                <div className="flex-shrink-0 w-full md:w-48 flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
                  <img
                      src={user.image}
                      alt="Profile Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-md mb-4 transition-transform duration-300 hover:scale-105"
                  />
                  <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                  />
                  <button
                      type="button"
                      onClick={() => document.getElementById('image-upload').click()}
                      className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200 text-sm"
                  >
                    Change Photo
                  </button>
                </div>

                {/* Input Fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                        id="age"
                        type="number"
                        name="age"
                        value={user.age || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        readOnly
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-base cursor-not-allowed shadow-inner"
                    />
                  </div>
                  {/* Phone Input: Conditional based on initialPhoneValue */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                    {initialPhoneValue !== null ? ( // If initial phone had a value, it's read-only
                        <input
                            id="phone"
                            type="tel"
                            value={user.phone}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-base cursor-not-allowed shadow-inner"
                        />
                    ) : ( // If initial phone was null, it's editable
                        <>
                          <input
                              id="phone"
                              type="tel"
                              name="phone"
                              value={user.phone}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                          />
                          <p className="text-xs text-orange-600 mt-1 flex items-center">
                            <svg className="w-4 h-4 mr-1 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            Cannot be changed once set.
                          </p>
                        </>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                        id="address"
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-base focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-gray-200 mt-8">
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 text-base"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>

          {/* Password Section */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8 mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 border-gray-100">Password</h2>
            <p className="text-md text-gray-600 mb-6">Strengthen your account security by updating your password regularly.</p>
            <button
                onClick={() => navigate('/reset-password')}
                className="px-8 py-3 bg-gray-800 text-white font-bold rounded-xl shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-transform duration-200 transform hover:scale-105 text-lg"
            >
              Reset Password
            </button>
          </div>
        </div>
      </div>
  );
}