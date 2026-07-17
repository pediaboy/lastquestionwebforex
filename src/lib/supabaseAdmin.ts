import "server-only";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Server-only client — bypasses RLS. Never import this in a "use client" file.
// Custom fetch with cache: "no-store" prevents Next.js from caching Supabase
// REST responses (Next.js 14 patches global fetch to cache by default).
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: "no-store" }),
  },
});
