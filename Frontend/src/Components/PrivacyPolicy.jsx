import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>

        <p className="mb-4">At Curevo, we are committed to protecting your personal information and respecting your privacy. This Privacy Policy outlines how we collect, use, share, and safeguard your data when you use our website or services.</p>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2">
            <li><strong>Personal Information:</strong> Name, phone number, email, address, date of birth, and prescription details.</li>
            <li><strong>Medical Information:</strong> Health conditions, doctor prescriptions, and medicine orders.</li>
            <li><strong>Payment Information:</strong> Credit/debit card, UPI, or net banking details (processed through secure gateways).</li>
            <li><strong>Usage Data:</strong> IP address, device info, browser type, and interaction with our website.</li>
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
            <li>To process and deliver your medicine orders.</li>
            <li>To provide customer support and respond to your queries.</li>
            <li>To improve our services, website performance, and user experience.</li>
            <li>To send important updates, offers, or notifications related to your orders.</li>
            <li>To comply with legal and regulatory requirements.</li>
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. Data Sharing and Disclosure</h2>
            <p>We do not sell or rent your personal data. We may share your data with:</p>
            <ul className="list-disc list-inside space-y-2">
            <li>Trusted delivery partners to fulfill your orders.</li>
            <li>Payment gateways for secure payment processing.</li>
            <li>Authorized healthcare professionals (only with your consent).</li>
            <li>Legal authorities if required under applicable laws.</li>
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to safeguard your data against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience and understand user behavior. You can manage cookie preferences through your browser settings.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
            <ul className="list-disc list-inside space-y-2">
            <li>You can access, update, or delete your personal information anytime.</li>
            <li>You can opt-out of promotional communications by clicking the unsubscribe link.</li>
            <li>You may request data export or restriction of data processing by contacting us.</li>
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">7. Children’s Privacy</h2>
            <p>Our services are not intended for individuals under the age of 13. We do not knowingly collect data from children without parental consent.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">8. Changes to this Policy</h2>
            <p>We may update this Privacy Policy from time to time. We encourage you to review it periodically. Continued use of Curevo means you agree to the revised policy.</p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
            <p>If you have any questions or concerns about our Privacy Policy, please email us at <a href="mailto:privacy@curevo.com" className="text-blue-600 hover:underline">privacy@curevo.com</a>.</p>
        </section>
        </div>
    );
};

export default PrivacyPolicy;
