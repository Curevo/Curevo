import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../Components/Navbar';
import HeroSection from '../Components/HeroSection';
import ProductGrid from '../Components/products'; // Assuming this is your ProductGrid component
import Footer from '../Components/Footer';

const ProductStore = () => {
    const navigate = useNavigate();
    const [isNavbarCartModalOpen, setIsNavbarCartModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // Define searchTerm state here

    const handleOpenCartModal = useCallback(() => {
        setIsNavbarCartModalOpen(true);
    }, []);

    const handleCloseCartModal = useCallback(() => {
        setIsNavbarCartModalOpen(false);
    }, []);

    // This function handles the search submission from HeroSection
    const handleHeroSearchSubmit = (query) => {
        if (query.trim() !== '') {
            navigate(`/store/products?keyword=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <>
            <Navbar
                isCartOpen={isNavbarCartModalOpen}
                setIsCartOpen={setIsNavbarCartModalOpen}
            />
            {/* Main content area, accounting for Navbar's height */}
            <div className="pt-16"> {/* Adjust this padding if your Navbar has a different height */}
                <HeroSection
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    onSearchSubmit={handleHeroSearchSubmit} // Pass the search submit handler
                />
                <ProductGrid />
            </div>
            <Footer />
        </>
    );
};

export default ProductStore;