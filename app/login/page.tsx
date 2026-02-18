"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "../../public/bookmark.png";

export default function Login() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-blue-200">
      <div className="w-full max-w-sm p-6">
        <Image
          src={Logo}
          alt={"Smart Bookmarks Logo"}
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-center mb-6">Smart Bookmarks</h1>
        <button
          onClick={handleLogin}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
