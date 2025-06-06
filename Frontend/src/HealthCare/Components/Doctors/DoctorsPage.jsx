import {useEffect, useRef, useState} from 'react';
import {useAxiosInstance} from '@/Config/axiosConfig.js';



    const DoctorsPage = () => {
        const axios = useAxiosInstance();
        const didFetch = useRef(false);
        const [doctors, setDoctors] = useState([]);
        const [page, setPage] = useState(0);
        const size = 1;
        const [loading, setLoading] = useState(false);
        const [hasMore, setHasMore] = useState(true);
        const [search, setSearch] = useState('');
        const [isSearching, setIsSearching] = useState(false);

        const fetchDoctors = async (reset = false) => {
            if (!hasMore || loading) return;

            try {
                setLoading(true);
                const url = isSearching ? '/api/doctors/search' : `/api/doctors?page=${page}&size=${size}`;
                const response = await axios.get(url, {
                    params: {
                        page: reset ? 0 : page,
                        size,
                        ...(isSearching && { keyword: search.trim() }),
                    },
                });

                const content = response.data.data.content;

                if (content.length === 0) {
                    setHasMore(false);
                } else {
                    setDoctors(prev => [...prev, ...content]);
                    setPage(prev => prev + 1);
                }
            } catch (error) {
                console.error( error.response.message );
            } finally {
                setLoading(false);
            }
        };

        const handleSearch = () => {
            const trimmed = search.trim();
            setDoctors([]); // Clear old list
            setPage(0);
            setHasMore(true);
            setIsSearching(!!trimmed);
            // Delay fetch until state updates
            setTimeout(() => {
                fetchDoctors(true);
            }, 0);
        };

        // // Initial load
        // useEffect(() => {
        //     fetchDoctors();
        // }, []);


        useEffect(() => {
            if (!didFetch.current) {
                fetchDoctors();
                didFetch.current = true;
            }
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {doctors.map((doc) => (
                        <div key={doc.doctorId} className="bg-white rounded-lg shadow-md p-4 text-center hover:drop-shadow-md hover:scale-105 duration-300">
                        <img src={doc.image} alt={doc.name} className="w-full h-100 object-cover rounded-md mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800">{doc.name}</h3>
                        <p className="text-sm text-gray-500">{doc.specialization}</p>
                        </div>
                    ))}
                    </div>
                )}
            </div>
            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={fetchDoctors}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Load More"}
                    </button>
                </div>
            )}

        </section>
    );
};

export default DoctorsPage;
