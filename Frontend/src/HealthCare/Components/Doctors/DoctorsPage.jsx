import { useEffect, useRef, useState } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const DoctorsPage = () => {
    const axios = useAxiosInstance();
    const navigate = useNavigate(); // Initialize useNavigate
    const didFetch = useRef(false);
    const [doctors, setDoctors] = useState([]);
    const [page, setPage] = useState(0);
    const size = 3;
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const fetchDoctors = async (reset = false) => {
        if (!hasMore && !reset || loading) return;

        try {
            setLoading(true);
            const currentPage = reset ? 0 : page;
            const url = isSearching ? '/api/doctors/search' : `/api/doctors/get/paging`;
            const response = await axios.get(url, {
                params: {
                    page: currentPage,
                    size,
                    ...(isSearching && { keyword: search.trim() }),
                },
            });

            const content = response.data.data.content;
            const totalPages = response.data.data.totalPages;

            if (reset) {
                setDoctors(content);
                setPage(1); // Start from the next page
            } else {
                setDoctors(prev => [...prev, ...content]);
                setPage(prev => prev + 1);
            }

            setHasMore(currentPage < totalPages - 1); // Check if there are more pages
        } catch (error) {
            console.error("Error fetching doctors:", error.response ? error.response.data : error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const trimmed = search.trim();
        setIsSearching(!!trimmed);
        setHasMore(true); // Reset hasMore when performing a new search
        fetchDoctors(true); // Always reset and fetch from page 0 for new search
    };

    // Function to handle redirection
    const handleCardClick = (doctorId) => {
        navigate(`/doctor/${doctorId}`);
    };

    useEffect(() => {
        if (!didFetch.current) {
            fetchDoctors();
            didFetch.current = true;
        }
    }, []);

    return (
        <section className="bg-[white] py-16 px-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Our Doctors</h2>

                <div className="flex flex-col md:flex-row gap-3 mb-8 w-full max-w-xl">
                    <input
                        type="text"
                        placeholder="Search doctors by name or specialization..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ease-in-out"
                    >
                        Search
                    </button>
                </div>

                {loading && doctors.length === 0 ? (
                    <p className="text-center text-gray-600">Loading doctors...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {doctors.map((doc) => (
                            <div
                                key={doc.doctorId}
                                onClick={() => handleCardClick(doc.doctorId)} // Add onClick for redirection
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:cursor-pointer transition duration-200 ease-in-out flex flex-col"
                            >
                                <img
                                    src={doc.image || "https://via.placeholder.com/400x200/E0F2F7/4A5568?text=Doctor+Image"}
                                    alt={doc.name}
                                    className="w-full h-96 object-cover"
                                />
                                <div className="p-5 text-center flex flex-col items-center flex-grow">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{doc.name}</h3>
                                    <p className="text-md text-blue-600 mb-2">{doc.specialization}</p>
                                    {/*{doc.qualification && (*/}
                                    {/*    <p className="text-sm text-gray-500 mb-1">{doc.qualification}</p>*/}
                                    {/*)}*/}
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-medium">Clinic:</span> {doc.clinic ? doc.clinic.name : "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-medium">Phone:</span> {doc.user ? doc.user.phone : "N/A"}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                        <span className="font-medium">Visiting Hours:</span>{" "}
                                        {doc.availabilities && doc.availabilities.length > 0
                                            ? doc.availabilities.slice(0, 2).map(av => { // Show max 2 for brevity
                                            let details = av.day.substring(0,3); // Shorten day name
                                            if (av.time) {
                                                const [hours, minutes] = av.time.split(':');
                                                details += ` (${hours}:${minutes})`;
                                            }
                                            return details;
                                        }).join(", ") + (doc.availabilities.length > 2 ? '...' : '')
                                            : "N/A"}
                                    </p>
                                    <p className="text-lg font-bold text-green-700 mt-auto"> {/* mt-auto pushes it to bottom */}
                                        ₹{doc.fee ? doc.fee.toFixed(2) : 'N/A'}
                                    </p>
                                </div> {/* Corrected position of this closing div */}
                            </div>
                        ))}
                    </div>
                )}
                {!loading && doctors.length === 0 && (
                    <p className="text-center text-gray-600 mt-8">No doctors found matching your criteria.</p>
                )}

                {hasMore && (
                    <div className="mt-10 flex justify-center w-full">
                        <button
                            onClick={() => fetchDoctors()}
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? "Loading More..." : "Load More Doctors"}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default DoctorsPage;