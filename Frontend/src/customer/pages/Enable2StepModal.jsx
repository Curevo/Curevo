import React from 'react';

export function Enable2StepModal({ secretCode = "ABCD-EFGH-IJKL-MNOP", onContinue }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
        <div className="flex flex-col items-center space-y-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            {/* Replace with your scanner icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h.01M7 16h.01M17 8h.01M17 16h.01" />
            </svg>
          </div>

          <h2 className="text-lg font-medium text-gray-900">Turn on 2-Step Verification</h2>
          <p className="text-sm text-gray-500 text-center">
            Open your authenticator app and copy the secret code below.
          </p>

          {/* Placeholder for TFA content */}
          <div className="w-full bg-gray-50 p-4 rounded-lg text-center text-sm text-gray-700">
            {/* You can swap this with QR or other content */}
            <pre className="font-mono break-words">{secretCode}</pre>
          </div>

          <button
            onClick={onContinue}
            className="mt-2 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue
          </button>

          <div className="w-full border-t border-gray-200 my-3" />

          <p className="text-xs text-gray-400 uppercase">OR enter the code manually</p>
          <div className="w-full flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md">
            <span className="font-mono text-sm text-gray-700">{secretCode}</span>
            <button className="text-gray-500 hover:text-gray-700">
              {/* Copy icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-8-4h8M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}