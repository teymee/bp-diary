create table
    goals (
        id uuid primary key default gen_random_uuid (),
        user_id uuid references auth.users (id),
        goal_name text not null,
        systolic int not null,
        diastolic int not null, 
        pulse int,
        end_date text,
        created_at timestamptz default now ()
    );

alter table goals enable row level security;

create policy "Users can view own goals" on goals for
select
    using (auth.uid () = user_id);

create policy "Users can update own goals" on goals for insert
with
    check (auth.uid () = user_id);

create policy "User can update own goals" on goals for
update
with
    check (auth.uid () = user_id);

create policy "Users can delete own goals" on goals for delete using (auth.uid () = user_id);