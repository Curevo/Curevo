// src/components/LogoutComponent.jsx (or wherever you keep your components)
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutComponent = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear the JWT from localStorage
        // IMPORTANT: Make sure 'jwt_token' matches the key you use to store your token
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        console.log("Token removed from localStorage. User logged out client-side.");


        navigate('/', { replace: true });
    }, [navigate]); // navigate is a stable hook, but listing it here is a good habit.

    return (
        <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.2em' }}>
            Logging out...
        </div>
    );
};

export default LogoutComponent;