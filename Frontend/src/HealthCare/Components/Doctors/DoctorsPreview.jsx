// src/components/DoctorsPreview.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '@/Config/axiosConfig.js';

const DoctorsPreview = () => {

    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
        try {
            const res = await axios.get('/api/doctors');
            setDoctors(res.data.slice(0, 3)); // only take first 3
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
        };

        fetchDoctors();
    }, []);
    

    return (
        <section className="bg-[#f3f9fc] py-16 px-6">
            <div className="max-w-7xl mx-auto lg:flex-row items-center gap-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                    <p className="text-sm text-gray-500">🩺 Our Experts</p>
                    <h2 className="text-3xl font-semibold text-gray-800">Meet Our Doctors</h2>
                    </div>
                    <Link to="/doctors" className="text-blue-600 hover:underline">
                    View All →
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {doctors.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-lg shadow-md p-4 text-center">
                        <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="w-full h-100 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
                        <p className="text-sm text-gray-500">{doc.specialty}</p>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


export default DoctorsPreview;
