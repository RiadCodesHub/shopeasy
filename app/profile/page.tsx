'use client';

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { User, LogOut, Package, MapPin, Settings, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (!session || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="card text-center max-w-md p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-error/10 flex items-center justify-center">
            <User className="h-12 w-12 text-error" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">
            User Not Found
          </h2>
          <p className="text-[var(--foreground-secondary)] mb-6">
            Unable to load user profile. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" />, active: true },
    { href: "/orders", label: "Orders", icon: <Package className="h-5 w-5" />, active: false },
    { href: "/profile/addresses", label: "Addresses", icon: <MapPin className="h-5 w-5" />, active: false },
    { href: "/profile/settings", label: "Settings", icon: <Settings className="h-5 w-5" />, active: false },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:justify-between">
              {/* User Info */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center ring-4 ring-white/20">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={96}
                        height={96}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <User className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full ring-2 ring-white"></div>
                </div>

                {/* User Details */}
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {user?.name || session?.user?.name}
                  </h1>
                  <p className="text-white/80">
                    {user?.email || session?.user?.email}
                  </p>
                  <p className="text-sm text-white/60 mt-1">
                    Role: <span className="font-medium text-white/80">{user?.role || 'User'}</span>
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all font-medium text-white border border-white/20"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="card p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                        item.active
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-[var(--foreground-secondary)] hover:bg-[var(--background-tertiary)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {!item.active && <ChevronRight className="h-4 w-4 opacity-50" />}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Account Stats */}
              <div className="card mt-6 p-4">
                <h3 className="font-semibold text-[var(--foreground)] mb-3">Account Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-secondary)]">Member Since</span>
                    <span className="text-[var(--foreground)] font-medium">
                      {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-secondary)]">Orders</span>
                    <span className="text-[var(--foreground)] font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-secondary)]">Wishlist Items</span>
                    <span className="text-[var(--foreground)] font-medium">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Profile Information */}
            <div className="md:col-span-2">
              <div className="card p-6">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">
                  Profile Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                      Full Name
                    </label>
                    <p className="text-[var(--foreground)] font-medium p-3 bg-[var(--background-tertiary)] rounded-lg">
                      {session?.user?.name || user?.name || 'Not provided'}
                    </p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                      Email Address
                    </label>
                    <p className="text-[var(--foreground)] font-medium p-3 bg-[var(--background-tertiary)] rounded-lg">
                      {session?.user?.email || user?.email || 'Not provided'}
                    </p>
                  </div>

                  {/* Phone (if available) */}
                  {user?.phone && (
                    <div>
                      <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                        Phone Number
                      </label>
                      <p className="text-[var(--foreground)] font-medium p-3 bg-[var(--background-tertiary)] rounded-lg">
                        {user.phone}
                      </p>
                    </div>
                  )}

                  {/* Role */}
                  <div>
                    <label className="block text-sm text-[var(--foreground-secondary)] mb-2">
                      Account Type
                    </label>
                    <p className="text-[var(--foreground)] font-medium p-3 bg-[var(--background-tertiary)] rounded-lg capitalize">
                      {user?.role || 'Customer'}
                    </p>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <div className="mt-8 pt-6 border-t border-[var(--border)]">
                  <button className="btn-secondary flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Recent Activity (Optional) */}
              <div className="card mt-6 p-6">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
                  Recent Activity
                </h2>
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center">
                    <Package className="h-8 w-8 text-[var(--foreground-tertiary)]" />
                  </div>
                  <p className="text-[var(--foreground-secondary)]">
                    No recent orders yet
                  </p>
                  <Link href="/products" className="btn-primary inline-flex items-center gap-2 mt-4">
                    Start Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}