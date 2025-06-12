import { useState } from 'react';
import { FiHelpCircle, FiX, FiChevronDown, FiChevronUp, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

const Help = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeAccordion, setActiveAccordion] = useState(null);

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const faqs = [
        {
        question: "How do I mark a delivery as completed?",
        answer: "After successfully delivering the medicine, tap on the 'Delivered' button in the order details screen. Don't forget to collect the recipient's signature if required."
        },
        {
        question: "What should I do if the customer isn't available?",
        answer: "First, try calling the customer using the contact number provided. If you can't reach them, follow the protocol in your app - this may include waiting for a specified time, leaving the package with a neighbor (if allowed), or returning the medicine to the pharmacy."
        },
        {
        question: "How to handle temperature-sensitive medications?",
        answer: "Ensure these medications remain in your insulated delivery bag until handed to the customer. Check the app for any special handling instructions. Never leave temperature-sensitive medications unattended."
        },
        {
        question: "What if a package is damaged during delivery?",
        answer: "Do not deliver damaged medication packages. Immediately contact your supervisor through the app and follow the instructions provided. Document the damage with photos if possible."
        },
        {
        question: "How do I handle prescription medications?",
        answer: "For prescription medications, you must verify the recipient's identity and collect any required signatures. Check the app for specific requirements for each delivery."
        }
    ];

    const emergencyContacts = [
        { name: "Delivery Support", number: "1800-123-4567", available: "24/7" },
        { name: "Pharmacy Liaison", number: "1800-765-4321", available: "8AM-10PM" },
        { name: "Emergency Supervisor", number: "1800-987-6543", available: "24/7" }
    ];

    return (
        <div className="fixed bottom-4 right-4 z-50">
        {/* Main Help Button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 flex items-center justify-center"
            aria-label="Help"
        >
            {isOpen ? <FiX size={24} /> : <FiHelpCircle size={24} />}
        </button>

        {/* Help Panel */}
        {isOpen && (
            <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl overflow-hidden md:w-96">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4">
                <h2 className="text-xl font-bold">Delivery Executive Help</h2>
                <p className="text-sm opacity-90">Quick assistance for your deliveries</p>
            </div>

            {/* Content */}
            <div className="max-h-96 overflow-y-auto">
                {/* Emergency Contacts */}
                <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <FiPhone className="mr-2" /> Emergency Contacts
                </h3>
                <ul className="space-y-2">
                    {emergencyContacts.map((contact, index) => (
                    <li key={index} className="bg-blue-50 p-2 rounded">
                        <p className="font-medium text-blue-800">{contact.name}</p>
                        <p className="text-sm">{contact.number}</p>
                        <p className="text-xs text-gray-500">Available: {contact.available}</p>
                    </li>
                    ))}
                </ul>
                </div>

                {/* FAQ Section */}
                <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <FiHelpCircle className="mr-2" /> Frequently Asked Questions
                </h3>
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                    <div key={index} className="border rounded overflow-hidden">
                        <button
                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                        onClick={() => toggleAccordion(index)}
                        >
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        {activeAccordion === index ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                        {activeAccordion === index && (
                        <div className="p-3 bg-white text-gray-600 text-sm">
                            {faq.answer}
                        </div>
                        )}
                    </div>
                    ))}
                </div>
                </div>

                {/* Additional Help Options */}
                <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <FiMessageSquare className="mr-2" /> More Help Options
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded flex flex-col items-center text-center">
                    <FiMail className="mb-1 text-blue-600" />
                    <span className="text-sm">Email Support</span>
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded flex flex-col items-center text-center">
                    <FiPhone className="mb-1 text-blue-600" />
                    <span className="text-sm">Call Back</span>
                    </button>
                </div>
                </div>
            </div>
            </div>
        )}
        </div>
    );
};

export default Help;