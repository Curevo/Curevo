import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Section from './components/Section'
import Footer from './components/Footer'
import Button from './components/Button'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './customer/pages/Signup'
import Login from './customer/pages/Login'
import ProductGrid from './Store/Components/products'
import HomeStore from './Store/Pages/HomeStore'
import ProductStore from './Store/Pages/ProductStore'

// import ProductDetails from './Store/Components/ProductDetails'
import ProductDetailsPage from './Store/Pages/ProductDetailsPage'
import Home from './HealthCare/pages/Home'
import Doctors from './HealthCare/Pages/Doctors'
import About from './HealthCare/Pages/About'
import Contact from './HealthCare/Pages/Contact'

import Services from './HealthCare/Pages/Services'

// import Products from './customer/pages/Products'

import UserProfile from './customer/pages/UserProfile'



const App = () => {
  return (
    // <>
    //   <Navbar />
    //   <Hero />
    //   <Section/>
    //   <Footer/>
    // </>
    <BrowserRouter>
      <Routes>

        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/services" element={<Services />} />
        <Route path="/store" element={<HomeStore />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/products" element={<ProductGrid/>} />
        <Route path="/store/home" element={<HomeStore/>} />
        <Route path="/store/products" element={<ProductStore/>} />
        {/* <Route path="/products" element={<Products/>} /> */}
        <Route path="/product/:productId" element={<ProductDetailsPage />} />

        <Route path="/Signup" element={<Signup/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/" element={<Home />} />
        <Route path="/Products" element={<ProductGrid/>} />
        <Route path="/Store/Home" element={<HomeStore/>} />
        <Route path="/Store/Products" element={<ProductStore/>} />
        <Route path="/UserProfile" element={<UserProfile/>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;