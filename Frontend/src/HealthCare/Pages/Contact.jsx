import React from 'react'
import NavbarHome from '../Components/NavbarHome'
import ContactCTA from '../components/contact/ContactCTA'
import ContactFormSection from '../components/contact/ContactFormSection'
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