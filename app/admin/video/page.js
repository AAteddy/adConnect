// app/admin/video/page.js

"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function VideoManagement() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        // Redirect to login if not authenticated
        if (status === "unauthenticated") {
            router.push('/admin/login');
        }
    }, [status]);

    const updateVideoUrl = async () => {
        try {
            await axios.put('/api/settings/video', { url: videoUrl });
            alert('Video URL updated successfully');
        } catch (error) {
            console.error('Error updating video URL:', error);
        }
    };

    return (
        <DashboardLayout>
            <h2 className="text-2xl font-semibold">Video Management</h2>
            <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Enter new video URL"
                className="border px-2 py-1 rounded mt-4"
            />
            <button
                onClick={updateVideoUrl}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-2"
            >
                Update Video URL
            </button>
        </DashboardLayout>
    );
}