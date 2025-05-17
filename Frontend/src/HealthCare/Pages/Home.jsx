import React from 'react'
import NavbarHome from '../../components/NavbarHome'
import HeroHome from './HeroHome'
import InfoCards from './InfoCards'
import WellBeingSection from './WellBeingSection'
import StatsSection from '../../components/StatsSection'
import HealthFooter from '../../components/HealthFooter'
import FooterHome from '../../components/FooterHome'

const Home = () => {
  return (
    <>
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