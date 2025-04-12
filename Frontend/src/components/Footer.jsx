import { Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { assets } from '../assets/assets';
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo & Description */}
        <div>
          <img className='w-36 mb-6' src={assets.logo} alt="Logo of curevo"/>
          <p className="text-gray-300 text-sm mb-6">
            Your trusted partner in healthcare. Order medicines or book doctor appointments at your fingertips.
          </p>
          <div className="flex space-x-4 mt-4">
            <Facebook className="h-5 w-5 text-gray-400 hover:text-white transition" />
            <Instagram className="h-5 w-5 text-gray-400 hover:text-white transition" />
            <Twitter className="h-5 w-5 text-gray-400 hover:text-white transition" />
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
            <li><a href="#" className="hover:text-white">FAQs</a></li>
          </ul>
        </div>

        {/* Medical Services */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Medical Services</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-white">Order Medicines</a></li>
            <li><a href="#" className="hover:text-white">Book Appointment</a></li>
            <li><a href="#" className="hover:text-white">Health Tips</a></li>
            <li><a href="#" className="hover:text-white">Consultation Plans</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-6">Subscribe</h3>
          <p className="text-sm text-gray-300 mb-6">
            Join our newsletter to get updates on new medicines, doctors, and offers.
          </p>
          <form className="flex flex-col sm:flex-row items-start sm:items-center gap-2 rounded-full bg-slate-700 px-1 py-1 w-fit">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-full w-full sm:w-auto flex-1 bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 px-3 py-2 flex text-sm rounded-full hover:bg-blue-700 transition"
            >
              <Mail className="inline-block w-4 h-4 mr-1" />
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Curevo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;