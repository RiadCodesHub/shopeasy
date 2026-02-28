'use client';

import { useSession, signOut } from "next-auth/react";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">

        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 py-12 flex items-center gap-6">

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white overflow-hidden flex items-center justify-center">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-gray-500" />
              )}
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold">
                {session?.user?.name}
              </h1>

              <p className="text-blue-100">
                {session?.user?.email}
              </p>

              <p className="text-sm text-blue-200 mt-1">
                Role: {session?.user?.role}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>

          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <nav className="space-y-2">

                  <Link
                    href="/profile"
                    className="block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/profile/orders"
                    className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Orders
                  </Link>

                  <Link
                    href="/profile/addresses"
                    className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Addresses
                  </Link>

                  <Link
                    href="/profile/settings"
                    className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
                  >
                    Settings
                  </Link>

                </nav>
              </div>
            </div>

            {/* Main */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6">

                <h2 className="text-xl font-bold mb-6">
                  Profile Information
                </h2>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Full Name
                    </label>
                    <p className="font-medium">
                      {session?.user?.name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Email
                    </label>
                    <p className="font-medium">
                      {session?.user?.email}
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}