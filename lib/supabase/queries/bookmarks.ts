import { bookmark } from "@/lib/types";
import { createClient } from "../client";

const supabase = createClient();

export async function fetchBookmarks(userId: string) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function addBookmark(bookmark: Partial<bookmark>) {
  const { data, error } = await supabase
    .from("bookmarks")
    .insert([bookmark])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteBookmark(id: string) {
  await supabase.from("bookmarks").delete().eq("id", id);
}
