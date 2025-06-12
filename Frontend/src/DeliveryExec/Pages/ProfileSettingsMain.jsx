import React from 'react'
import DeliveryExecSidebar from '../Components/DeliveryExecSidebar'
import ProfileSettings from '../Components/ProfileSettings'
import Help from '../Components/Help'


const ProfileSettingsMain = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <Help/>
            {/* Sidebar Placeholder (20% of screen width) */}
            <div className="w-0 md:w-1/5">
                <DeliveryExecSidebar/>
            </div>

            {/* Main content area (80% of screen width) */}
            <div className="w-full md:w-4/5 flex flex-col justify-center">
                <ProfileSettings />
            </div>
        </div>
    )
}

export default ProfileSettingsMain