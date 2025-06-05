import React from 'react'
import NavbarHome from '../Components/NavbarHome'
import ContactCTA from '../Components/Contact/ContactCTA'
import ContactFormSection from '../Components/Contact/ContactFormSection'
import FooterHome from '../Components/FooterHome'


const Contact = () => {
  return (
    <>
      <NavbarHome/>
      <ContactCTA/>
      <ContactFormSection/>
      <FooterHome/>
    </>
  )
}

export default Contact