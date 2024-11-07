

// components/DashboardLayout.js

'use client';


import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import SessionWrapper from "../../app/providers/SessionWrapper"; // Import the wrapper here

export default function DashboardLayout({ children }) {
  return (
    <SessionWrapper> {/* Wrap DashboardLayout in SessionWrapper */}
      <DashboardContent>{children}</DashboardContent>
    </SessionWrapper>
  );
}

function DashboardContent({ children }) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-500 text-white min-h-screen flex flex-col">
        <div className="p-4 font-bold text-xl">Admin Dashboard</div>
        <nav className="flex-1">
          <ul className="space-y-2 p-4">
            <li>
              <Link href="/admin" className="block p-2 hover:bg-blue-800 rounded ">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/lead" className="block p-2 hover:bg-blue-800 rounded ">
                Leads
              </Link>
            </li>
            <li>
              <Link href="/admin/video" className="block p-2 hover:bg-blue-800 rounded ">
                Videos
              </Link>
            </li>
            <li>
              <Link href="/admin/settings" className="block p-2 hover:bg-blue-800 rounded ">
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {/* Profile Picture */}
                <div className="flex items-center space-x-2">
                  <img
                    src={session.user.image || 'dashboard/default-profile.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="font-semibold text-gray-700">
                    {session.user.name || 'Admin'}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/admin/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800">
                Login
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 overflow-y-auto flex-1">{children}</main>
      </div>
    </div>
  );
}