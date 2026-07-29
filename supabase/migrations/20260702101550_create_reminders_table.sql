create table
    reminders (
        id uuid not null primary key default gen_random_uuid (),
        user_id uuid not null references auth.users (id) on delete cascade,
        title text not null,
        time time not null,
        start_date date not null,
        end_date date,
        repeat_type text not null check (repeat_type in ('once', 'daily', 'weekly')),
        repeat_days text ARRAY,
        is_enabled boolean not null default true,
        created_at timestamptz default now ()
    );

alter table reminders enable row level security;

create policy "Users can view own reminders" on reminders for
select
    using (auth.uid () = user_id);

create policy "User can insert own reminder" on reminders for insert
with
    check (auth.uid () = user_id);

create policy "User can update own reminder" on reminders for
update using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);

create policy "User can delete own reminder" on reminders for delete using (auth.uid () = user_id);