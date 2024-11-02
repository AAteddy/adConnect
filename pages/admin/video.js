// pages/admin/video.js
import React, { useState } from 'react';
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

export default function VideoManagement() {
    const [videoUrl, setVideoUrl] = useState('');

    const updateVideoUrl = async () => {
        try {
            await axios.put('/api/settings/video', { url: videoUrl });
            alert('Video URL updated successfully');
        } catch (error) {
            console.error('Error updating video URL:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Opt-In Video Management</h1>
            <div className="mb-4">
                <label className="block mb-2">Video URL:</label>
                <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="border px-2 py-1 w-full"
                />
            </div>
            <button onClick={updateVideoUrl} className="bg-blue-500 text-white px-4 py-2">
                Update Video URL
            </button>
            <Link href="/admin" className="text-blue-500 underline mt-4 block">Back to Dashboard</Link>
        </div>
    );
}