

// app/admin/page.js

"use client";


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [leadCount, setLeadCount] = useState(0);

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === "unauthenticated") {
            router.push('/admin/login');
        }

        // Fetch lead count if authenticated
        if (status === "authenticated") {
            const fetchMetrics = async () => {
                try {
                    const response = await axios.get('/api/leads');
                    setLeadCount(response.data.length);
                } catch (error) {
                    console.error('Error fetching lead metrics:', error);
                }
            };
            fetchMetrics();
        }
    }, [status]);

    return (

            <DashboardLayout>
                <h2 className="text-2xl font-semibold">Welcome to the Admin Dashboard</h2>
                <p className="mt-4">Overview of recent activity...</p>
            </DashboardLayout>

    );
}

  

  
  
  
  