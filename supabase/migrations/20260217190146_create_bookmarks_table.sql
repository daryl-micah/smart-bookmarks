
  create table "public"."bookmarks" (
    "id" uuid not null default gen_random_uuid() primary key,
    "user_id" uuid not null,
    "url" text not null,
    "title" text not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );

-- index
create index bookmarks_idx on public.bookmarks (user_id);

-- enable RLS
alter table public.bookmarks enable row level security;

-- policies
create policy "Users can view their own bookmarks" on public.bookmarks
  for select using (auth.uid() = user_id);

create policy "Users can insert their own bookmarks" on public.bookmarks
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own bookmarks" on public.bookmarks
  for update using (auth.uid() = user_id);

create policy "Users can delete their own bookmarks" on public.bookmarks
  for delete using (auth.uid() = user_id);

-- enable realtime
alter publication supabase_realtime add table public.bookmarks;