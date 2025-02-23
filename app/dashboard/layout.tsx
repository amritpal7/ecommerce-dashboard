"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login");
      else setUser(data.session.user);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b shadow-sm flex justify-between items-center">
        <h1 className="text-xl font-bold">E-Commerce Dashboard</h1>
        {user && <Button onClick={handleLogout}>Logout</Button>}
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
