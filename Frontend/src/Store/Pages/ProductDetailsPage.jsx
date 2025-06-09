import React, { useState, useCallback } from 'react';
import ProductDetails from '../Components/ProductDetails';
import Navbar from '../Components/Navbar';
import ProductGrid from '../Components/products';
import Footer from '../Components/Footer';

const ProductDetailsPage = () => {
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
            <ProductDetails onOpenCartModal={handleOpenCartModal} />
            <ProductGrid />
            <Footer />
        </>
    );
};

export default ProductDetailsPage;