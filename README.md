# Smart Bookmark App

A simple, real-time bookmark manager built with Next.js (App Router), Supabase (Auth, Database, Realtime), and Tailwind CSS. Users can sign in with Google, add/delete bookmarks, and see updates instantly across tabs.

## Features

- Google OAuth sign-in (no email/password)
- Add bookmarks (URL + title)
- Bookmarks are private to each user
- Real-time updates (no refresh needed)
- Delete your own bookmarks
- Deployed on Vercel

## Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS

## Getting Started

1. Clone the repo
2. Set up Supabase locally (or use a hosted project)
3. Add your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Run migrations:
   ```bash
   pnpx supabase db reset
   ```
5. Start the dev server:
   ```bash
   pnpm dev
   ```

## Problems I ran into (and how I solved them)

### 1. Google OAuth Redirects to Localhost in Production

**Problem:**
After deploying to Vercel, logging in with Google would redirect back to `localhost:3000` instead of the live site.

**Solution:**

- The root cause was the **Site URL** setting in the Supabase dashboard. It was still set to `http://localhost:3000` from local development.
- To fix it, I updated the **Site URL** in Supabase (Authentication → URL Configuration) to our Vercel URL (e.g., `https://smart-bookmarks-xyz.vercel.app`).
- I also made sure the Google Cloud Console OAuth settings had the correct production URLs in both **Authorized JavaScript origins** and **Authorized redirect URIs**.
- After this, Google sign-in redirected to the correct live site.

### 2. Invalid API Key Error on Vercel

**Problem:**
After fixing the redirect, I got an "Invalid API key" error when logging in on the live site.

**Solution:**

- The environment variable `NEXT_PUBLIC_SUPABASE_ANON_KEY` was set to the **publishable key** instead of the **anon public key** from Supabase.
- I Int to the Supabase dashboard (Settings → API) and copied the correct **anon public key**.
- Updated the Vercel project environment variables to use the correct key, then redeployed.
- This fixed the API key error.

### 3. Supabase Docker Permissions on Linux

**Problem:**
When setting up Supabase locally with Docker on Linux, I ran into permission errors—Supabase CLI couldn't access the Docker socket.

**Solution:**

- This is a common issue on Linux because the Docker daemon requires root or group permissions.
- I fixed it by adding our user to the `docker` group:
  ```bash
  sudo usermod -aG docker $USER
  # Then log out and log back in, or reboot
  ```
- After this, Supabase CLI could start and manage containers without permission errors. (Not recommended for production machines)

## License

MIT
