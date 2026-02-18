"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { bookmark } from "@/lib/types";
import {
  addBookmark,
  deleteBookmark,
  fetchBookmarks,
} from "@/lib/supabase/queries/bookmarks";
import Image from "next/image";
import Logo from "../public/bookmark.png";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<bookmark[]>([]);
  const [url, setUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);
      setLoading(false);
    });

    //subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/login");
      } else {
        setUser(session?.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  useEffect(() => {
    if (!user) return;

    fetchBookmarks(user.id).then((bookmarks) => {
      setBookmarks(bookmarks);
    });

    //subscribe to realtime
    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id.eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => [payload.new as bookmark, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !title) return;

    addBookmark({ url, title, user_id: user?.id }).then((data) => {
      if (data) {
        setBookmarks((prev) => [data, ...prev]);
      }
    });

    setUrl("");
    setTitle("");
  };

  const handleDelete = async (id: string) => {
    deleteBookmark(id).then(() => {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Image
              src={Logo}
              alt="Smart Bookmarks Logo"
              width={50}
              height={50}
            />
            <h1 className="text-2xl font-bold text-slate-800">My Bookmarks</h1>
          </div>
          <button
            onClick={() => handleLogout()}
            className="text-sm text-slate-500 hover:text-slate-800 font-medium py-2 px-3 rounded-lg hover:bg-slate-100"
          >
            Sign out
          </button>
        </div>

        {/* Add Form */}
        <form
          onSubmit={handleAddBookmark}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="text"
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800"
          >
            + Add Bookmark
          </button>
        </form>

        {/* Bookmark List */}
        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-sm">
              No bookmarks yet. Add your first one above!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-800 truncate">
                    {bookmark.title}
                  </h3>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm truncate block"
                  >
                    {bookmark.url}
                  </a>
                </div>
                <button
                  onClick={() => handleDelete(bookmark.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 shrink-0"
                  title="Delete bookmark"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
