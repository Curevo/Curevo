import React, { useRef } from 'react';

export function Verify2StepModal({ onComplete }) {
  const inputs = Array.from({ length: 6 }, () => useRef(null));

  const handleChange = (i, e) => {
    const val = e.target.value.slice(-1);
    e.target.value = val;
    if (val && i < 5) inputs[i + 1].current.focus();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 .556-.224 1.055-.586 1.414m0 0L12 15m0-2.586l.586.586M7.757 7.757L9.172 9.172m0 0l1.414 1.414M4 12c0 .556.224 1.055.586 1.414m0 0L7.757 9.757m0 0L9.172 11.172" />
            </svg>
          </div>

          <h2 className="text-lg font-medium text-gray-900">Verify Authentication Code</h2>
          <p className="text-sm text-gray-500 text-center">
            Enter the 6‑digit code from your authenticator app.
          </p>

          <div className="flex space-x-2">
            {inputs.map((ref, i) => (
              <input
                key={i}
                ref={ref}
                type="text"
                maxLength={1}
                onChange={e => handleChange(i, e)}
                className="w-10 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            onClick={onComplete}
            className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Complete 2‑step verification
          </button>

          <p className="text-xs text-gray-400 mt-2">
            Having trouble? <a href="#" className="text-blue-600 underline">Chat to our team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
