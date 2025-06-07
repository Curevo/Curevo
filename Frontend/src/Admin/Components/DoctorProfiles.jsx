import React, { useState, useEffect } from "react";
import { UserPlus, Trash2, X, PlusCircle, MinusCircle, Edit3 } from "lucide-react"; // Added Edit3 icon
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
            doctorFormData.availabilities.length === 0
        ) {
            alert("Please fill all required fields (Name, Specialization, Email, Password (for new doctor), Phone, Clinic, and at least one Visiting Slot).");
            return;
        }

        const formData = new FormData();

        const doctorData = {
            name: doctorFormData.name,
            qualification: doctorFormData.qualification,
            specialization: doctorFormData.specialization,
            availabilities: doctorFormData.availabilities,
            user: {
                // If editing, send user ID; if adding, it will be null/ignored
                id: doctorFormData.user.id,
                email: doctorFormData.user.email,
                // Only send password if it's new/changed and it's an add operation
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
        } else if (modalMode === 'edit' && doctorFormData.imageUrlPreview && !doctorFormData.imageFile) {
            // If editing and no new file, but there was an existing image, you might need to
            // indicate to the backend to keep the existing image or handle it based on your backend logic.
            // For now, if imageFile is null, it means no new image is uploaded.
            // Your backend's update method should handle this gracefully (e.g., keep existing image if no new file is sent).
            // No explicit action needed here unless your backend expects a specific flag.
        } else if (modalMode === 'edit' && !doctorFormData.imageUrlPreview && !doctorFormData.imageFile) {
            // If editing and both imageUrlPreview and imageFile are empty, means image was cleared.
            // You might want to send a flag or null image to backend to clear it.
            // For now, sending no image file implies no change or clear if backend interprets it.
            // Your backend's `updateDoctor` method needs to properly handle `MultipartFile imageFile` being null.
        }


        try {
            let response;
            if (modalMode === "add") {
                response = await axios.post(`${ADD_DELETE_API_URL}/add`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                // Add the new doctor to the list
                setDoctors(prev => [...prev, response.data.data]);
            } else { // modalMode === "edit"
                response = await axios.put(`${ADD_DELETE_API_URL}/${doctorFormData.doctorId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                // Update the doctor in the list
                setDoctors(prev => prev.map(doc =>
                    doc.doctorId === response.data.data.doctorId ? response.data.data : doc
                ));
            }

            resetFormData();
            setIsModalOpen(false);
            fetchDoctors(); // Re-fetch all doctors to ensure state consistency
            alert(`Doctor ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);

        } catch (err) {
            console.error(`Error ${modalMode === 'add' ? 'adding' : 'updating'} doctor:`, err.response ? err.response.data : err);
            alert(`Failed to ${modalMode === 'add' ? 'add' : 'update'} doctor: ${err.response?.data?.message || 'Please try again.'}`);
        }
    };

    const deleteDoctor = async (id) => {
        try {
            const response = await axios.delete(`${ADD_DELETE_API_URL}/${id}`);
            if (response.data.success) {
                setDoctors(doctors.filter(doctor => doctor.doctorId !== id));
            } else {
                alert(`Failed to delete doctor: ${response.data.message}`);
            }
        } catch (err) {
            console.error("Error deleting doctor:", err.response ? err.response.data : err);
            alert(`Failed to delete doctor: ${err.response?.data?.message || 'Please try again.'}`);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading doctors...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Doctor Profiles</h1>
                <button
                    onClick={openAddModal} // Use new openAddModal
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <UserPlus size={18} />
                    Add Doctor
                </button>
            </div>

            <div className="space-y-4">
                {doctors.length === 0 ? (
                    <p className="text-center text-gray-500">No doctors found</p>
                ) : (
                    doctors.map((doctor) => (
                        <div
                            key={doctor.doctorId}
                            className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                        >
                            {/* Doctor Photo */}
                            <img
                                src={doctor.image || "https://via.placeholder.com/150/EEEEEE/808080?text=No+Image"}
                                alt={doctor.name}
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            />

                            {/* Doctor Info */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">{doctor.name}</h3>
                                <p className="text-gray-600 mb-0.5">
                                    <span className="font-medium">Specialization:</span> {doctor.specialization}
                                </p>
                                {doctor.qualification && (
                                    <p className="text-gray-600 mb-0.5">
                                        <span className="font-medium">Qualification:</span> {doctor.qualification}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 mt-1 mb-0.5">
                                    <span className="font-medium">Visiting Days:</span>{" "}
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
                                        : "N/A"}
                                </p>
                                <p className="text-sm text-gray-500 mb-0.5">
                                    <span className="font-medium">Email:</span> {doctor.user ? doctor.user.email : "N/A"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Clinic:</span> {doctor.clinic ? doctor.clinic.name : "N/A"} (ID: {doctor.clinic ? doctor.clinic.clinicId : "N/A"})
                                </p>
                            </div>

                            {/* Action Buttons (Edit and Delete) */}
                            <div className="flex space-x-2 ml-4">
                                <button
                                    onClick={() => openEditModal(doctor)} // New Edit button
                                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition"
                                    aria-label={`Edit ${doctor.name}`}
                                >
                                    <Edit3 size={20} />
                                </button>
                                <button
                                    onClick={() => deleteDoctor(doctor.doctorId)}
                                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
                                    aria-label={`Delete ${doctor.name}`}
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-5xl max-w-5xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{modalMode === "add" ? "Add New Doctor" : "Edit Doctor"}</h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    if (doctorFormData.imageUrlPreview) {
                                        URL.revokeObjectURL(doctorFormData.imageUrlPreview);
                                    }
                                    resetFormData(); // Reset all form states when closing
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Doctor Photo */}
                            <div className="p-3 border rounded-md bg-gray-50">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Doctor Photo
                                </label>
                                <div className="flex items-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4 border border-gray-300">
                                        {doctorFormData.imageUrlPreview ? (
                                            <img
                                                src={doctorFormData.imageUrlPreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleDoctorFormImageUpload}
                                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Basic Doctor Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded-md bg-gray-50">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={doctorFormData.name}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Dr. John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Qualification
                                    </label>
                                    <input
                                        type="text"
                                        name="qualification"
                                        value={doctorFormData.qualification}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="MBBS, MD"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Specialization *
                                    </label>
                                    <select
                                        name="specialization"
                                        value={doctorFormData.specialization}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            </div>

                            {/* User Login Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded-md bg-gray-50">
                                <h3 className="col-span-full text-md font-semibold text-gray-800 mb-1">Login Credentials</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Doctor Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="user.email"
                                        value={doctorFormData.user.email}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="doctor@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password {modalMode === 'add' && '*'}
                                    </label>
                                    <input
                                        type="password"
                                        name="user.password"
                                        value={doctorFormData.user.password}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={modalMode === 'add' ? "Set a strong password" : "Leave blank to keep existing"}
                                        required={modalMode === 'add'} // Password only required for add mode
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="user.phone"
                                        value={doctorFormData.user.phone}
                                        onChange={handleDoctorFormInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g., 1234567890"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Clinic Selection */}
                            <div className="p-3 border rounded-md bg-gray-50">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Clinic *
                                </label>
                                <select
                                    name="clinic.clinicId"
                                    value={doctorFormData.clinic.clinicId}
                                    onChange={handleDoctorFormInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                            {/* Visiting Days and Slots */}
                            <div className="p-3 border rounded-md bg-gray-50">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Add Visiting Slots *
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                    <select
                                        name="day"
                                        value={currentAvailabilityInput.day}
                                        onChange={handleAvailabilityInputChange}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Day</option>
                                        {daysOfWeek.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="time"
                                        name="time"
                                        value={currentAvailabilityInput.time}
                                        onChange={handleAvailabilityInputChange}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        name="maxAppointments"
                                        value={currentAvailabilityInput.maxAppointments}
                                        onChange={handleAvailabilityInputChange}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Max Apps"
                                        min="1"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addAvailabilitySlot}
                                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition"
                                >
                                    <PlusCircle size={18} /> Add Slot
                                </button>

                                {doctorFormData.availabilities.length > 0 && (
                                    <div className="mt-4 border-t pt-4">
                                        <h4 className="text-md font-medium text-gray-700 mb-2">Added Slots:</h4>
                                        <ul className="space-y-2">
                                            {doctorFormData.availabilities.map((slot, index) => (
                                                <li key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                                                    <span className="text-sm font-medium">
                                                        {slot.day} ({slot.time ? slot.time.substring(0, 5) : 'N/A'}) - {slot.maxAppointments} apps
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAvailabilitySlot(index)}
                                                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition"
                                                    >
                                                        <MinusCircle size={16} />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {doctorFormData.availabilities.length === 0 && (
                                    <p className="mt-2 text-sm text-red-500">
                                        * At least one visiting slot is required.
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        if (doctorFormData.imageUrlPreview) {
                                            URL.revokeObjectURL(doctorFormData.imageUrlPreview);
                                        }
                                        resetFormData();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                >
                                    {modalMode === "add" ? "Save Doctor" : "Update Doctor"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorProfiles;