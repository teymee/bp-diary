create table
    streaks (
        id uuid primary key default gen_random_uuid (),
        user_id uuid references auth.users (id),
        current_streak int not null default 0,
        longest_streak int not null default 0,
        last_recorded_at timestamptz
    );
alter table streaks enable row level security;

create policy "Users can view own streaks" on streaks for
select
    using (auth.uid () = user_id);

create policy "Users can insert own streaks" on streaks for insert
with
    check (auth.uid () = user_id);

create policy "Users can update own streaks" on streaks for
update
with
    check (auth.uid () = user_id);

create policy "Users can delete own streaks" on streaks for delete using (auth.uid () = user_id);