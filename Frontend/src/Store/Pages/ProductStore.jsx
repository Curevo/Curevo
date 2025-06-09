import React, {useCallback, useState} from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import ProductGrid from '../Components/products'
import Footer from '../Components/Footer'



const ProductStore = () => {
    const [isNavbarCartModalOpen, setIsNavbarCartModalOpen] = useState(false);

    const handleOpenCartModal = useCallback(() => {
        setIsNavbarCartModalOpen(true);
    }, []);

    const handleCloseCartModal = useCallback(() => {
        setIsNavbarCartModalOpen(false);
    }, []);
  return (
    <>
        <Navbar
            isCartOpen={isNavbarCartModalOpen}
            setIsCartOpen={setIsNavbarCartModalOpen}
        />
      <HeroSection/>
      <ProductGrid/>
      <Footer/>
    </>
  )
}

export default ProductStore