
create table
    readings (
        id uuid primary key default gen_random_uuid (),
        user_id uuid references auth.users (id),
        systolic int not null,
        diastolic int not null,
        pulse int,
        recorded_at timestamptz not null,
        created_at timestamptz default now ()
    );

alter table readings enable row level security;

create policy "Users can view own readings" on readings for
select
    using (auth.uid () = user_id);

create policy "Users can insert own readings" on readings for insert
with
    check (auth.uid () = user_id);

create policy "Users can update own readings" on readings for
update
with
    check (auth.uid () = user_id);

create policy "Users can delete own readings" on readings for delete using (auth.uid () = user_id);