import React from 'react'
import NavbarHome from '../Components/NavbarHome'
import AboutHero from '../Components/About/AboutHero'
import WhyChooseUs from '../Components/About/WhyChooseUs'
import AboutServices from '../Components/About/AboutServices'
import HealthFooter from '../Components/HealthFooter'
import FooterHome from '../Components/FooterHome'
import DoctorsPreview from '../Components/Doctors/DoctorsPreview'
import StatsSection from '../Components/StatsSection'



const About = () => {
  return (
    <>
        <NavbarHome/>
        <AboutHero/>
        <WhyChooseUs/>
        <StatsSection/>
        <AboutServices/>
        <DoctorsPreview/>
        <HealthFooter/>
        <FooterHome/>
    </>
  )
}

export default About