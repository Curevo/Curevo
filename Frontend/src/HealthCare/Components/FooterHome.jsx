import React from "react";

const FooterHome = () => {
    return (
        <footer className="bg-[#f3f9fd] text-gray-800 py-12 px-6 sm:px-12 md:px-20 lg:px-32">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 text-sm">

            {/* Logo + Description */}
            <div className="md:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                    <img src="/Assets/Curevo-logo.png" alt="Curevo logo" className="h-8 w-auto" />
                </div>
                <p className="text-gray-600">
                    Curevo is designed to bridge the gap between
                    advanced medical services and medicines.
                </p>
            </div>

            {/* Column 1 - Services */}
            <div>
            <h3 className="font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-gray-600">
                <li>Physical Therapy</li>
                <li>Diagnostic Excellence</li>
                <li>Radiation Oncology</li>
                <li>Pharmacy</li>
                <li>Operation Theater</li>
                <li>Emergency Care</li>
            </ul>
            </div>

            {/* Column 2 - Services (again, second group) */}
            <div>
            <h3 className="font-semibold mb-3">Navigation</h3>
            <ul className="space-y-2 text-gray-600">
                <a href="/store/home"><li>Store</li></a>
                <a href="/doctors"><li>Doctors</li></a>
                <a href="/about"><li>About Us</li></a>
                <a href="/doctors"><li>Appointment</li></a>
                <a href="/contact"><li>Contact us</li></a>
            </ul>
            </div>

            {/* Column 3 - Resources */}
            <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2 text-gray-600">
                <a href="/terms"><li>Terms & Conditions</li></a>
                <a href="/policies"><li>Privacy Policy</li></a>
                <a href="/licenses"><li>Licensing</li></a>
                <a href="/services"><li>Services</li></a>
            </ul>
            </div>

            {/* Column 4 - Contact Info */}
            <div>
            <h3 className="font-semibold mb-3">Curevo Office</h3>
            <p className="text-gray-600 mb-2">
                123 Main Street <br /> Bangalore
            </p>
            <p className="text-gray-600 mb-2">+ (91) 123 456 789</p>
            <p className="text-gray-600">support@curevo.com</p>
            </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-sm text-gray-600 text-center">
            &copy; 2023 Curevo. All rights reserved.
        </div>
        
        </footer>
    );
};

export default FooterHome;
