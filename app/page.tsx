"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check user authentication status when page loads
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user);
      setLoading(false);
    };

    checkUser();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full bg-background shadow-md">
        <nav className="w-full flex justify-between items-center p-5 max-w-5xl mx-auto">
          <h1 className="text-xl font-semibold">E-Commerce Dashboard</h1>
          <div className="space-x-3">
            {loading ? (
              <Skeleton className="w-20 h-10 inline-block" />
            ) : user ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground pt-20">
        {/* Hero Section */}
        <section className="text-center mt-20">
          <h2 className="text-3xl font-bold">Manage Your Store Effortlessly</h2>
          <p className="text-muted-foreground mt-2">
            A minimalist and powerful e-commerce dashboard.
          </p>

          <div className="mt-6">
            {loading ? (
              <Skeleton className="w-40 h-12 inline-block" />
            ) : (
              <Button size="lg" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
