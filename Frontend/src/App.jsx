import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Signup from './customer/Pages/Signup'
import Login from './customer/Pages/Login'
import UserProfile from './customer/pages/UserProfile'
import ProductGrid from './Store/Components/products'
import HomeStore from './Store/Pages/HomeStore'
import ProductStore from './Store/Pages/ProductStore'
import ProductDetailsPage from './Store/Pages/ProductDetailsPage'
import Home from './HealthCare/Pages/Home'
import Doctors from './HealthCare/Pages/Doctors'
import About from './HealthCare/Pages/About'
import Contact from './HealthCare/Pages/Contact'
import VerifyOTP from './Components/OTPVerifyPopup'
import Services from './HealthCare/Pages/Services'
import DoctorPreview from './HealthCare/Pages/DoctorProfile'
import Appointments from './HealthCare/Components/Doctors/AppointmentForm'
import PaymentGateway from './HealthCare/Pages/PaymentGateway'
import AdminLanding from './Admin/Pages/AdminLanding'
import StoreManageAdmin from './Admin/Pages/StoreManageAdmin'
import ClinicManageAdmin from './Admin/Pages/ClinicManageAdmin'
import ProductManageAdmin from './Admin/Pages/ProductManageAdmin'
import StorePaymentGateway from './Store/Pages/StorePaymentGateway'
import AppointmentManageAdmin from './Admin/Pages/AppointmentManageAdmin'
import TermsAndConditions from './Components/TermsAndConditions'
import PrivacyPolicy from './Components/PrivacyPolicy'
import Licenses from './Components/Licenses'

import OrderDetails from './HealthCare/Components/CustomerDetailsAtOrder.jsx'
import DeliveryExecutiveRegister from './Components/DeliveryExecutiveRegister.jsx'



const App = () => {

      return (
            <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/store/home" element={<HomeStore />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/products" element={<ProductGrid />} />
                  <Route path="/store/home" element={<HomeStore />} />
                  <Route path="/store/products" element={<ProductStore />} />
                  <Route path="/product/:productId/store/:storeId" element={<ProductDetailsPage />} />



                  <Route path="/userprofile" element={<UserProfile />} />
                  <Route path="/otp" element={<VerifyOTP />} />
                  <Route path="/doctor/:doctorId" element={<DoctorPreview />} />
                  <Route path="/appointments/:doctorId" element={<Appointments />} />



                  <Route path="/payment/appointment/:appointmentId" element={<PaymentGateway />} />
                  <Route path="/payment/store/:orderId" element={<StorePaymentGateway />} />
                  <Route path="/store/payment" element={<StorePaymentGateway />} />



                  <Route path="/payment/store" element={<StorePaymentGateway />} />
                  <Route path="/admin/home" element={<AdminLanding/>} />
                  <Route path="/admin/products" element={<ProductManageAdmin/>} />
                  <Route path="/admin/store" element={<StoreManageAdmin/>} />
                  <Route path="/admin/clinics" element={<ClinicManageAdmin/>} />
                  <Route path="/admin/appointments" element={<AppointmentManageAdmin/>} />



                  <Route path="/terms" element={<TermsAndConditions/>} />
                  <Route path="/policies" element={<PrivacyPolicy/>} />
                  <Route path="/licenses" element={<Licenses/>} />
                  <Route path="/orderDetails" element={<OrderDetails />} />


                  <Route path="/Delivery/signup" element={<DeliveryExecutiveRegister />} />

            </Routes>
      );

};

export default App;

