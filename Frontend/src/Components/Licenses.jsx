import React from 'react';

const Licenses = () => {
    return (
        <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6">Licenses & Regulatory Compliance</h1>

        <p className="mb-6">
            At Curevo, we operate in full compliance with the laws and regulations governing the sale and delivery of medicines in India. Our mission is to provide safe, legal, and reliable access to healthcare and pharmaceutical products.
        </p>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">1. Drug License (Form 20 & Form 21)</h2>
            <p className="mb-2">
            Curevo holds a valid Drug License issued by the respective State Drug Control Department under the Drugs and Cosmetics Act, 1940. This license allows us to:
            </p>
            <ul className="list-disc list-inside space-y-1">
            <li>Sell, stock, and distribute Schedule H and non-Schedule drugs.</li>
            <li>Ensure medicines are dispensed only with valid prescriptions (where required).</li>
            </ul>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">2. GST Registration</h2>
            <p>
            Curevo is a registered entity under the Goods and Services Tax (GST) regime in India. We comply with all taxation requirements, and all invoices include valid GSTIN details for transparency.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">3. FSSAI License</h2>
            <p>
            For any nutraceuticals, supplements, or food-related products offered, we maintain an active Food Safety and Standards Authority of India (FSSAI) license to ensure safety, quality, and compliance with FSSAI norms.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">4. Pharmacist Supervision</h2>
            <p>
            All prescription orders are verified by a licensed and registered pharmacist in accordance with the Pharmacy Act, 1948. Curevo ensures that dispensing is handled by qualified professionals only.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">5. Data Privacy Compliance</h2>
            <p>
            Curevo is committed to protecting your personal health data in compliance with the Information Technology Act, 2000 and rules regarding sensitive personal data or information (SPDI). All records are stored securely and used only as per our Privacy Policy.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">6. Delivery Authorization</h2>
            <p>
            Our delivery partners are trained and authorized to handle and transport medicines as per government guidelines. Cold chain products, where applicable, are stored and delivered under recommended conditions.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">7. Legal Jurisdiction</h2>
            <p>
            Curevo operates under the legal jurisdiction of India. Any disputes arising shall be subject to the courts located in Kolkata, West Bengal.
            </p>
        </section>

        <p className="text-sm text-gray-600 mt-10">
            For verification of licenses or legal compliance documentation, please contact us at <a href="mailto:legal@curevo.com" className="text-blue-600 hover:underline">legal@curevo.com</a>.
        </p>
        </div>
    );
};

export default Licenses;
