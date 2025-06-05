import React from 'react'
import ProductDetails from '../Components/ProductDetails'
import Navbar from '../Components/Navbar'
import HowToUseSection from '../Components/HowToUseSection'
import FeaturesSection from '../Components/FeaturesSection'
import ProductGrid from '../Components/products'
import Footer from '../Components/Footer'

const ProductDetailsPage = () => {
    return (
        <>
            <Navbar/>
            <ProductDetails/>
            <HowToUseSection/>
            <FeaturesSection/>
            <ProductGrid/>
            <Footer/>
        </>
    )
}

export default ProductDetailsPage