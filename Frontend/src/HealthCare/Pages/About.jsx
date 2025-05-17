import React from 'react'
import NavbarHome from '../Components/NavbarHome'
import AboutHero from '../components/about/AboutHero'
import WhyChooseUs from '../components/about/WhyChooseUs'
import StatsSection from '../components/StatsSection'
import AboutServices from '../components/about/AboutServices'
import HealthFooter from '../components/Healthfooter'
import FooterHome from '../Components/FooterHome'


const About = () => {
  return (
    <>
        <NavbarHome/>
        <AboutHero/>
        <WhyChooseUs/>
        <StatsSection/>
        <AboutServices/>
        <HealthFooter/>
        <FooterHome/>
    </>
  )
}

export default About