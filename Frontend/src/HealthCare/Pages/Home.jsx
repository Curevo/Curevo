import React from 'react'
import FooterHome from "../Components/FooterHome"
import HealthFooter from "../Components/HealthFooter"
import HeroHome from "../Components/Home/HeroHome"
import InfoCards from "../Components/Home/InfoCards"
import WellBeingSection from "../Components/Home/WellBeingSection"
import NavbarHome from "../Components/NavbarHome"
import StatsSection from "../Components/StatsSection"
import ChatbotLauncher from '../../Components/ChatbotLauncher'

const Home = () => {
  return (
    <>
        <ChatbotLauncher/>
        <NavbarHome/>
        <HeroHome/>
        <InfoCards/>
        <WellBeingSection/>
        <StatsSection/>
        <HealthFooter/>
        <FooterHome/>
    </>
  )
}

export default Home