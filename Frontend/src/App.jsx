import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Signup from './customer/pages/Signup'
import Login from './customer/pages/Login'
import ProductGrid from './Store/Components/products'
import HomeStore from './Store/Pages/HomeStore'
import ProductStore from './Store/Pages/ProductStore'
import ProductDetailsPage from './Store/Pages/ProductDetailsPage'
import Home from './HealthCare/pages/Home'
import Doctors from './HealthCare/Pages/Doctors'
import About from './HealthCare/Pages/About'
import Contact from './HealthCare/Pages/Contact'
import VerifyOTP from './components/OTPVerifyPopup'
import Services from './HealthCare/Pages/Services'
import UserProfile from './customer/pages/UserProfile'
import DoctorPreview from './HealthCare/Components/Doctors/DoctorsPreview'



// App.jsx
const App = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/services" element={<Services />} />
        <Route path="/store" element={<HomeStore />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductGrid />} />
        <Route path="/store/home" element={<HomeStore />} />
        <Route path="/store/products" element={<ProductStore />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/otp" element={<VerifyOTP />} />
        <Route path="/dtp" element={<DoctorPreview />} />
      </Routes>
  );
};

export default App;

