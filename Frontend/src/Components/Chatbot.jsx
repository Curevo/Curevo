import React, { useState, useEffect, useRef } from 'react';
import { useAxiosInstance } from '@/Config/axiosConfig.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Chatbot = () => {
    const axios = useAxiosInstance();
    const [messages, setMessages] = useState([
        { text: 'Hello! I\'m Lucy, your Healthcare Assistant. How can I help you today?', sender: 'bot' },
        { text: 'You can ask me general health questions, or I can help you find a doctor.', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showInitialOptions, setShowInitialOptions] = useState(true);
    // Keep 'initial_choice', 'general_health', 'findDoctorByName', 'findDoctorBySpecialty'
    const [activeConversationalMode, setActiveConversationalMode] = useState('initial_choice');
    // Revert specializations state - needed for the manual "Find a Doctor" flow
    const [specializations, setSpecializations] = useState([]);
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Keep fetchSpecializations function - needed for the manual "Find a Doctor" flow
    const fetchSpecializations = async () => {
        try {
            const response = await axios.get('/api/doctors/specializations');
            if (response.data.success && Array.isArray(response.data.data)) {
                setSpecializations(response.data.data);
            } else {
                console.error("Failed to fetch specializations:", response.data.message || "No data received.");
                setMessages((prev) => [...prev, { text: 'I apologize, but I could not retrieve the list of specializations at this moment.', sender: 'bot' }]);
            }
        } catch (error) {
            console.error('Error fetching specializations:', error);
            setMessages((prev) => [...prev, { text: 'I encountered an error while fetching specializations. Please try again later.', sender: 'bot' }]);
        }
    };

    // Send message to backend
    const sendMessage = async (messageToSend = input) => {
        if (!messageToSend.trim()) return;

        setShowInitialOptions(false);

        const userMessage = { text: messageToSend, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setSpecializations([]); // Clear specializations when a new message is sent (even if they were shown)

        try {
            let payload = { message: messageToSend };

            // Determine intent based on current conversational mode
            if (activeConversationalMode === 'findDoctorBySpecialty') {
                // If user types a specialization from the list, it's a specialty query
                if (specializations.map(s => s.toLowerCase()).includes(messageToSend.toLowerCase())) {
                    payload.intent = 'find_doctor_by_specialty';
                    payload.specialty = messageToSend.toUpperCase();
                } else { // If user types something else, assume it's a doctor's name
                    payload.intent = 'find_doctor_by_name';
                    payload.doctor_name = messageToSend;
                }
            } else if (activeConversationalMode === 'findDoctorByName') {
                payload.intent = 'find_doctor_by_name';
                payload.doctor_name = messageToSend; // Assume direct doctor name input
            } else if (activeConversationalMode === 'general_health') {
                payload.intent = 'general_health_query'; // Explicitly set intent for backend
            }
                // Special handling for the initial 'Find a doctor' quick action
            // Revert to original logic: This sends 'initial_doctor_query' to backend
            else if (messageToSend.toLowerCase() === "find a doctor" && activeConversationalMode === 'initial_choice') {
                payload.intent = 'initial_doctor_query';
                payload.message = "Find a doctor"; // Ensure the message is consistent
            }
            // For 'initial_choice' mode or unrecognized inputs, send as general message
            else {
                payload.intent = 'general_query'; // Default intent for backend to analyze
            }


            const response = await axios.post('/api/chat', payload);
            const apiResponse = response.data;
            const botReplyData = apiResponse.data;

            if (!botReplyData || typeof botReplyData !== 'object') {
                setMessages((prev) => [...prev, { text: apiResponse.message || 'Received an unexpected response format from the bot.', sender: 'bot', type: 'text' }]);
                setActiveConversationalMode('initial_choice'); // Reset mode if unexpected response
                return;
            }

            // Create an array to hold all messages to be added to the state
            let newBotMessages = [];

            if (botReplyData.type === 'text') {
                newBotMessages.push({ text: botReplyData.message, sender: 'bot', type: 'text' });
                if (activeConversationalMode !== 'general_health' && activeConversationalMode !== 'findDoctorByName' && activeConversationalMode !== 'findDoctorBySpecialty') {
                    setActiveConversationalMode('initial_choice');
                }
            } else if (botReplyData.type === 'doctors_list') {
                if (Array.isArray(botReplyData.doctors)) {
                    // Split the incoming message into two parts: health advice and doctor intro
                    const messageParts = botReplyData.message.split('\n\n'); // Split by double newline
                    const healthAdvice = messageParts[0];
                    const doctorIntro = messageParts[1]; // This should be "Based on your symptoms, here are some X specialists..."

                    // Add the health advice as the first message (type 'text')
                    if (healthAdvice) {
                        newBotMessages.push({ text: healthAdvice, sender: 'bot', type: 'text' });
                    }

                    // Add the doctors list as the second message (type 'doctors_list')
                    newBotMessages.push({
                        text: doctorIntro || 'Here are some doctors you might consider:', // Fallback text
                        sender: 'bot',
                        type: 'doctors_list',
                        doctors: botReplyData.doctors
                    });
                } else {
                    console.warn("doctors_list type received but 'doctors' is not an array:", botReplyData);
                    newBotMessages.push({ text: botReplyData.message || 'Could not retrieve doctor list due to an unexpected format.', sender: 'bot', type: 'text' });
                }
                setActiveConversationalMode('initial_choice'); // Reset mode after showing doctors
            } else if (botReplyData.type === 'doctor_details') {
                if (botReplyData.doctor && typeof botReplyData.doctor === 'object') {
                    newBotMessages.push({ text: botReplyData.message, sender: 'bot', type: 'doctor_details', doctor: botReplyData.doctor });
                } else {
                    console.warn("doctor_details type received but 'doctor' is not an object:", botReplyData);
                    newBotMessages.push({ text: botReplyData.message || 'Could not retrieve doctor details due to an unexpected format.', sender: 'bot', type: 'text' });
                }
                setActiveConversationalMode('initial_choice'); // Reset mode after showing doctor details
            } else if (botReplyData.type === 'prompt_specialty_selection') {
                newBotMessages.push({ text: botReplyData.message, sender: 'bot', type: 'text' });
                fetchSpecializations(); // Fetch specializations
                setActiveConversationalMode('findDoctorBySpecialty'); // Set mode for specialty input
            } else if (botReplyData.type === 'prompt_doctor_name') {
                newBotMessages.push({ text: botReplyData.message, sender: 'bot', type: 'text' });
                setActiveConversationalMode('findDoctorByName'); // Set mode for doctor name input
            } else if (botReplyData.type === 'error') {
                newBotMessages.push({ text: botReplyData.message, sender: 'bot', type: 'text' });
                setActiveConversationalMode('initial_choice'); // Reset mode on error
            }
            else {
                newBotMessages.push({ text: botReplyData.message || apiResponse.message || 'I received an unexpected response.', sender: 'bot', type: 'text' });
                setActiveConversationalMode('initial_choice'); // Default reset
            }

            setMessages((prev) => [...prev, ...newBotMessages]); // Add all new messages to state

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Sorry, I couldn’t process that. Please try again.';
            setMessages((prev) => [
                ...prev,
                { text: errorMessage, sender: 'bot' },
            ]);
            setActiveConversationalMode('initial_choice'); // Reset mode on API error
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleQuickAction = (action) => {
        setShowInitialOptions(false);
        setInput(''); // Clear input

        switch (action) {
            case 'findDoctor':
                sendMessage("Find a doctor");
                // The backend response will set the mode to 'findDoctorBySpecialty' or 'prompt_doctor_name'
                // No need to explicitly set it here to 'initial_doctor_query'
                break;
            case 'generalHealth':
                setMessages((prev) => [
                    ...prev,
                    { text: 'Okay, tell me about your symptoms or health concern.', sender: 'bot' }
                ]);
                setActiveConversationalMode('general_health');
                setSpecializations([]);
                break;
            default:
                break;
        }
    };

    const handleSpecializationClick = (specialty) => {
        sendMessage(specialty); // Uses the activeConversationalMode to form the payload
    };

    // Function to handle doctor card click
    const handleDoctorCardClick = (doctorId) => {
        if (doctorId) {
            navigate(`/doctor/${doctorId}`);
        }
    };

    return (
        <div className="flex flex-col h-[70vh] w-full max-w-sm mx-auto bg-gray-200 rounded-lg shadow-lg border border-gray-300">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg shadow-md">
                <h1 className="text-lg font-semibold text-center">Healthcare Assistant</h1>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[75%] p-3 rounded-xl shadow-md ${
                                msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none'
                            }`}
                        >
                            {/* Render different types of messages */}
                            {msg.type === 'doctors_list' && msg.doctors ? (
                                <div className="text-sm">
                                    {/* msg.text now contains only the doctor intro part */}
                                    <p className="font-semibold mb-2">{msg.text}</p>
                                    <div className="space-y-3"> {/* Increased space */}
                                        {msg.doctors.map((doctor, docIndex) => (
                                            <div
                                                key={docIndex}
                                                className="bg-gray-50 p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                                                onClick={() => handleDoctorCardClick(doctor.doctorId)}
                                            >
                                                <p className="font-semibold text-base">Dr. {doctor.name}</p>
                                                <p className="text-sm text-gray-700 font-medium">Specialty: {doctor.specialization ? doctor.specialization.replace(/_/g, ' ').toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'N/A'}</p>
                                                <p className="text-sm text-gray-600">Qualification: {doctor.qualification || 'N/A'}</p>
                                                {/* Removed Location as requested */}
                                                {doctor.user?.phone && <p className="text-sm text-gray-700 font-medium">Contact: {doctor.user.phone}</p>}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-3 text-xs text-gray-500">
                                        (Click on a doctor for more details.)
                                    </p>
                                </div>
                            ) : msg.type === 'doctor_details' && msg.doctor ? (
                                <div className="text-sm">
                                    <p className="font-semibold mb-2">{msg.message}</p>
                                    <div
                                        className="bg-gray-50 p-3 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
                                        onClick={() => handleDoctorCardClick(msg.doctor.doctorId)}
                                    >
                                        <p className="font-semibold text-base">Dr. {msg.doctor.name}</p>
                                        <p className="text-sm text-gray-700 font-medium">Specialty: {msg.doctor.specialization ? msg.doctor.specialization.replace(/_/g, ' ').toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'N/A'}</p>
                                        {/* Removed Location as requested */}
                                        {msg.doctor.user?.phone && <p className="text-sm text-gray-700 font-medium">Contact: {msg.doctor.user.phone}</p>}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm">{msg.text}</p>
                            )}

                            <span className="text-xs text-gray-400 block mt-1 text-right">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-gray-200 text-gray-600 p-3 rounded-xl rounded-bl-none text-sm shadow-md">
                            <span className="animate-pulse">Lucy is typing...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />

                {/* Initial Quick Action Buttons */}
                {showInitialOptions && !isTyping && messages.length <= 2 && (
                    <div className="mt-4 flex flex-col space-y-3">
                        <button
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200 p-3 rounded-xl text-base font-medium transition-colors shadow-sm"
                            onClick={() => handleQuickAction('findDoctor')}
                        >
                            Find a Doctor
                        </button>
                        <button
                            className="bg-green-100 text-green-800 hover:bg-green-200 p-3 rounded-xl text-base font-medium transition-colors shadow-sm"
                            onClick={() => handleQuickAction('generalHealth')}
                        >
                            Ask a General Health Question
                        </button>
                    </div>
                )}

                {/* Specialization Buttons (Dropdown alternative for simplicity) - Reverted to original functionality */}
                {activeConversationalMode === 'findDoctorBySpecialty' && specializations.length > 0 && !isTyping && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg shadow-md border border-gray-200">
                        <p className="text-sm font-semibold mb-3 text-gray-700">Choose a specialization:</p>
                        <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2"> {/* Added pr-2 for scrollbar */}
                            {specializations.map((specialty) => (
                                <button
                                    key={specialty}
                                    className="bg-white border border-blue-300 text-blue-700 text-sm p-2 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors"
                                    onClick={() => handleSpecializationClick(specialty)}
                                >
                                    {specialty.replace(/_/g, ' ').toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg shadow-inner">
                <div className="flex items-center gap-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
                        placeholder={
                            activeConversationalMode === 'findDoctorBySpecialty'
                                ? "Type specialization or doctor's name..." // Updated placeholder
                                : (activeConversationalMode === 'findDoctorByName'
                                        ? "e.g., 'Dr. Smith'..."
                                        : (activeConversationalMode === 'general_health' ? "Tell us your symptoms or health concern..." : "Type your message...")
                                )
                        }
                        aria-label="Chat input"
                        rows="2"
                        // Removed disabled condition based on specializations.length
                        // It should always be enabled to allow typing
                    />
                    <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isTyping}
                        className="bg-blue-700 text-white p-3 rounded-lg disabled:bg-gray-400 hover:bg-blue-800 transition-colors shadow-md"
                        aria-label="Send message"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;