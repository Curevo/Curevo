import React, { useState, useEffect } from "react";
import { UserPlus, Trash2, X, PlusCircle, MinusCircle, Edit3 } from "lucide-react";
import { useAxiosInstance } from "@/Config/axiosConfig.js";

const DoctorProfiles = () => {
    const axios = useAxiosInstance();
    const API_URL = "/api/doctors/get-all";
    const ADD_DELETE_API_URL = "/api/doctors";

    const [doctors, setDoctors] = useState([]);
    const [clinics, setClinics] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'

    // This state will hold the data for the form, whether adding or editing
    const [doctorFormData, setDoctorFormData] = useState({
        doctorId: null, // Only for edit mode
        name: "",
        qualification: "",
        specialization: "",
        fee: "", // Visit Fees field
        availabilities: [],
        imageFile: null,
        imageUrlPreview: "", // For displaying selected/existing image
        user: {
            id: null, // Only for edit mode
            email: "",
            password: "",
            phone: "",
        },
        clinic: {
            clinicId: ""
        }
    });

    // State for managing inputs for a single availability slot being added/edited
    const [currentAvailabilityInput, setCurrentAvailabilityInput] = useState({
        day: "",
        time: "",
        maxAppointments: ""
    });

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setDoctors(response.data.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch doctors. Please try again later.");
            console.error("Error fetching doctors:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        const fetchSpecializations = async () => {
            try {
                const response = await axios.get("/api/doctors/specializations");
                setSpecializations(response.data.data || []);
            } catch (err) {
                console.error("Error fetching specializations:", err);
            }
        };

        const fetchClinics = async () => {
            try {
                const response = await axios.get("/api/clinics");
                setClinics(response.data.data || []);
            } catch (err) {
                console.error("Error fetching clinics:", err);
            }
        };

        fetchSpecializations();
        fetchClinics();
    }, []);

    // Helper to reset form data
    const resetFormData = () => {
        setDoctorFormData({
            doctorId: null,
            name: "",
            qualification: "",
            specialization: "",
            fee: "",
            availabilities: [],
            imageFile: null,
            imageUrlPreview: "",
            user: { id: null, email: "", password: "", phone: "" },
            clinic: { clinicId: "" }
        });
        setCurrentAvailabilityInput({ day: "", time: "", maxAppointments: "" });
    };

    // Open modal for adding a new doctor
    const openAddModal = () => {
        setModalMode("add");
        resetFormData(); // Ensure form is clean for new entry
        setIsModalOpen(true);
    };

    // Open modal for editing an existing doctor
    const openEditModal = (doctor) => {
        setModalMode("edit");
        // Deep copy the doctor object to prevent direct state mutation
        const doctorToEdit = JSON.parse(JSON.stringify(doctor));

        // Format availabilities for time input (HH:MM)
        const formattedAvailabilities = doctorToEdit.availabilities.map(av => ({
            ...av,
            time: av.time ? av.time.substring(0, 5) : "" // Convert "HH:MM:SS" to "HH:MM"
        }));

        setDoctorFormData({
            doctorId: doctorToEdit.doctorId,
            name: doctorToEdit.name,
            qualification: doctorToEdit.qualification || "", // Handle null qualification
            specialization: doctorToEdit.specialization,
            fee: doctorToEdit.fee || "", // Populate fee for edit
            availabilities: formattedAvailabilities,
            imageFile: null, // We don't pre-populate imageFile, only imageUrlPreview
            imageUrlPreview: doctorToEdit.image || "", // Use existing image URL for preview
            user: {
                id: doctorToEdit.user.id,
                email: doctorToEdit.user.email,
                password: "", // Never pre-populate password for security
                phone: doctorToEdit.user.phone,
            },
            clinic: {
                clinicId: doctorToEdit.clinic ? doctorToEdit.clinic.clinicId.toString() : "" // Convert to string for select input
            }
        });
        setIsModalOpen(true);
    };

    // Unified input change handler for the main doctor form fields
    const handleDoctorFormInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setDoctorFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setDoctorFormData({
                ...doctorFormData,
                [name]: value
            });
        }
    };

    // Unified image upload handler for the main doctor form
    const handleDoctorFormImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDoctorFormData(prev => ({
                ...prev,
                imageFile: file,
                imageUrlPreview: URL.createObjectURL(file)
            }));
        } else {
            setDoctorFormData(prev => ({
                ...prev,
                imageFile: null,
                imageUrlPreview: ""
            }));
        }
    };

    // Handle input changes for the current availability slot
    const handleAvailabilityInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentAvailabilityInput(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addAvailabilitySlot = () => {
        const { day, time, maxAppointments } = currentAvailabilityInput;

        if (!day || !time || !maxAppointments) {
            alert("Please select a day, time, and max appointments for the slot.");
            return;
        }

        const newSlot = {
            day: day,
            time: time + ":00", // Append :00 to match LocalTime HH:MM:SS format
            maxAppointments: parseInt(maxAppointments)
        };

        // Check if the exact slot (day and time) already exists
        const isDuplicate = doctorFormData.availabilities.some(
            av => av.day === newSlot.day && av.time === newSlot.time
        );

        if (isDuplicate) {
            alert("An availability slot for this day and time already exists.");
            return;
        }

        setDoctorFormData(prev => ({
            ...prev,
            availabilities: [
                ...prev.availabilities,
                newSlot
            ].sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day)) // Sort by day order
        }));

        setCurrentAvailabilityInput({ day: "", time: "", maxAppointments: "" }); // Reset current availability inputs
    };

    // Remove an availability slot
    const removeAvailabilitySlot = (indexToRemove) => {
        setDoctorFormData(prev => ({
            ...prev,
            availabilities: prev.availabilities.filter((_, index) => index !== indexToRemove)
        }));
    };

    // Function to handle form submission (Add or Update)
    const handleSubmit = async () => {
        // Basic validation for required fields
        if (
            !doctorFormData.name ||
            !doctorFormData.specialization ||
            !doctorFormData.user.email ||
            (!doctorFormData.user.password && modalMode === 'add') || // Password required only for add
            !doctorFormData.user.phone ||
            !doctorFormData.clinic.clinicId ||
            doctorFormData.availabilities.length === 0 ||
            !doctorFormData.fee // Validate fee presence
        ) {
            alert("Please fill all required fields (Name, Specialization, Email, Password (for new doctor), Phone, Clinic, Visit Fees, and at least one Visiting Slot).");
            return;
        }

        const parsedFee = parseFloat(doctorFormData.fee);
        if (isNaN(parsedFee) || parsedFee <= 0) {
            alert("Visit Fees must be a positive number.");
            return;
        }

        const formData = new FormData();

        const doctorData = {
            name: doctorFormData.name,
            qualification: doctorFormData.qualification,
            specialization: doctorFormData.specialization,
            fee: parsedFee, // Corrected: Include parsed 'fee'
            availabilities: doctorFormData.availabilities,
            user: {
                id: doctorFormData.user.id,
                email: doctorFormData.user.email,
                // Only send password if it's an 'add' operation or if it's provided during 'edit'
                password: modalMode === 'add' ? doctorFormData.user.password : (doctorFormData.user.password || null),
                phone: doctorFormData.user.phone,
            },
            clinic: {
                clinicId: parseInt(doctorFormData.clinic.clinicId)
            }
        };

        // Append the doctor object as a JSON string
        formData.append('doctor', new Blob([JSON.stringify(doctorData)], { type: 'application/json' }));

        // Append the image file if available
        if (doctorFormData.imageFile) {
            formData.append('image', doctorFormData.imageFile);
        }

        try {
            let response;
            if (modalMode === "add") {
                response = await axios.post(`${ADD_DELETE_API_URL}/add`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                // Optimistically add the new doctor to the list
                setDoctors(prev => [...prev, response.data.data]);
            } else { // modalMode === "edit"
                response = await axios.put(`/api/doctors/update/${doctorFormData.doctorId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                // Update the doctor in the list
                setDoctors(prev => prev.map(doc =>
                    doc.doctorId === response.data.data.doctorId ? response.data.data : doc
                ));
            }

            resetFormData();
            setIsModalOpen(false);
            // Re-fetch all doctors to ensure state consistency with backend after CUD operations
            fetchDoctors();
            alert(`Doctor ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);

        } catch (err) {
            console.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} doctor:`, err.response ? err.response.data : err);
            alert(`Failed to ${modalMode === 'add' ? 'add' : 'update'} doctor: ${err.response?.data?.message || 'Please try again.'}`);
        }
    };

    const deleteDoctor = async (id) => {
        if (!window.confirm("Are you sure you want to delete this doctor profile?")) {
            return; // Exit if user cancels
        }
        try {
            const response = await axios.delete(`/api/doctors/delete/${id}`);
            if (response.data.success) {
                setDoctors(doctors.filter(doctor => doctor.doctorId !== id));
                alert("Doctor deleted successfully!");
            } else {
                alert(`Failed to delete doctor: ${response.data.message}`);
            }
        } catch (err) {
            console.error("Error deleting doctor:", err.response ? err.response.data : err);
            alert(`Failed to delete doctor: ${err.response?.data?.message || 'Please try again.'}`);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Loading doctor profiles...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-600 font-medium">{error}</div>;
    }

    return (
        <div className="p-4 w-full bg-gray-100 min-h-screen"> {/* Reduced p-6 to p-4 */}
            <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-lg shadow-md"> {/* Reduced mb-6 to mb-4, p-4 to p-3 */}
                <h1 className="text-2xl font-extrabold text-gray-800">Doctor Profiles Management</h1> {/* Reduced text-3xl to text-2xl */}
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-semibold shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105" // Reduced px, py, text-lg, gap
                >
                    <UserPlus size={18} /> {/* Reduced icon size */}
                    Add Doctor
                </button>
            </div>

            <div className="space-y-3"> {/* Reduced space-y-4 to space-y-3 */}
                {doctors.length === 0 ? (
                    <div className="text-center p-6 bg-white rounded-lg shadow-md text-gray-500 text-base"> {/* Reduced p-8 to p-6, text-lg to text-base */}
                        <p>No doctor profiles found. Click "Add Doctor" to get started!</p>
                    </div>
                ) : (
                    doctors.map((doctor) => (
                        <div
                            key={doctor.doctorId}
                            className="flex flex-col sm:flex-row items-center p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out" // Reduced p-4 to p-3
                        >
                            {/* Doctor Photo */}
                            <img
                                src={doctor.image || "https://via.placeholder.com/80/EEEEEE/808080?text=No+Image"}
                                alt={doctor.name}
                                className="w-16 h-16 rounded-full object-cover mb-3 sm:mb-0 sm:mr-4 border-2 border-gray-200" // Reduced w-20 h-20 to w-16 h-16, mr-6 to mr-4
                            />

                            {/* Doctor Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-lg mb-0.5 text-gray-900">{doctor.name}</h3> {/* Reduced text-xl to text-lg, mb-1 to mb-0.5 */}
                                <p className="text-gray-700 text-sm mb-0.5"> {/* Added text-sm */}
                                    <span className="font-semibold">Specialization:</span> {doctor.specialization}
                                </p>
                                {doctor.qualification && (
                                    <p className="text-gray-700 text-sm mb-0.5"> {/* Added text-sm */}
                                        <span className="font-semibold">Qualification:</span> {doctor.qualification}
                                    </p>
                                )}
                                <p className="text-gray-700 text-sm mb-0.5"> {/* Added text-sm */}
                                    <span className="font-semibold">Visit Fees:</span> ₹{doctor.fee ? doctor.fee.toFixed(2) : 'N/A'}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5 mb-0.5"> {/* Reduced text-sm to text-xs, mt-1 to mt-0.5 */}
                                    <span className="font-semibold">Visiting Hours:</span>{" "}
                                    {doctor.availabilities && doctor.availabilities.length > 0
                                        ? doctor.availabilities.map(av => {
                                            let details = av.day;
                                            if (av.time) {
                                                const [hours, minutes] = av.time.split(':');
                                                details += ` (${hours}:${minutes})`;
                                            }
                                            if (av.maxAppointments) {
                                                details += ` - ${av.maxAppointments} apps`;
                                            }
                                            return details;
                                        }).join(", ")
                                        : "Not set"}
                                </p>
                                <p className="text-xs text-gray-600 mb-0.5"> {/* Reduced text-sm to text-xs */}
                                    <span className="font-semibold">Email:</span> {doctor.user ? doctor.user.email : "N/A"}
                                </p>
                                <p className="text-xs text-gray-600"> {/* Reduced text-sm to text-xs */}
                                    <span className="font-semibold">Clinic:</span> {doctor.clinic ? doctor.clinic.name : "N/A"}
                                </p>
                            </div>

                            {/* Action Buttons (Edit and Delete) */}
                            <div className="flex space-x-2 mt-3 sm:mt-0 sm:ml-4"> {/* Reduced space-x-3 to space-x-2, mt-4 to mt-3, ml-6 to ml-4 */}
                                <button
                                    onClick={() => openEditModal(doctor)}
                                    className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full hover:bg-blue-50 transition-colors duration-200" // Reduced p-2 to p-1.5
                                    aria-label={`Edit ${doctor.name}`}
                                >
                                    <Edit3 size={18} /> {/* Reduced icon size */}
                                </button>
                                <button
                                    onClick={() => deleteDoctor(doctor.doctorId)}
                                    className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors duration-200" // Reduced p-2 to p-1.5
                                    aria-label={`Delete ${doctor.name}`}
                                >
                                    <Trash2 size={18} /> {/* Reduced icon size */}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal for Add/Edit Doctor */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2"> {/* Reduced p-4 to p-2 */}
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl transform scale-95 transition-all duration-300 ease-out sm:scale-100"> {/* Reduced p-8 to p-6, max-w-2xl to max-w-xl, max-h-[90vh] to max-h-[95vh] */}
                        <div className="flex justify-between items-center mb-4 border-b pb-3"> {/* Reduced mb-6 to mb-4, pb-4 to pb-3 */}
                            <h2 className="text-xl font-bold text-gray-800">{modalMode === "add" ? "Add New Doctor" : "Edit Doctor Profile"}</h2> {/* Reduced text-2xl to text-xl */}
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    if (doctorFormData.imageUrlPreview && doctorFormData.imageFile) { // Only revoke if it's a new file preview
                                        URL.revokeObjectURL(doctorFormData.imageUrlPreview);
                                    }
                                    resetFormData(); // Reset all form states when closing
                                }}
                                className="text-gray-500 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-100 transition" // Reduced p-1 to p-0.5
                                aria-label="Close modal"
                            >
                                <X size={20} /> {/* Reduced icon size */}
                            </button>
                        </div>

                        <div className="space-y-4"> {/* Reduced space-y-6 to space-y-4 */}
                            {/* Doctor Photo */}
                            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50"> {/* Reduced p-4 to p-3 */}
                                <label className="block text-sm font-semibold text-gray-700 mb-1"> {/* Reduced mb-2 to mb-1 */}
                                    Doctor Photo (Optional)
                                </label>
                                <div className="flex items-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-3 border border-gray-300 flex-shrink-0"> {/* Reduced w-20 h-20 to w-16 h-16, mr-4 to mr-3 */}
                                        {doctorFormData.imageUrlPreview ? (
                                            <img
                                                src={doctorFormData.imageUrlPreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
                                                No image selected
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleDoctorFormImageUpload}
                                        className="block w-full text-xs text-gray-500 {/* Reduced text-sm to text-xs */}
                                                file:mr-3 file:py-1.5 file:px-3 {/* Reduced file:mr-4 file:py-2 file:px-4 */}
                                                file:rounded-full file:border-0
                                                file:text-xs file:font-semibold {/* Reduced file:text-sm to file:text-xs */}
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Basic Doctor Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"> {/* Reduced gap-5 to gap-4, p-4 to p-3 */}
                                <h3 className="col-span-full text-base font-bold text-gray-800 mb-1.5">General Information</h3> {/* Reduced text-md to text-base, mb-2 to mb-1.5 */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-0.5"> {/* Reduced mb-1 to mb-0.5 */}
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={doctorFormData.name}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                                        placeholder="Dr. John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-0.5">
                                        Qualification (e.g., MBBS, MD)
                                    </label>
                                    <input
                                        type="text"
                                        id="qualification"
                                        name="qualification"
                                        value={doctorFormData.qualification}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                                        placeholder="MBBS, MD"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-0.5">
                                        Specialization <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="specialization"
                                        name="specialization"
                                        value={doctorFormData.specialization}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                                        required
                                    >
                                        <option value="">Select Specialization</option>
                                        {specializations.map(spec => (
                                            <option key={spec} value={spec}>
                                                {spec.charAt(0).toUpperCase() + spec.slice(1).toLowerCase().replace(/_/g, ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="fee" className="block text-sm font-medium text-gray-700 mb-0.5">
                                        Visit Fees (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="fee"
                                        name="fee"
                                        value={doctorFormData.fee}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                                        placeholder="e.g., 500"
                                        min="0"
                                        step="any"
                                        required
                                    />
                                </div>
                            </div>

                            {/* User Login Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"> {/* Reduced gap-5 to gap-4, p-4 to p-3 */}
                                <h3 className="col-span-full text-base font-bold text-gray-800 mb-1.5">Login Credentials</h3> {/* Reduced text-md to text-base, mb-2 to mb-1.5 */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-0.5">
                                        Doctor Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="user.email"
                                        value={doctorFormData.user.email}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                                        placeholder="doctor@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-0.5">
                                        Password {modalMode === 'add' && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="user.password"
                                        value={doctorFormData.user.password}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                                        placeholder={modalMode === 'add' ? "Set a strong password" : "Leave blank to keep existing"}
                                        required={modalMode === 'add'} // Password only required for add mode
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-0.5">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="user.phone"
                                        value={doctorFormData.user.phone}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                                        placeholder="e.g., +919876543210"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Clinic Selection */}
                            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50"> {/* Reduced p-4 to p-3 */}
                                <label htmlFor="clinicId" className="block text-sm font-medium text-gray-700 mb-0.5">
                                    Associated Clinic <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="clinicId"
                                    name="clinic.clinicId"
                                    value={doctorFormData.clinic.clinicId}
                                    onChange={handleDoctorFormInputChange}
                                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                                    required
                                >
                                    <option value="">Select Clinic</option>
                                    {clinics.map(clinic => (
                                        <option key={clinic.clinicId} value={clinic.clinicId}>
                                            {clinic.name} (ID: {clinic.clinicId})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Availability Slots */}
                            <div className="p-3 border border-gray-200 rounded-lg bg-gray-50"> {/* Reduced p-4 to p-3 */}
                                <h3 className="text-base font-bold text-gray-800 mb-3"> {/* Reduced text-md to text-base, mb-4 to mb-3 */}
                                    Visiting Slots <span className="text-red-500">*</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 items-end"> {/* Reduced gap-4 to gap-3, mb-4 to mb-3 */}
                                    <div>
                                        <label htmlFor="availabilityDay" className="block text-sm font-medium text-gray-700 mb-0.5">Day</label>
                                        <select
                                            id="availabilityDay"
                                            name="day"
                                            value={currentAvailabilityInput.day}
                                            onChange={handleAvailabilityInputChange}
                                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900 bg-white"
                                        >
                                            <option value="">Select Day</option>
                                            {daysOfWeek.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="availabilityTime" className="block text-sm font-medium text-gray-700 mb-0.5">Time</label>
                                        <input
                                            type="time"
                                            id="availabilityTime"
                                            name="time"
                                            value={currentAvailabilityInput.time}
                                            onChange={handleAvailabilityInputChange}
                                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="maxAppointments" className="block text-sm font-medium text-gray-700 mb-0.5">Max Appointments</label>
                                        <input
                                            type="number"
                                            id="maxAppointments"
                                            name="maxAppointments"
                                            value={currentAvailabilityInput.maxAppointments}
                                            onChange={handleAvailabilityInputChange}
                                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-900"
                                            min="1"
                                            placeholder="e.g., 10"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addAvailabilitySlot}
                                        className="flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md font-semibold text-sm transition-colors duration-200 h-[38px]"
                                    >
                                        <PlusCircle size={16} /> Add Slot {/* Reduced icon size */}
                                    </button>
                                </div>

                                {doctorFormData.availabilities.length > 0 && (
                                    <div className="mt-3 border-t pt-3 border-gray-200"> {/* Reduced mt-4 to mt-3, pt-4 to pt-3 */}
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Slots:</h4>
                                        <ul className="space-y-1.5"> {/* Reduced space-y-2 to space-y-1.5 */}
                                            {doctorFormData.availabilities.map((slot, index) => (
                                                <li key={index} className="flex justify-between items-center bg-gray-100 p-2.5 rounded-md shadow-sm text-sm text-gray-800"> {/* Reduced p-3 to p-2.5, added text-sm */}
                                                    <span>
                                                        {slot.day} at {slot.time.substring(0, 5)} (Max: {slot.maxAppointments} apps)
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAvailabilitySlot(index)}
                                                        className="text-red-500 hover:text-red-700 p-0.5 rounded-full hover:bg-red-100 transition"
                                                        aria-label={`Remove slot ${slot.day} ${slot.time}`}
                                                    >
                                                        <MinusCircle size={18} /> {/* Reduced icon size */}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="mt-6 flex justify-end space-x-3 border-t pt-4"> {/* Reduced mt-8 to mt-6, space-x-4 to space-x-3, pt-6 to pt-4 */}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsModalOpen(false);
                                    if (doctorFormData.imageUrlPreview && doctorFormData.imageFile) {
                                        URL.revokeObjectURL(doctorFormData.imageUrlPreview);
                                    }
                                    resetFormData();
                                }}
                                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold hover:bg-gray-300 transition-colors duration-200 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="px-5 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md text-sm"
                            >
                                {modalMode === "add" ? "Add Doctor" : "Update Doctor"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorProfiles;