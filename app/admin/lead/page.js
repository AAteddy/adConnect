

// app/admin/lead/page.js

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';


export default function LeadManagement() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // State variables
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [error, setError] = useState(null);

    // Search, filter, and pagination state
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [leadsPerPage] = useState(10); // Adjust this number for more or fewer leads per page
    const [totalPages, setTotalPages] = useState(1);

    // Load leads based on search, filter, and pagination
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push('/admin/login');
        } else if (status === "authenticated") {
            fetchLeads();
        }
    }, [status, searchTerm, statusFilter, currentPage]);

    // Fetch leads with filters, search, and pagination settings
    const fetchLeads = async () => {
        try {
            const response = await axios.get("/api/leads", {
                params: {
                    search: searchTerm,
                    filter: statusFilter !== "All" ? statusFilter : null,
                    page: currentPage,
                    limit: leadsPerPage,
                },
            });
            setLeads(response.data.leads);
            setTotalPages(response.data.totalPages); // Add totalPages to state
            setError(null); // Reset error on successful fetch
        } catch (error) {
            console.error("Error fetching leads:", error);
            setError("Failed to fetch leads.");
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to page 1 after search
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset to page 1 after filter change
    };

    // Handle pagination navigation
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handlers for Edit, Update Status, and Delete actions
    const handleEditClick = (lead) => {
        setSelectedLead(lead);
        setIsEditing(true);
    };

    const handleUpdateStatusClick = (lead) => {
        setSelectedLead(lead);
        setIsUpdatingStatus(true);
    };

    const handleDelete = async (leadId) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) return;
        try {
            await axios.delete(`/api/leads/${leadId}`);
            setLeads(leads.filter(lead => lead._id !== leadId));
        } catch (error) {
            console.error('Error deleting lead:', error);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`/api/leads/${selectedLead._id}`, selectedLead);
            setLeads(leads.map(lead => (lead._id === selectedLead._id ? response.data : lead)));
            setIsEditing(false);
            setSelectedLead(null);
        } catch (error) {
            console.error('Error updating lead:', error);
        }
    };

    const handleStatusUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/api/leads/${selectedLead._id}/status`, { status: selectedLead.status });
            setLeads(leads.map(lead => (lead._id === selectedLead._id ? response.data : lead)));
            setIsUpdatingStatus(false);
            setSelectedLead(null);
        } catch (error) {
            console.error('Error updating lead status:', error);
        }
    };

    return (

        <DashboardLayout>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Leads</h2>

            {/* Search and Filter Controls */}
            <div className="flex space-x-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="p-2 border rounded w-1/3 text-gray-800"
                />
                <select
                    value={statusFilter}
                    onChange={handleFilterChange}
                    className="p-2 border rounded w-1/4 text-gray-800"
                >
                    <option value="All">All </option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                </select>
            </div>

            {/* Error Handling */}
            {error && <div className="text-red-500">{error}</div>}

            {/* Leads Table */}
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Email</th>
                        <th className="py-2 px-4 text-left">Phone</th>
                        <th className="py-2 px-4 text-left">Status</th>
                        <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead._id} className="border-b">
                            <td className="py-2 px-4 text-gray-800">{lead.name}</td>
                            <td className="py-2 px-4 text-gray-800">{lead.email}</td>
                            <td className="py-2 px-4 text-gray-800">{lead.phone}</td>
                            <td className="py-2 px-4 text-gray-800">{lead.status}</td>
                            <td className="py-2 px-4 flex space-x-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => handleEditClick(lead)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                    onClick={() => handleUpdateStatusClick(lead)}
                                >
                                    Update Status
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(lead._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Edit Lead Modal */}
            {isEditing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <form className="bg-white p-6 rounded-lg" onSubmit={handleEditSubmit}>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Lead Info</h3>
                        <label className="block mb-2 text-gray-800">
                            Name:
                            <input
                                type="text"
                                value={selectedLead.name}
                                onChange={(e) => setSelectedLead({ ...selectedLead, name: e.target.value })}
                                className="w-full mt-1 p-2 border rounded text-gray-800"
                            />
                        </label>
                        <label className="block mb-2 text-gray-800">
                            Email:
                            <input
                                type="email"
                                value={selectedLead.email}
                                onChange={(e) => setSelectedLead({ ...selectedLead, email: e.target.value })}
                                className="w-full mt-1 p-2 border rounded text-gray-800"
                            />
                        </label>
                        <label className="block mb-2 text-gray-800">
                            Phone:
                            <input
                                type="tel"
                                value={selectedLead.phone}
                                onChange={(e) => setSelectedLead({ ...selectedLead, phone: e.target.value })}
                                className="w-full mt-1 p-2 border rounded text-gray-800"
                            />
                        </label>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Update Status Modal */}
            {isUpdatingStatus && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <form className="bg-white p-6 rounded-lg" onSubmit={handleStatusUpdateSubmit}>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Update Lead Status</h3>
                        <label className="block mb-2 text-gray-800">
                            Status:
                            <select
                                value={selectedLead.status}
                                onChange={(e) => setSelectedLead({ ...selectedLead, status: e.target.value })}
                                className="w-full mt-1 p-2 border rounded text-gray-800"
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Converted">Converted</option>
                            </select>
                        </label>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                                onClick={() => setIsUpdatingStatus(false)}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </DashboardLayout>

    );
}

//