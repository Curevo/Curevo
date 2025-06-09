import React, {useCallback, useState} from 'react'
import Navbar from '../Components/Navbar'
import Hero from '../Components/Hero'
import ProductGrid from '../Components/products'
import CareSection from '../Components/CareSection'
import TestimonialCarousel from '../Components/TestimonialCarousel'
import ProductHero from '../Components/ProductHero'
import Footer from '../Components/Footer'
import ChatbotLauncher from '../../Components/ChatbotLauncher'


const HomeStore = () => {
    const [isNavbarCartModalOpen, setIsNavbarCartModalOpen] = useState(false);

    const handleOpenCartModal = useCallback(() => {
        setIsNavbarCartModalOpen(true);
    }, []);

    const handleCloseCartModal = useCallback(() => {
        setIsNavbarCartModalOpen(false);
    }, []);
    return (
        <>
            <ChatbotLauncher/>
            <Navbar
                isCartOpen={isNavbarCartModalOpen}
                setIsCartOpen={setIsNavbarCartModalOpen}
            />
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