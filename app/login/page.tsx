"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // If user is logged in, redirect to dashboard
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard"); // Redirect to dashboard after login
    }
  };

  if (loading) return null; // Prevent UI flickering

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md p-5">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mb-3"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mb-3"
          />
          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
