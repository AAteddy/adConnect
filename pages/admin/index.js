// pages/admin/index.js

import { getSession } from 'next-auth/react';

export default function AdminDashboard() {
  return <h1>Welcome to the Admin Dashboard</h1>;
}

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




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Link from 'next/link';

// export default function AdminDashboard() {
//     const [leadCount, setLeadCount] = useState(0);

//     useEffect(() => {
//         // Fetch lead count (or other metrics) from your backend
//         const fetchMetrics = async () => {
//             try {
//                 const response = await axios.get('/api/leads');
//                 setLeadCount(response.data.length);
//             } catch (error) {
//                 console.error('Error fetching lead metrics:', error);
//             }
//         };
//         fetchMetrics();
//     }, []);

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
//             <div className="mb-8">
//                 <p>Total Leads: {leadCount}</p>
//                 {/* Additional metrics or summaries could go here */}
//             </div>
//             <div className="space-y-4">
//             <Link href="/admin/leads" className="text-blue-500 underline">Manage Leads</Link>
//             <Link href="/admin/video" className="text-blue-500 underline">Manage Opt-In Video</Link>
//             </div>
//         </div>
//     );
// }