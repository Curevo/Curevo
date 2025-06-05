import React, { useState } from "react";
import { UserPlus, Trash2, X } from "lucide-react";

const DoctorProfiles = () => {
    // Sample doctor data
    const [doctors, setDoctors] = useState([
        {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialization: "Cardiologist",
        visitingDays: ["Mon", "Wed", "Fri"],
        photo: "https://randomuser.me/api/portraits/women/65.jpg"
        },
        {
        id: 2,
        name: "Dr. Michael Chen",
        specialization: "Neurologist",
        visitingDays: ["Tue", "Thu", "Sat"],
        photo: "https://randomuser.me/api/portraits/men/32.jpg"
        }
    ]);

    // State for modal and form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        name: "",
        specialization: "",
        visitingDays: [],
        photo: ""
    });

    // Days of the week
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Toggle day selection
    const toggleDay = (day) => {
        setNewDoctor(prev => {
        if (prev.visitingDays.includes(day)) {
            return {
            ...prev,
            visitingDays: prev.visitingDays.filter(d => d !== day)
            };
        } else {
            return {
            ...prev,
            visitingDays: [...prev.visitingDays, day]
            };
        }
        });
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDoctor({
        ...newDoctor,
        [name]: value
        });
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewDoctor({
            ...newDoctor,
            photo: reader.result
            });
        };
        reader.readAsDataURL(file);
        }
    };

    // Add new doctor
    const addDoctor = () => {
        if (!newDoctor.name || !newDoctor.specialization || newDoctor.visitingDays.length === 0) {
        alert("Please fill all required fields");
        return;
        }

        const doctorToAdd = {
        id: doctors.length + 1,
        ...newDoctor,
        photo: newDoctor.photo || "https://randomuser.me/api/portraits/lego/1.jpg"
        };

        setDoctors([...doctors, doctorToAdd]);
        setNewDoctor({
        name: "",
        specialization: "",
        visitingDays: [],
        photo: ""
        });
        setIsModalOpen(false);
    };

    // Delete doctor
    const deleteDoctor = (id) => {
        setDoctors(doctors.filter(doctor => doctor.id !== id));
    };

    return (
        <div className="p-6 w-full mt-10">
        {/* Header with Add Doctor button */}
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Doctor Profiles</h1>
            <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
            <UserPlus size={18} />
            Add Doctor
            </button>
        </div>

        {/* Doctors List */}
        <div className="space-y-4">
            {doctors.map((doctor) => (
            <div
                key={doctor.id}
                className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition"
            >
                {/* Doctor Photo */}
                <img
                src={doctor.photo}
                alt={doctor.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
                />

                {/* Doctor Info */}
                <div className="flex-1">
                <h3 className="font-semibold text-lg">{doctor.name}</h3>
                <p className="text-gray-600">{doctor.specialization}</p>
                <p className="text-sm text-gray-500">
                    Visiting Days: {doctor.visitingDays.join(", ")}
                </p>
                </div>

                {/* Delete Button */}
                <button
                onClick={() => deleteDoctor(doctor.id)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition"
                aria-label={`Delete ${doctor.name}`}
                >
                <Trash2 size={20} />
                </button>
            </div>
            ))}
        </div>

        {/* Add Doctor Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Doctor</h2>
                <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
                </div>

                <div className="space-y-4">
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor Photo
                    </label>
                    <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4">
                        {newDoctor.photo ? (
                        <img
                            src={newDoctor.photo}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                        </div>
                        )}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    </div>
                </div>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                    </label>
                    <input
                    type="text"
                    name="name"
                    value={newDoctor.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dr. John Doe"
                    required
                    />
                </div>

                {/* Specialization */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization *
                    </label>
                    <input
                    type="text"
                    name="specialization"
                    value={newDoctor.specialization}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Cardiologist"
                    required
                    />
                </div>

                {/* Visiting Days */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visiting Days *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                    {daysOfWeek.map(day => (
                        <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition ${
                            newDoctor.visitingDays.includes(day)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        >
                        {day}
                        </button>
                    ))}
                    </div>
                    {newDoctor.visitingDays.length > 0 && (
                    <p className="mt-2 text-sm text-gray-500">
                        Selected: {newDoctor.visitingDays.join(", ")}
                    </p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                    Cancel
                    </button>
                    <button
                    onClick={addDoctor}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                    Save Doctor
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