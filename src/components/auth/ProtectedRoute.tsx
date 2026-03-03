'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export default function ProtectedRoute({
    children,
    adminOnly = false
} : ProtectedRouteProps ) {
    const { data: session, status} = useSession();
    const router = useRouter();

    useEffect(() => {
        if(status === 'loading') return;
    
        if(!session) {
            router.push('/auth/login');
            return;
        }

        if(adminOnly && session.user?.role !== 'admin') {
            router.push('/unauthorized');
            return
        }
    },  [session, status, router, adminOnly]);

    if(status === 'loading') {
        return (
                  <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
        );
    }

    if(!session) {
            return null;
        }
    if(!adminOnly && session.user?.role !== 'admin') return null

    return <>{children}</>

    }  