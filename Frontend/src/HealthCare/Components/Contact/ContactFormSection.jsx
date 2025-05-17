import {
  User,
  Mail,
  Phone,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

const ContactFormSection = () => {
  const [animate, setAnimate] = useState(false);
    return (
        <section className="px-4 pb-36 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            {/* Left: Image */}
            <div className="w-full lg:w-1/2">
            <img
                src="/src/assets/contact1.jpg" // Replace with your image path
                alt="Doctor"
                className="rounded-lg w-full h-auto object-cover shadow"
            />
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-1/2">
            <p className="text-gray-700 text-base mb-6">
                We’re here to support you, feel free to reach out to us via the contact form below, or use our phone and
                email details for quicker assistance.
            </p>

            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    First name*
                    </label>
                    <input
                    type="text"
                    placeholder="Enter first name"
                    className="mt-1 w-full border-b border-gray-300 focus:outline-none focus:border-black py-1"
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Last name
                    </label>
                    <input
                    type="text"
                    placeholder="Enter last name"
                    className="mt-1 w-full border-b border-gray-300 focus:outline-none focus:border-black py-1"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email*
                    </label>
                    <input
                    type="email"
                    placeholder="xyz@example.com"
                    className="mt-1 w-full border-b border-gray-300 focus:outline-none focus:border-black py-1"
                    />
                </div>

                {/* Phone Number */}
                <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone number
                    </label>
                    <input
                    type="tel"
                    placeholder="+ (xxx) xxx-xxxxx"
                    className="mt-1 w-full border-b border-gray-300 focus:outline-none focus:border-black py-1"
                    />
                </div>
                </div>

                {/* Message */}
                <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Message*
                </label>
                <textarea
                    rows="3"
                    placeholder="Type message here*"
                    className="mt-1 w-full border-b border-gray-300 focus:outline-none focus:border-black py-1"
                />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        onClick={() => (window.location.href = "/appointments")}
                        onMouseEnter={() => setAnimate(true)}
                        onAnimationEnd={() => setAnimate(false)}
                        className="flex items-center justify-between px-4 py-1 rounded-full bg-[#f3f9ff] text-neutral-900 border-neutral-900 border-[1px] font-medium text-lg h-fit w-fit"
                    >
                        <p className="text-base font-bold">Submit</p>
                        <div className="ml-3 h-9 w-9 flex items-center justify-center rounded-full bg-neutral-900 border border-neutral-200 overflow-hidden">
                            <div className={animate ? "animate-arrowLoop" : ""}>
                                <ArrowUpRight className="text-[#f3f9ff] hover:text-neutral-900" />
                            </div>
                        </div>
                    </button>
                </div>
            </form>
            </div>
        </div>
        </section>
    );
};

export default ContactFormSection;
