import { useState } from 'react';
import { FaArrowLeft, FaCreditCard, FaWallet, FaHospital } from 'react-icons/fa';
import { SiNetlify } from 'react-icons/si';
import { RiNetflixFill } from 'react-icons/ri';

const PaymentGateway = () => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [agreeTerms, setAgreeTerms] = useState(false);

    return (
        <div className="min-h-screen bg-blue-600 flex flex-col md:flex-row p-10">
        {/* Left Section - Order Summary */}
        <div className="w-full md:w-1/2 lg:w-2/4 relative bg-blue-600 text-white p-6 md:p-10">
            {/* Background Image with overlay */}
            <div className="absolute inset-0 bg-blue-600 opacity-70 z-0">
                <div
                    className="w-full h-full bg-cover rounded-l-[30px] bg-center opacity-20 "
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')" }}
                ></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
            {/* Go Back Button */}
            <div className="flex justify-end">
                <button className="flex items-center text-white hover:text-blue-200 transition">
                <FaArrowLeft className="mr-2" />
                Go Back
                </button>
            </div>
            
            {/* Logo */}
            <div className="mt-4 mb-8 flex items-center">
                <img
                src="/src/assets/Curevo-logo.png"
                alt="Curevo logo"
                className="h-10 w-auto"
                />
                <h1 className="text-2xl font-semibold ml-2"></h1>
            </div>
            
            {/* Order Details */}
            <div className="flex-grow">
                <h2 className="text-xl font-semibold mb-6">Your Consultation</h2>
                
                <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-blue-400 pb-2">
                    <span>Doctor Consultation</span>
                    <span>$120.00</span>
                </div>
                <div className="flex justify-between border-b border-blue-400 pb-2">
                    <span>Medical Tests</span>
                    <span>$85.50</span>
                </div>
                <div className="flex justify-between border-b border-blue-400 pb-2">
                    <span>Service Fee</span>
                    <span>$15.00</span>
                </div>
                </div>
                
                <div className="space-y-2 mb-8">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$220.50</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>$11.03</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>$231.53</span>
                </div>
                </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="mt-auto">
                <label className="flex items-start">
                <input 
                    type="checkbox" 
                    className="mt-1 mr-2"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="text-sm">
                    I agree to the <a href="#" className="underline">Terms and Conditions</a> and <a href="#" className="underline">Privacy Policy</a>
                </span>
                </label>
            </div>
            </div>
        </div>
        
        {/* Right Section - Payment Methods */}
        <div className="w-full md:w-1/2 lg:w-2/4 bg-white p-6 md:p-8 flex items-center justify-center rounded-r-[30px]">
            <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Method</h2>
            
            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center p-4 rounded-lg border ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}
                >
                <FaCreditCard className="mr-2" />
                Card
                </button>
                <button
                onClick={() => setPaymentMethod('netbanking')}
                className={`flex items-center justify-center p-4 rounded-lg border ${paymentMethod === 'netbanking' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}
                >
                <RiNetflixFill className="mr-2" />
                Netbanking
                </button>
                <button
                onClick={() => setPaymentMethod('wallet')}
                className={`flex items-center justify-center p-4 rounded-lg border ${paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}
                >
                <FaWallet className="mr-2" />
                Wallet
                </button>
                <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center justify-center p-4 rounded-lg border ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'}`}
                >
                <SiNetlify className="mr-2" />
                UPI
                </button>
            </div>
            
            {/* Payment Form */}
            <div className="mb-6">
                {paymentMethod === 'card' && (
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                        <input 
                            type="text" 
                            placeholder="1234 5678 9012 3456" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                            <div className="grid grid-cols-2 gap-2">
                            {/* Month Dropdown */}
                            <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">MM</option>
                                {Array.from({length: 12}, (_, i) => {
                                const month = (i + 1).toString().padStart(2, '0');
                                return <option key={month} value={month}>{month}</option>;
                                })}
                            </select>
                            
                            {/* Year Dropdown */}
                            <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">YY</option>
                                {Array.from({length: 10}, (_, i) => {
                                const year = (new Date().getFullYear() + i).toString().slice(-2);
                                return <option key={year} value={year}>{year}</option>;
                                })}
                            </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                            <input 
                            type="text" 
                            placeholder="123" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Holder Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        
                        <div className="flex items-start">
                        <input 
                            type="checkbox" 
                            id="save-card" 
                            className="mt-1 mr-2"
                        />
                        <label htmlFor="save-card" className="text-sm text-gray-700">
                            Save this card for future payments
                        </label>
                        </div>
                    </div>
                )}
                
                {paymentMethod === 'netbanking' && (
                    <div className="space-y-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Bank</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select your bank</option>
                            <option value="hdfc">HDFC Bank</option>
                            <option value="icici">ICICI Bank</option>
                            <option value="sbi">State Bank of India</option>
                            <option value="axis">Axis Bank</option>
                            <option value="other">Other Bank</option>
                        </select>
                        </div>
                        
                        {/* New Bank Details Fields */}
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                        <input 
                            type="text" 
                            placeholder="As per bank records" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input 
                            type="text" 
                            placeholder="Enter account number" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                        <input 
                            type="text" 
                            placeholder="Bank's IFSC code" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        </div>
                        
                        <div className="flex items-start">
                        <input 
                            type="checkbox" 
                            id="save-bank" 
                            className="mt-1 mr-2"
                        />
                        <label htmlFor="save-bank" className="text-sm text-gray-700">
                            Save this bank account for future payments
                        </label>
                        </div>
                        
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            </div>
                            <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                You will be redirected to your bank's secure page to complete the payment.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                )}
                
                {paymentMethod === 'wallet' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Wallet</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select your wallet</option>
                        <option value="paytm">Paytm</option>
                        <option value="phonepe">PhonePe</option>
                        <option value="amazonpay">Amazon Pay</option>
                        </select>
                    </div>
                )}
                
                {paymentMethod === 'upi' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                        <input 
                        type="text" 
                        placeholder="yourname@upi" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
                        />
                        <p className="text-sm text-gray-500">Or</p>
                        <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Pay via UPI App
                        </button>
                    </div>
                )}
            </div>
            
            {/* Pay Now Button */}
            <button 
                disabled={!agreeTerms}
                className={`w-full py-3 rounded-lg font-medium ${agreeTerms ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition`}
            >
                Pay $231.53
            </button>
            
            <p className="text-xs text-gray-500 mt-4 text-center">
                Your payment is secured with 256-bit encryption
            </p>
            </div>
        </div>
        </div>
    );
};

export default PaymentGateway;