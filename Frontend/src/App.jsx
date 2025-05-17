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
import Home from './pages/Home'
import Doctors from './HealthCare/Pages/Doctors'
import About from './HealthCare/Pages/About'
import Contact from './HealthCare/Pages/Contact'

import Services from './HealthCare/Pages/Services'

// import Products from './customer/pages/Products'


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
      </Routes>
    </BrowserRouter>
  )
}

export default App;