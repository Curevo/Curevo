import React, { useState } from 'react';
import axios from 'axios';

export default function ResetPassword({ onClose }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState({ pwd: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const criteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };

  const allValid = Object.values(criteria).every(Boolean) && password === confirm;

  const handleSubmit = async () => {
    setTouched({ pwd: true, confirm: true });
    if (!allValid) return;

    setLoading(true);
    setErrorMsg('');
    try {
      await axios.post('/api/user/reset-password', { newPassword: password });
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Change Your Password</h2>
        <p className="text-sm text-gray-500 mb-4 text-center">Enter a new password below to change your password</p>

        {errorMsg && (
          <div className="mb-4 p-3 bg-[#00b4d8] bg-opacity-20 text-[#05668d] rounded">
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}

        {touched.pwd && !Object.values(criteria).every(Boolean) && (
          <div className="mb-4 p-3 bg-[#00b4d8] bg-opacity-20 text-[#05668d] rounded">
            <p className="text-sm font-medium">Password does not meet criteria:</p>
            <ul className="mt-2 list-disc list-inside text-sm">
              {!criteria.length && <li>At least 8 characters</li>}
              {!criteria.uppercase && <li>One uppercase letter</li>}
              {!criteria.lowercase && <li>One lowercase letter</li>}
              {!criteria.number && <li>One number</li>}
              {!criteria.special && <li>One special character</li>}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, pwd: true }))}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#02c39a]"
            placeholder="••••••••"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#02c39a]"
            placeholder="••••••••"
          />
          {touched.confirm && confirm && password !== confirm && (
            <p className="mt-1 text-sm text-[#d62828]">Passwords do not match</p>
          )}
        </div>

        <button
          disabled={!allValid || loading}
          onClick={handleSubmit}
          className={
            `w-full py-3 rounded-lg text-white font-medium transition ` +
            (allValid && !loading
              ? 'bg-[#02c39a] hover:bg-[#00b4d8]'
              : 'bg-gray-300 cursor-not-allowed')
          }
        >
          {loading ? 'Changing...' : 'Change Password'}
        </button>
      </div>
    </div>
  );
}
