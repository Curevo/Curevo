import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomeStore from './Pages/HomeStore'
import ProductStore from './Pages/ProductStore'
import Sidebar from './Components/Sidebar'
import ProductDetailsPage from './Pages/ProductDetailsPage'
import Home from './Components/Home/Home'
import About from './Pages/About'
import Services from './Pages/Services'
import Doctors from './Pages/Doctors'
import Contact from './Pages/Contact'
import Appoinments from './Pages/Appoinments'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/store" element={<HomeStore />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/appointments" element={<Appoinments/>} />
        <Route path="/product" element={<ProductStore />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/product/:id" element={<ProductDetailsPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App