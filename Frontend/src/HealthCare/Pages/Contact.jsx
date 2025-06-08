import React from 'react'
import NavbarHome from '../Components/NavbarHome'
import ContactCTA from '../Components/Contact/ContactCTA'
import ContactFormSection from '../Components/Contact/ContactFormSection'
import FooterHome from '../Components/FooterHome'
import HealthFooter from '../Components/HealthFooter'


const Contact = () => {
  return (
    <>
      <NavbarHome/>
      <ContactCTA/>
      <ContactFormSection/>
      <HealthFooter/>
      <FooterHome/>
    </>
  )
}

export default Contact