import React from 'react'
import NavbarHome from '../Components/NavbarHome'
import DoctorProfileComponent from '../Components/Doctors/DoctorProfileComponent'
import HealthFooter from '../Components/HealthFooter'
import FooterHome from '../Components/FooterHome'

const DoctorProfile = () => {
    return (
        <>
            <NavbarHome/>
            <DoctorProfileComponent/>
            <HealthFooter/>
            <FooterHome/>
        </>
    )
}

export default DoctorProfile