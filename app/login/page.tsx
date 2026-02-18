"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Logo from "../../public/bookmark.png";
import Google from "../../public/google-color-svgrepo-com.svg";

export default function Login() {
  const supabase = createClient();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}`,
      },
    });

    if (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-linear-to-br from-slate-100 to-blue-100">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={Logo}
            alt={"Smart Bookmarks Logo"}
            width={72}
            height={72}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-slate-800">Smart Bookmarks</h1>
          <p className="text-sm text-slate-500 mt-1">
            Save and organize your links
          </p>
        </div>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-slate-700 font-medium border border-slate-300 rounded-lg hover:bg-slate-50 hover:shadow-sm"
        >
          <Image src={Google} alt="Google Logo" width={20} height={20} />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
