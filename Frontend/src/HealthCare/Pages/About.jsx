import React from 'react'
import NavbarHome from '../Components/NavbarHome'
import AboutHero from '../components/about/AboutHero'
import WhyChooseUs from '../components/about/WhyChooseUs'
import AboutServices from '../components/about/AboutServices'
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