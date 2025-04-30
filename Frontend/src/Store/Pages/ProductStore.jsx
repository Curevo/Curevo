import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../Components/HeroSection'
import ProductGrid from '../Components/products'
import Footer from '../components/Footer'



const ProductStore = () => {
  return (
    <>
      <Navbar/>
      <HeroSection/>
      <ProductGrid/>
      <Footer/>
    </>
  )
}

export default ProductStore