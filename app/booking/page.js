"use client";

import React, { useState } from "react";
import { InlineWidget } from "react-calendly";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function BookingPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [showCalendly, setShowCalendly] = useState(false);
    const [formError, setFormError] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone) {
            setFormError("Please fill in all fields.");
            return;
        }

        try {
            await axios.post("/api/leads/", formData);
            setFormError("");
            setShowCalendly(true); // Show Calendly after form submission
        } catch (error) {
            console.error("Error submitting lead info:", error);
            setFormError("Failed to submit. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Book a Consultation</h1>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your Email"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-gray-700 font-medium">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 mt-1 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your Phone Number"
                        />
                    </div>
                    {formError && (
                        <p className="text-red-500 text-sm text-center mt-2">{formError}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Submit Information
                    </button>
                </form>
            </div>

            {showCalendly && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-2xl">
                        <button
                            onClick={() => setShowCalendly(false)}
                            className="bg-red-500 text-white px-3 py-1 rounded-md absolute top-4 right-4 hover:bg-red-600"
                        >
                            Close
                        </button>
                        <h2 className="text-xl font-bold text-center mb-4 text-blue-700">Select a Booking Time</h2>
                        <InlineWidget
                            url="https://calendly.com/tedsaasfaha"
                            styles={{ height: "600px" }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}