import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Signup from './customer/Pages/Signup'
import Login from './customer/Pages/Login'
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
import DeliveryExecutiveRegister from './DeliveryExec/Pages/DeliveryExecutiveRegister.jsx'
import OrderPage from "@/customer/Pages/OrderPage.jsx";
import AppointmentPage from "@/customer/Pages/AppointmentPage.jsx";
import AccountPage from "@/customer/Pages/AccountPage.jsx";
import OrderManagement from "./Admin/Pages/OrderManageAdmin.jsx"
import ExecutiveManagement from "./Admin/Pages/DeliveryExecManageAdmin.jsx"
import ResetPassword from "./customer/Pages/ResetPassword.jsx"
import ProfileSettingsMain from './DeliveryExec/Pages/ProfileSettingsMain.jsx'
import OrderDashboardMain from './DeliveryExec/Pages/OrderDashboardMain.jsx'
import OrderHistoryMain from './DeliveryExec/Pages/OrderHistoryMain.jsx'
import LogoutComponent from './customer/Pages/Logout.jsx'
import HelpPage from "./HealthCare/Pages/Help.jsx"



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
                  <Route path="/reset-password" element={<ResetPassword />} />



                  <Route path="/otp" element={<VerifyOTP />} />
                  <Route path="/doctor/:doctorId" element={<DoctorPreview />} />
                  <Route path="/appointments/:doctorId" element={<Appointments />} />
                  <Route path="/my-orders" element={<OrderPage />} />
                  <Route path ="/my-appointments" element={<AppointmentPage />} />
                  <Route path ="/my-profile" element={<AccountPage />} />




                  <Route path="/payment/appointment/:appointmentId" element={<PaymentGateway />} />
                  <Route path="/payment/store/:orderId" element={<StorePaymentGateway />} />
                  <Route path="/store/payment" element={<StorePaymentGateway />} />



                  <Route path="/payment/store" element={<StorePaymentGateway />} />
                  <Route path="/admin/home" element={<AdminLanding/>} />
                  <Route path="/admin/products" element={<ProductManageAdmin/>} />
                  <Route path="/admin/store" element={<StoreManageAdmin/>} />
                  <Route path="/admin/clinics" element={<ClinicManageAdmin/>} />
                  <Route path="/admin/appointments" element={<AppointmentManageAdmin/>} />
                  <Route path="/admin/orders" element={<OrderManagement/>} />
                  <Route path="/admin/captains" element={<ExecutiveManagement/>} />



                  <Route path="/terms" element={<TermsAndConditions/>} />
                  <Route path="/policies" element={<PrivacyPolicy/>} />
                  <Route path="/licenses" element={<Licenses/>} />
                  <Route path="/help" element={<HelpPage/>} />
                  <Route path="/orderDetails" element={<OrderDetails />} />


                  <Route path="/executive/signup" element={<DeliveryExecutiveRegister />} />
                  <Route path="/executive/dashboard" element={<ProfileSettingsMain />} />
                  <Route path="/executive/orders" element={<OrderDashboardMain />} />
                  <Route path="/executive/orders-history" element={<OrderHistoryMain />} />

                  <Route path="/logout" element={<LogoutComponent />} />

            </Routes>
      );

};

export default App;

