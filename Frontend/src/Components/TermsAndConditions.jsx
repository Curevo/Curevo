import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">Terms and Conditions</h1>

        <p className="mb-4">Welcome to Curevo! These Terms and Conditions ("Terms") govern your use of our website, services, and the purchase and delivery of healthcare and medicine products. By accessing or using Curevo, you agree to be bound by these Terms.</p>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">1. Eligibility</h2>
            <p>You must be at least 18 years old to use our services or have the supervision of a parent or legal guardian. By using Curevo, you confirm that you are legally capable of entering into a binding contract.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">2. Medical Disclaimer</h2>
            <p>Curevo does not replace professional medical advice, diagnosis, or treatment. Always consult your doctor or a qualified healthcare provider regarding medical conditions and medications.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. Prescription Policy</h2>
            <p>Some medicines can only be sold against a valid prescription. You must upload a valid prescription where required. We reserve the right to reject orders lacking proper documentation.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">4. Order and Delivery</h2>
            <ul className="list-disc list-inside space-y-2">
            <li>Orders are subject to availability and serviceable locations.</li>
            <li>Delivery timelines are approximate and may be affected by factors beyond our control.</li>
            <li>You agree to provide accurate shipping and contact details.</li>
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. Refunds and Returns</h2>
            <p>Medicines once delivered cannot be returned unless they are damaged, expired, or incorrect. Refunds are processed as per our refund policy, subject to verification.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">6. User Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account. Any activity from your account will be considered authorized unless reported immediately.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
            <p>Curevo shall not be liable for any indirect, incidental, or consequential damages arising out of your use or inability to use the service or purchase of products.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">8. Dispute Resolution and Jurisdiction</h2>
            <p>All disputes shall be resolved amicably. In case of failure, the matter shall be subject to the jurisdiction of courts in Kolkata, India.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">9. Changes to Terms</h2>
            <p>Curevo reserves the right to update or modify these Terms at any time without prior notice. Continued use of the platform implies acceptance of the revised Terms.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
            <p>For any questions regarding these Terms and Conditions, please contact us at <a href="mailto:support@curevo.com" className="text-blue-600 hover:underline">support@curevo.com</a>.</p>
        </section>
        </div>
    );
};

export default TermsAndConditions;
