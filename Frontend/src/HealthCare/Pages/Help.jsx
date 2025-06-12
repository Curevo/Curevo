import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router-dom for navigation

// A simple reusable FAQ item component (answers are always visible as per "static" requirement)
const FAQItem = ({ question, children, id }) => {
    return (
        <div id={id} className="border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm">
            <div className="bg-gray-50 p-4 cursor-pointer flex justify-between items-center font-semibold text-gray-800 hover:bg-gray-100 transition-colors">
                <span>{question}</span>
                {/* Plus/Minus icon for visual accordion effect, can be toggled with JS later */}
                <span className="text-2xl leading-none">+</span>
            </div>
            <div className="p-4 bg-white border-t border-gray-200 text-gray-600">
                {children}
            </div>
        </div>
    );
};

const HelpCenter = () => {
    return (
        <div className="min-h-screen bg-gray-100 antialiased">
            {/* Header Section */}
            <header className="bg-blue-600 text-white py-12 text-center sticky top-0 z-50 shadow-lg">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-extrabold mb-3">Curevo Help Center</h1>
                    <p className="text-xl opacity-90">
                        Your guide to a healthier, easier experience with Curevo. Find answers to common questions and learn how to make the most of our services.
                    </p>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="lg:w-1/4 bg-white p-6 rounded-xl shadow-md lg:sticky lg:top-36 self-start">
                    <h3 className="text-2xl font-bold text-blue-600 mb-6 border-b-2 border-blue-100 pb-3">Quick Navigation</h3>
                    <nav>
                        <ul>
                            <li className="mb-3">
                                <a href="#general-faqs" className="block p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">General FAQs</a>
                            </li>
                            <li className="mb-3">
                                <a href="#customer-help" className="block p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">For Customers</a>
                                <ul className="ml-4 mt-2">
                                    <li><a href="#customer-account" className="block p-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md">Account Management</a></li>
                                    <li><a href="#ordering-medicine" className="block p-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md">Ordering Medicines</a></li>
                                    <li><a href="#booking-appointments" className="block p-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md">Booking Appointments</a></li>
                                    <li><a href="#payments" className="block p-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md">Payments & Billing</a></li>
                                    <li><a href="#delivery" className="block p-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-md">Delivery Information</a></li>
                                </ul>
                            </li>
                            <li className="mb-3">
                                <a href="#executive-help" className="block p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">For Delivery Executives</a>
                            </li>
                            <li className="mb-3">
                                <a href="#doctor-help" className="block p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">For Doctors</a>
                            </li>
                            <li className="mb-3">
                                <a href="#privacy-security" className="block p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">Privacy & Security</a>
                            </li>
                            <li className="mb-3">
                                <a href="#technical-support" className="block p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">Technical Support</a>
                            </li>
                            <li>
                                <a href="#contact-us" className="block p-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium">Contact Us</a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Content Area */}
                <main className="lg:w-3/4 space-y-8">
                    {/* General FAQs Section */}
                    <section id="general-faqs" className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-3xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-4">General FAQs</h2>
                        <FAQItem question="What is Curevo and what services does it offer?">
                            <p>Curevo is a comprehensive healthcare platform designed to simplify your health management. We offer:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Online Medicine Ordering:</strong> Get your prescribed medicines delivered directly to your doorstep.</li>
                                <li><strong>Doctor Appointments:</strong> Book consultations with a wide network of verified doctors, both online and in-clinic.</li>
                                <li><strong>Prescription Management:</strong> Securely upload, store, and manage your prescriptions.</li>
                                <li>And more, all aimed at providing convenient and accessible healthcare.</li>
                            </ul>
                        </FAQItem>
                        <FAQItem question="Who can use Curevo?">
                            <p>Curevo is designed for anyone needing convenient access to healthcare services, including:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Customers:</strong> Individuals who want to order medicines or book doctor appointments.</li>
                                <li><strong>Doctors:</strong> Medical professionals who wish to offer their services through our platform (managed by our admin team).</li>
                                <li><strong>Delivery Executives:</strong> Individuals who partner with us to deliver medicines to our customers.</li>
                            </ul>
                        </FAQItem>
                        <FAQItem question="How do I create an account?">
                            <p>Creating a Curevo account is simple:</p>
                            <ol className="list-decimal pl-5 mt-2 space-y-1">
                                <li>Download the Curevo app or visit our website.</li>
                                <li>Click on the "Sign Up" or "Register" button.</li>
                                <li>Choose your user type (e.g., Customer).</li>
                                <li>Fill in the required details like your name, email, phone number, and create a password.</li>
                                <li>Verify your phone number/email via OTP.</li>
                                <li>Once verified, your account is ready!</li>
                            </ol>
                        </FAQItem>
                        <FAQItem question="Is my personal and health data secure?">
                            <p>Yes, at Curevo, your privacy and data security are our top priorities. We employ industry-standard encryption protocols and robust security measures to protect your personal information, medical records, and transaction data. We comply with all relevant healthcare data protection regulations. For more details, please refer to our Privacy Policy.</p>
                        </FAQItem>
                        <FAQItem question="What devices is Curevo available on?">
                            <p>Curevo is accessible via our mobile application (available on Android and iOS) and through our responsive web portal, ensuring you can manage your health from any device.</p>
                        </FAQItem>
                    </section>

                    {/* For Customers Section */}
                    <section id="customer-help" className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-3xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-4">For Customers</h2>

                        <h3 id="customer-account" className="text-2xl font-semibold text-gray-800 mb-4 pt-4">Account Management</h3>
                        <FAQItem question="How do I update my profile information?">
                            <p>You can easily update your profile by navigating to the "My Profile" or "Account Settings" section within the app or website. Here you can modify your contact details, address, and other personal information.</p>
                        </FAQItem>
                        <FAQItem question="What should I do if I forget my password?">
                            <p>On the login screen, click on "Forgot Password?". You will be prompted to enter your registered email address or phone number. Follow the instructions to receive a verification code or a password reset link to create a new password.</p>
                        </FAQItem>
                        <FAQItem question="Can I link family members to my account?">
                            <p>Yes, Curevo allows you to add family members to your account for easier management of their health needs, including ordering medicines and booking appointments on their behalf. Look for the "Family Members" or "Dependents" option in your account settings.</p>
                        </FAQItem>

                        <h3 id="ordering-medicine" className="text-2xl font-semibold text-gray-800 mb-4 pt-4">Ordering Medicines</h3>
                        <FAQItem question="How do I search for medicines?">
                            <p>Use the search bar at the top of the app/website. You can search by medicine name, salt name, or even by ailment. Our smart search suggests relevant products as you type.</p>
                        </FAQItem>
                        <FAQItem question="How do I add medicines to my cart?">
                            <p>Once you've found the desired medicine, select the quantity and click the "Add to Cart" button. You can continue Browse and adding more items before proceeding to checkout.</p>
                        </FAQItem>
                        <FAQItem question="How do I upload a prescription for medicines?">
                            <p>For prescription medicines, you will be prompted to upload a valid prescription during the checkout process. You can upload a photo from your gallery, take a new photo, or select from previously uploaded prescriptions on your account.</p>
                        </FAQItem>
                        <FAQItem question="What if I don't have a prescription but need medicine?">
                            <p>For over-the-counter (OTC) medicines, no prescription is required. For prescription-only medicines, a valid prescription from a registered medical practitioner is mandatory as per regulations.</p>
                        </FAQItem>
                        <FAQItem question="What is the process for prescription verification?">
                            <p>After you upload a prescription, our licensed pharmacists will review it to ensure its validity and accuracy. This process is usually quick but may take some time depending on clarity. You will be notified once your prescription is verified and your order is ready for processing.</p>
                        </FAQItem>
                        <FAQItem question="Can I track my medicine order?">
                            <p>Yes, after placing your order, you can track its real-time status from the "My Orders" section. You will receive updates on order confirmation, prescription verification, packaging, dispatch, and delivery status, including your delivery executive's location.</p>
                        </FAQItem>
                        <FAQItem question="What are the delivery charges?">
                            <p>Delivery charges may vary based on your location and the total order value. You can view the exact delivery charges applicable to your order during the checkout process before making a payment. We often offer free delivery above a certain order value.</p>
                        </FAQItem>
                        <FAQItem question="Is there a minimum order value for medicine delivery?">
                            <p>Yes, a minimum order value may apply for medicine deliveries. This amount will be clearly displayed during the checkout process. Orders below this value might incur an additional small order fee or higher delivery charges.</p>
                        </FAQItem>
                        <FAQItem question="How do returns and refunds work for medicines?">
                            <p>Our return and refund policy for medicines is subject to specific conditions related to product integrity, expiry, and legal regulations. Please refer to our detailed "Return and Refund Policy" page for comprehensive information. Generally, returns are accepted for damaged, expired, or incorrect products if reported within the stipulated timeframe.</p>
                        </FAQItem>
                        <FAQItem question="Can I reorder past medicines?">
                            <p>Yes, you can easily reorder medicines from your past purchase history. Go to "My Orders" or "Order History," select the previous order, and choose the items you wish to reorder. This saves you time and effort.</p>
                        </FAQItem>


                        <h3 id="booking-appointments" className="text-2xl font-semibold text-gray-800 mb-4 pt-4">Booking Appointments</h3>
                        <FAQItem question="How do I find a doctor on Curevo?">
                            <p>You can find doctors by:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Specialty:</strong> Search for General Physicians, Dermatologists, Pediatricians, etc.</li>
                                <li><strong>Location:</strong> Find doctors near your area for in-clinic consultations.</li>
                                <li><strong>Availability:</strong> Filter by date and time slots that suit you.</li>
                                <li><strong>Name:</strong> If you know the doctor's name.</li>
                            </ul>
                            <p className="mt-2">Each doctor's profile provides details about their qualifications, experience, fees, and patient reviews.</p>
                        </FAQItem>
                        <FAQItem question="How do I book an appointment?">
                            <ol className="list-decimal pl-5 mt-2 space-y-1">
                                <li>Search for a doctor based on your needs.</li>
                                <li>Select your preferred doctor from the search results.</li>
                                <li>Choose between 'Online Consultation' or 'In-clinic Visit' (if applicable).</li>
                                <li>Select an available date and time slot.</li>
                                <li>Confirm your booking and make the payment (if required).</li>
                            </ol>
                            <p className="mt-2">You will receive a confirmation message with appointment details.</p>
                        </FAQItem>
                        <FAQItem question="How can I cancel or reschedule an appointment?">
                            <p>You can cancel or reschedule an appointment from the "My Appointments" section in your Curevo account. Please note that cancellations and rescheduling are subject to our cancellation policy, which may involve charges if done within a specific timeframe before the appointment.</p>
                        </FAQItem>
                        <FAQItem question="What happens after I book an online consultation?">
                            <p>After booking, you will receive a confirmation. A few minutes before your scheduled time, you will receive a notification or link to join the video consultation via the Curevo app. Ensure you have a stable internet connection and a quiet environment.</p>
                        </FAQItem>
                        <FAQItem question="Can I get online consultations?">
                            <p>Yes, Curevo offers online video consultations with a wide range of doctors. This allows you to consult with a doctor from the comfort of your home.</p>
                        </FAQItem>
                        <FAQItem question="How do I view my past appointments and consultations?">
                            <p>All your past appointments and online consultation records, including prescriptions and notes from doctors, are securely stored in the "My Health Records" or "Appointment History" section of your Curevo account for easy access.</p>
                        </FAQItem>

                        <h3 id="payments" className="text-2xl font-semibold text-gray-800 mb-4 pt-4">Payments & Billing</h3>
                        <FAQItem question="What payment methods are accepted on Curevo?">
                            <p>Curevo accepts a variety of secure payment methods, including:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Credit/Debit Cards (Visa, MasterCard, Rupay, etc.)</li>
                                <li>Net Banking</li>
                                <li>UPI (Unified Payments Interface)</li>
                                <li>Popular digital wallets</li>
                                <li>Cash on Delivery (for medicines, where available)</li>
                            </ul>
                        </FAQItem>
                        <FAQItem question="Is online payment secure?">
                            <p>Absolutely. All online payments processed on Curevo are highly secure. We use trusted payment gateways that adhere to PCI DSS compliance standards, ensuring your financial information is encrypted and protected.</p>
                        </FAQItem>
                        <FAQItem question="How do I view my payment history?">
                            <p>You can access a detailed history of all your transactions, including medicine purchases and consultation fees, in the "Payments" or "Order History" section of your Curevo account.</p>
                        </FAQItem>
                        <FAQItem question="What are platform fees and GST?">
                            <p><strong>Platform Fee:</strong> A small fee charged by Curevo for using our platform services and facilitating your order/booking.</p>
                            <p><strong>GST (Goods and Services Tax):</strong> An indirect tax levied on most goods and services in India. The applicable GST rate will be added to the total amount of your order/consultation fee as per government regulations.</p>
                            <p className="mt-2">Both will be clearly itemized in your bill before you confirm your payment.</p>
                        </FAQItem>

                        <h3 id="delivery" className="text-2xl font-semibold text-gray-800 mb-4 pt-4">Delivery Information</h3>
                        <FAQItem question="How long does medicine delivery take?">
                            <p>Delivery times vary based on your location and the availability of medicines. We strive for fast delivery, typically within 24-48 hours for most standard orders. Express delivery options might be available in select areas. Estimated delivery time will be shown during checkout.</p>
                        </FAQItem>
                        <FAQItem question="What are Curevo's delivery areas?">
                            <p>Curevo is rapidly expanding its delivery network. You can check if we deliver to your area by entering your pincode on the website or app. If your area is not currently covered, please check back soon!</p>
                        </FAQItem>
                        <FAQItem question="Can I change my delivery address after placing an order?">
                            <p>If you need to change your delivery address after placing an order, please contact our customer support immediately. Address changes are possible only if the order has not yet been dispatched for delivery. Once dispatched, it might not be possible to alter the address.</p>
                        </FAQItem>
                        <FAQItem question="How can I contact my delivery executive?">
                            <p>Once your order is dispatched, you will receive notifications that often include the contact number of your assigned delivery executive. You can also find this information in the "Track Order" section of your order details within the app.</p>
                        </FAQItem>
                    </section>

                    {/* For Delivery Executives Section */}
                    <section id="executive-help" className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-3xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-4">For Delivery Executives</h2>
                        <FAQItem question="How do I register as a Curevo Delivery Executive?">
                            <p>To register as a Delivery Executive, visit our "Partner with Us" or "Executive Registration" page on the website. You'll need to fill out an application form with your personal details, vehicle information, and bank details. Our team will review your application, conduct necessary background checks, and contact you for further onboarding steps once approved.</p>
                        </FAQItem>
                        <FAQItem question="How do I receive and accept delivery orders?">
                            <p>Approved delivery executives will use the Curevo Executive App. New orders will appear on your dashboard. You can review order details (pickup location, delivery location, items) and accept or decline orders based on your availability. Once accepted, the app will guide you through the delivery process.</p>
                        </FAQItem>
                        <FAQItem question="How do I manage my deliveries using the app?">
                            <p>The Curevo Executive App provides a comprehensive interface for managing your deliveries. It includes:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Real-time order updates.</li>
                                <li>Navigation assistance to pickup and delivery locations.</li>
                                <li>Customer contact information.</li>
                                <li>Proof of delivery options (e.g., photo upload, customer signature).</li>
                                <li>Earnings tracking.</li>
                            </ul>
                        </FAQItem>
                        <FAQItem question="What is the payment cycle for executives?">
                            <p>Earnings for deliveries are typically disbursed on a weekly or bi-weekly basis directly to your registered bank account. A detailed breakdown of your earnings, including per-delivery charges and incentives, is available in your Executive App.</p>
                        </FAQItem>
                        <FAQItem question="What if I encounter an issue during delivery?">
                            <p>If you face any issues (e.g., customer unavailable, address issues, product damage), immediately contact our Executive Support team through the app's dedicated support chat or helpline. They will guide you through the next steps.</p>
                        </FAQItem>
                        <FAQItem question="Are there any vehicle requirements to be a delivery executive?">
                            <p>Yes, you must have a valid driving license and a registered vehicle (bike, scooter, electric bike, etc.) that meets our standards. Specific vehicle type options are available during registration.</p>
                        </FAQItem>
                        <FAQItem question="Are there safety guidelines I need to follow?">
                            <p>Curevo prioritizes the safety of its executives and customers. We provide comprehensive safety guidelines, including road safety tips, hygiene protocols (especially for medicine delivery), and proper handling of packages. These guidelines are part of your onboarding and are accessible in the Executive App.</p>
                        </FAQItem>
                    </section>

                    {/* For Doctors Section */}
                    <section id="doctor-help" className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-3xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-4">For Doctors</h2>
                        <FAQItem question="How can I list my practice or become a listed doctor on Curevo?">
                            <p>Doctors are onboarded onto the Curevo platform through a dedicated verification and credentialing process managed by our administrative team. If you are a medical practitioner interested in joining our network, please reach out to our Doctor Partnership team at <a href="mailto:doctors@curevo.com" className="text-blue-600 hover:underline">doctors@curevo.com</a> with your qualifications and practice details. Our team will review your information and guide you through the listing process.</p>
                        </FAQItem>
                        <FAQItem question="How do doctors manage appointments through Curevo?">
                            <p>Listed doctors are provided with a dedicated Curevo Doctor Portal/App. This tool allows them to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>View their schedule and upcoming appointments.</li>
                                <li>Manage their availability and consultation slots.</li>
                                <li>Access patient medical history (with patient consent).</li>
                                <li>Conduct online video consultations.</li>
                                <li>Issue digital prescriptions and medical notes.</li>
                                <li>Track their earnings from consultations.</li>
                            </ul>
                        </FAQItem>
                        <FAQItem question="How do I conduct online consultations as a doctor?">
                            <p>Our Doctor Portal/App includes an integrated video consultation feature. At the scheduled time, you can initiate the video call with the patient directly through the platform. Ensure you have a stable internet connection and a private environment for the consultation.</p>
                        </FAQItem>
                        <FAQItem question="How are payments for consultations received by doctors?">
                            <p>Consultation fees collected from patients are processed securely by Curevo. Doctors receive their earnings directly into their registered bank accounts on a pre-defined settlement cycle (e.g., weekly or bi-weekly), with a transparent breakdown of all transactions available in their portal.</p>
                        </FAQItem>
                    </section>

                    {/* Privacy & Security Section */}
                    <section id="privacy-security" className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-3xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-4">Privacy & Security</h2>
                        <FAQItem question="How is my personal and medical data handled?">
                            <p>Curevo is committed to protecting your personal and medical information. We adhere strictly to data privacy laws and medical confidentiality standards. Your data is encrypted, stored securely, and only accessible to authorized personnel for legitimate service provision. We never share your sensitive information with third parties without your explicit consent. For full details, please review our comprehensive <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</p>
                        </FAQItem>
                        <FAQItem question="Is my medical information confidential?">
                            <p>Yes, all medical information shared on Curevo during consultations or prescription uploads is treated with the utmost confidentiality. It is only accessible to you, the consulting doctor, and necessary Curevo personnel involved in service delivery (e.g., pharmacists for prescription verification), all under strict privacy protocols.</p>
                        </FAQItem>
                        <FAQItem question="How can I report a security concern or data breach?">
                            <p>If you suspect a security vulnerability or believe your data has been compromised, please report it immediately to our dedicated security team at <a href="mailto:security@curevo.com" className="text-blue-600 hover:underline">security@curevo.com</a>. We take all security concerns seriously and will investigate promptly.</p>
                        </FAQItem>
                    </section>

                    {/* Technical Support Section */}
                    <section id="technical-support" className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-3xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-4">Technical Support & Troubleshooting</h2>
                        <FAQItem question="What should I do if the app is crashing or slow?">
                            <p>If you're experiencing app crashes or slow performance, try the following steps:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Ensure your internet connection is stable.</li>
                                <li>Clear the app's cache (via phone settings).</li>
                                <li>Update the app to the latest version from your app store.</li>
                                <li>Restart your device.</li>
                                <li>If the issue persists, contact our support team with details of your device and the problem.</li>
                            </ul>
                        </FAQItem>
                        <FAQItem question="I can't log in to my account. What should I do?">
                            <p>First, double-check your email/phone number and password for any typos. If you've forgotten your password, use the "Forgot Password" option. If you're still unable to log in, your account might be locked due to multiple failed attempts, or there could be a system issue. Please contact customer support for assistance.</p>
                        </FAQItem>
                        <FAQItem question="My payment failed during checkout. What now?">
                            <p>If your payment failed:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Check your internet connection.</li>
                                <li>Verify your payment details (card number, expiry, CVV/OTP).</li>
                                <li>Ensure sufficient balance in your account.</li>
                                <li>Try an alternative payment method.</li>
                            </ul>
                            <p className="mt-2">If the amount was debited but the order failed, the amount will typically be refunded to your source account within 5-7 business days. Contact your bank or our support team if it takes longer.</p>
                        </FAQItem>
                        <FAQItem question="I'm not receiving notifications. How can I fix this?">
                            <p>Check your device's notification settings for the Curevo app and ensure notifications are enabled. Also, check your in-app settings for notification preferences. Sometimes, battery optimization settings on your phone might interfere with app notifications.</p>
                        </FAQItem>
                    </section>

                    {/* Contact Us Section */}
                    <section id="contact-us" className="bg-white p-8 rounded-xl shadow-md text-center">
                        <h2 className="text-3xl font-bold text-blue-600 mb-6 border-b border-gray-200 pb-4">Still Need Help? Contact Us!</h2>
                        <p className="text-lg text-gray-700 mb-6">Our dedicated support team is here to assist you.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="bg-blue-50 p-6 rounded-lg shadow-sm w-full md:w-1/3">
                                <h3 className="text-xl font-semibold text-blue-700 mb-3">Email Support</h3>
                                <p className="text-gray-700">For general inquiries, issues, or feedback, email us at:</p>
                                <a href="mailto:support@curevo.com" className="text-blue-600 font-medium hover:underline text-lg">support@curevo.com</a>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-lg shadow-sm w-full md:w-1/3">
                                <h3 className="text-xl font-semibold text-blue-700 mb-3">Call Us</h3>
                                <p className="text-gray-700">For immediate assistance, call our helpline:</p>
                                <a href="tel:+9180XXXXX123" className="text-blue-600 font-medium hover:underline text-lg">+91 80XXXXX123</a>
                                <p className="text-sm text-gray-500 mt-1">(Available Mon-Sat, 9 AM - 6 PM IST)</p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-lg shadow-sm w-full md:w-1/3">
                                <h3 className="text-xl font-semibold text-blue-700 mb-3">Office Address</h3>
                                <p className="text-gray-700">Curevo Headquarters:</p>
                                <address className="not-italic text-gray-600 text-sm">
                                    [Your Company Name/Address Line 1]<br/>
                                    [Your Company Address Line 2], [City], [State]<br/>
                                    [Pincode], India
                                </address>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Curevo. All rights reserved.</p>
                    <div className="mt-2 space-x-4">
                        <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:underline">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HelpCenter;