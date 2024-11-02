// pages/admin/index.js

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

export default function AdminDashboard() {
    const [leadCount, setLeadCount] = useState(0);

    useEffect(() => {
        // Fetch lead count (or other metrics) from your backend
        const fetchMetrics = async () => {
            try {
                const response = await axios.get('/api/leads');
                setLeadCount(response.data.length);
            } catch (error) {
                console.error('Error fetching lead metrics:', error);
            }
        };
        fetchMetrics();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

            <div>
                <h1>Welcome to the Admin Dashboard</h1>
                <button onClick={() => signOut({ callbackUrl: '/admin/login' })}>Logout</button>
            </div>

            <div className="mb-8">
                <p>Total Leads: {leadCount}</p>
                {/* Additional metrics or summaries could go here */}
            </div>
            <div className="space-y-4">
            <Link href="/admin/leads" className="text-blue-500 underline">Manage Leads</Link>
            <Link href="/admin/video" className="text-blue-500 underline">Manage Opt-In Video</Link>
            </div>
        </div>
    );
}

  

  
  
  
  