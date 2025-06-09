import React, { useState, useEffect } from 'react';
import {useAxiosInstance} from '@/Config/axiosConfig.js';
import { Enable2StepModal } from './Enable2StepModal';
import { Verify2StepModal } from './Verify2StepModal';
// import ResetPassword from './ResetPassword';

export default function UserProfile() {
  const [user, setUser] = useState({ name: '', age: '', email: '', phone: '', address: '', avatarUrl: '', tfaSecret: '' });
  const axios = useAxiosInstance();
  const [loading, setLoading] = useState(true);
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSetupAuth = () => setShowEnableModal(true);
  const handleEnableContinue = () => {
    setShowEnableModal(false);
    setShowVerifyModal(true);
  };
  const handleVerifyComplete = () => setShowVerifyModal(false);
  useEffect(() => {
    axios.get('/api/customers/me')
        .then(res => setUser(res.data.data))
        .catch(err => console.error('Failed to fetch profile', err))
        .finally(() => setLoading(false));
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };


  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (showReset) {
    return <ResetPassword onClose={() => setShowReset(false)} />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/user/update-profile', {
        name: user.name,
        age: user.age,
        address: user.address
      });
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      console.error('Update failed', err);
      showToast('Failed to update profile', 'error');
    }
  };

  return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-md font-sans text-gray-900">
        {toast && (
            <div
                className={`fixed top-4 right-4 px-4 py-2 rounded shadow-md text-white ${
                    toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}
            >
              {toast.message}
            </div>
        )}

        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Account</h1>
          <p className="text-sm text-gray-500">Manage your profile, track activities, and customize settings.</p>
        </header>

        <form onSubmit={handleSubmit} className="mb-8">
          <h2 className="text-xl font-medium mb-1">Personal Information</h2>
          <p className="text-sm text-gray-500 mb-4">Provide your information so that your account can operate correctly.</p>

          <div className="flex flex-wrap gap-6">
            <div className="flex-shrink-0 w-40 text-center">
              <img
                  src={user?.image|| '/default-avatar.png'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mb-2"
              />
              <button className="px-3 py-1 border border-gray-300 rounded text-xs bg-gray-100 hover:bg-gray-200">
                Replace Photo
              </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Name *</label>
                <input
                    type="text"
                    name="name"
                    value={user?.name || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Age *</label>
                <input
                    type="number"
                    name="age"
                    value={user?.age || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Email *</label>
                <input
                    type="email"
                    value={user?.user?.email || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone *</label>
                <input
                    type="tel"
                    value={user?.user?.phone || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm mb-1">Address *</label>
                <input
                    type="text"
                    name="address"
                    value={user?.address || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            <div className="col-span-2 mt-4">
              <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>


        <hr className="border-t border-gray-200 my-6" />

        <section className="mb-6">
          <h2 className="text-xl font-medium mb-1">Password</h2>
          <p className="text-sm text-gray-500 mb-3">Set a password that is unique.</p>
          <button
              onClick={() => setShowReset(true)}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
          >
            Reset Password
          </button>
        </section>

        <hr className="border-t border-gray-200 my-6" />

        <section>
          <h2 className="text-xl font-medium mb-1">Two-Factor Authentication</h2>
          <p className="text-sm text-gray-500 mb-3">Add an extra layer of security to your account. It is highly recommended.</p>
          <button
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 text-sm"
              onClick={handleSetupAuth}
          >
            Set up Authentication
          </button>
        </section>

        {showEnableModal && (
            <Enable2StepModal
                secretCode={user.tfaSecret}
                onContinue={handleEnableContinue}
            />
        )}

        {showVerifyModal && (
            <Verify2StepModal
                onComplete={handleVerifyComplete}
            />
        )}
      </div>
  );
}