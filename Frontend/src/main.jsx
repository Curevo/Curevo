import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { LocationProvider } from './Hooks/LocationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <LocationProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </LocationProvider>
    </React.StrictMode>
);

