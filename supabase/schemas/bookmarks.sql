create table "bookmarks" (
    "id" uuid default gen_random_uuid() primary key,
    "user_id" uuid references auth.users on delete cascade not null,
    "url" text not null,
    "title" text not null,
    "created_at" timestamp with time zone default timezone('utc'::text, now()) not null,
    "updated_at" timestamp with time zone default timezone('utc'::text, now()) not null
)