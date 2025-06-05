import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import ProductGrid from '../Components/products'
import Footer from '../Components/Footer'



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