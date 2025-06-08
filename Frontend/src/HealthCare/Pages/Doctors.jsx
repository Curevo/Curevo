import React from 'react'
import NavbarHome from '../Components/NavbarHome'
import DoctorsPage from '../Components/Doctors/DoctorsPage'
import HealthFooter from '../Components/HealthFooter'
import FooterHome from '../Components/FooterHome'

const Doctors = () => {
    return (
        <>
            <NavbarHome/>
            <DoctorsPage/>
            <HealthFooter/>
            <FooterHome/>
        </>
    )
}

export default Doctors