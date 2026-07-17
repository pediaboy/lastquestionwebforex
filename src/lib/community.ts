import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type CommunityPost = {
  id: string;
  user_id: string;
  author_name: string;
  message: string;
  created_at: string;
};

const KEY = "forex_community";
const MAX_POSTS = 300;

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  const { data } = await supabaseAdmin.from("settings").select("value").eq("key", KEY).maybeSingle();
  const value = (data?.value as CommunityPost[]) || [];
  return Array.isArray(value) ? value : [];
}

export async function addCommunityPost(post: CommunityPost) {
  const posts = await getCommunityPosts();
  posts.push(post);
  const trimmed = posts.slice(-MAX_POSTS);
  await supabaseAdmin.from("settings").upsert({ key: KEY, value: trimmed }, { onConflict: "key" });
}
