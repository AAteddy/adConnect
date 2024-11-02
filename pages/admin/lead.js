// pages/admin/leads.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { getSession } from 'next-auth/react';

export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
      return {
        redirect: {
          destination: '/admin/login',
          permanent: false,
        },
      };
    }
    return { props: { session } };
  }

export default function LeadManagement() {
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const response = await axios.get('/api/leads');
                setLeads(response.data);
            } catch (error) {
                console.error('Error fetching leads:', error);
            }
        };
        fetchLeads();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Lead Management</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Name</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Phone</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead._id}>
                            <td className="border px-4 py-2">{lead.name}</td>
                            <td className="border px-4 py-2">{lead.email}</td>
                            <td className="border px-4 py-2">{lead.phone}</td>
                            <td className="border px-4 py-2">{lead.status}</td>
                            <td className="border px-4 py-2">
                                <button className="bg-blue-500 text-white px-2 py-1 mr-2">Edit</button>
                                <button className="bg-red-500 text-white px-2 py-1">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link href="/admin" className="text-blue-500 underline mt-4 block">Back to Dashboard</Link>
        </div>
    );
}