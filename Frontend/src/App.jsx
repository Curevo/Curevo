import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Section from './components/Section'
import Footer from './components/Footer'
import Button from './components/Button'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './customer/pages/Signup'
import Login from './customer/pages/Login'
import Products from './customer/pages/Products'


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
        <Route path="/signup" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/products" element={<Products/>} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App;