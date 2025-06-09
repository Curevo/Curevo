import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: 'Hello! I\'m lucy, How can I help you today?', sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);

    // Scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message to backend
    const sendMessage = async () => {
        if (!input.trim()) return;

        // Add user message to UI
        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
        const response = await axios.post('/api/chat', {
            message: input,
        });
        const botMessage = { text: response.data.reply, sender: 'bot' };
        setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prev) => [
            ...prev,
            { text: 'Sorry, I couldn’t process that. Please try again.', sender: 'bot' },
        ]);
        } finally {
        setIsTyping(false);
        }
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
        }
    };

    return (
            <div className="flex flex-col h-[70vh] w-lg max-w-sm mx-auto bg-gray-200 rounded-lg shadow-lg">
                {/* Chat Header */}
                <div className="bg-blue-500 text-white p-4 rounded-t-lg">
                    <h1 className="text-lg font-semibold text-center">Healthcare Assistant</h1>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                            msg.sender === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
                        }`}
                        >
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs text-gray-400 block mt-1">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        </div>
                    </div>
                    ))}
                    {isTyping && (
                    <div className="flex justify-start mb-3">
                        <div className="bg-gray-200 text-gray-600 p-3 rounded-lg text-sm">
                        <span className="animate-pulse">Typing...</span>
                        </div>
                    </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t rounded-b-lg">
                    <div className="flex items-center gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                        aria-label="Chat input"
                        rows="2"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!input.trim() || isTyping}
                        className="bg-blue-600 text-white p-2 rounded-lg disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
                        aria-label="Send message"
                    >
                        <svg
                        className="w-5 h-5"
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