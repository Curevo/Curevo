import { useEffect, useState } from 'react';
import axios from '@/Config/axiosConfig.js';


const DoctorsPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const fetchDoctors = async () => {
        setLoading(true);
        try {
        const response = await axios.get('/api/doctors');
        setDoctors(response.data);
        } catch (error) {
        console.error('Error fetching doctors:', error);
        }
        setLoading(false);
    };

    const handleSearch = async () => {
        if (!search.trim()) return fetchDoctors();
        try {
        const response = await axios.get(`/api/doctors/search?name=${search}`);
        setDoctors(response.data);
        } catch (error) {
        console.error('Search failed:', error);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    return (
        <section className="bg-[#f3f9fc] py-16 px-6">
            <div className="max-w-7xl mx-auto lg:flex-row items-center gap-10">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">Doctors</h2>

                <div className="flex gap-2 mb-6">
                    <input
                    type="text"
                    placeholder="Search doctors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md"
                    />
                    <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                    Search
                    </button>
                </div>

                {loading ? (
                    <p>Loading doctors...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 hover:drop-shadow-md hover:scale-105 duration-300">
                    {doctors.map((doc) => (
                        <div key={doc.id} className="bg-white rounded-lg shadow-md p-4 text-center">
                        <img src={doc.imageUrl} alt={doc.name} className="w-full h-100 object-cover rounded-md mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
                        <p className="text-sm text-gray-500">{doc.specialty}</p>
                        </div>
                    ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DoctorsPage;
