"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user and check role
  useEffect(() => {
    const checkAdmin = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        router.push("/login");
        return;
      }

      setUser(data?.user);

      // Fetch user role from Supabase (assuming roles are stored in 'profiles' table)
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data?.user?.id)
        .single();

      if (profile?.role === "admin") {
        setIsAdmin(true);
      } else {
        router.push("/dashboard"); // Redirect non-admin users
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return <Skeleton className="w-full h-screen" />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      {/* Sticky Navbar - Centered */}
      <nav className="fixed top-0 left-0 w-full bg-background shadow-md flex justify-center items-center p-5">
        <div className="flex justify-between items-center w-full max-w-5xl">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
          <div className="space-x-3">
            <Link href="/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mt-28 text-center">
        <h2 className="text-3xl font-bold">Welcome, Admin</h2>
        <p className="text-muted-foreground mt-2">
          Manage orders, sales, and store data here.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          <div className="p-6 bg-card rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Total Sales</h3>
            <p className="text-2xl font-bold">$12,345</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Orders</h3>
            <p className="text-2xl font-bold">245</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold">Customers</h3>
            <p className="text-2xl font-bold">1,560</p>
          </div>
        </div>
      </div>
    </main>
  );
}
