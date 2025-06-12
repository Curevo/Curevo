import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useEffect } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';

const DoctorsPreview = () => {
    const [doctors, setDoctors] = useState([]);
    const axios = useAxiosInstance();
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get('/api/doctors/get/paging', {
                    params: { page: 0, size: 20 }, // fetch more doctors to shuffle
                });

                const allDoctors = res.data.data.content;

                // Shuffle array helper function
                const shuffleArray = (arr) => {
                    return arr
                        .map(value => ({ value, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({ value }) => value);
                };

                const shuffledDoctors = shuffleArray(allDoctors);

                setDoctors(shuffledDoctors.slice(0, 3)); // pick 3 random doctors
            } catch (err) {
                console.error('Error fetching doctors:', err);
                // Optionally set an error state here to display a message to the user
            }
        };

        fetchDoctors();
    }, []);

    // Handle card click to navigate to individual doctor page
    const handleCardClick = (doctorId) => {
        navigate(`/doctor/${doctorId}`);
    };

    return (
        <section className="bg-gradient-to-br py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-10 text-center sm:text-left">
                    <div>
                        <p className="text-sm font-semibold text-blue-600 mb-1">🩺 Your Health, Our Priority</p>
                        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">Meet Our <span className="text-blue-600">Expert Doctors</span></h2>
                        <p className="mt-3 text-lg text-gray-600 max-w-2xl">
                            Discover qualified medical professionals specializing in various fields.
                            Find the right care, right when you need it.
                        </p>
                    </div>
                    <Link
                        to="/doctors"
                        className="mt-6 sm:mt-0 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md
                                   hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                    >
                        View All Doctors &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.length > 0 ? (
                        doctors.map((doc) => (
                            <div
                                key={doc.doctorId}
                                className="bg-white rounded-xl shadow-lg p-6 text-center cursor-pointer
                                           hover:shadow-xl hover:scale-102 transition duration-300 ease-in-out
                                           transform flex flex-col items-center group" // Added group class for hover effect
                                onClick={() => handleCardClick(doc.doctorId)} // Added onClick handler
                            >
                                <div className="relative w-32 h-32 mb-6 rounded-full overflow-hidden border-4 border-blue-200 group-hover:border-blue-500 transition-colors duration-300">
                                    <img
                                        src={doc.image || 'https://via.placeholder.com/150'} // Fallback image
                                        alt={doc.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Optional: Add a subtle overlay on hover for a modern touch */}
                                    <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-full"></div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{doc.name}</h3>
                                <p className="text-md text-blue-700 font-medium mb-3">{doc.specialization}</p>
                                {/* Add more details here if available, e.g., experience, rating */}
                                {/* <p className="text-gray-600 text-sm">8+ Years Experience</p> */}
                                <button className="mt-4 px-5 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold
                                                   hover:bg-blue-100 hover:text-blue-800 transition duration-300">
                                    View Profile
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 text-lg">
                            No doctors found or loading...
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DoctorsPreview;