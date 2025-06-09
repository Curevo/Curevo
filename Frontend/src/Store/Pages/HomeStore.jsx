import React from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import ProductGrid from '../Components/products'
import CareSection from '../Components/CareSection'
import TestimonialCarousel from '../Components/TestimonialCarousel'
import ProductHero from '../Components/ProductHero'
import Footer from '../Components/Footer'


const HomeStore = () => {
    return (
        <>
            <Navbar/>
            <Hero/>
            <ProductGrid/>
            <CareSection/>
            <TestimonialCarousel/>
            <ProductHero/>
            <ProductGrid/>
            <Footer/>
        </>
    )
}

export default HomeStore