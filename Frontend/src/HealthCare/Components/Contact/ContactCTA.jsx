// components/ContactCTA.jsx
import { Phone, ArrowRight } from "lucide-react";

const ContactCTA = () => {
    return (
        <section className="bg-[#f4fafd] px-4 py-16">
        <div className="max-w-7xl mx-auto text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-gray-900">
            Speak with our experts to address <br className="hidden md:block" />
            your healthcare needs
            </h2>

            <p className="text-gray-600 text-base md:text-lg mt-4 max-w-2xl mx-auto md:mx-0">
            Whether you have questions about our services, need assistance with an appointment, or require more
            information, our dedicated team is just a message or call away.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-center md:justify-start">
            {/* Phone Button */}
            <a
                href="tel:+2395550104"
                className="inline-flex items-center bg-white border border-black hover:border-blue-500 text-black hover:text-white rounded-full px-2 py-2 text-sm font-medium shadow-sm hover:bg-blue-500 duration-300 transition"
            >
                <span className="mx-3 ">+ (91) 123 456 789</span>   
                <span className="bg-black text-white p-1.5 rounded-full">
                <Phone className="w-4 h-4" />
                </span>
            </a>

            {/* Email link */}
            <a
                href="mailto:info.vaxet@example.com"
                className="flex items-center text-sm font-medium text-gray-700 hover:text-black transition"
            >
                support@curevo.com
                <ArrowRight className="ml-2 w-4 h-4" />
            </a>
            </div>
        </div>
        </section>
    );
};

export default ContactCTA;
