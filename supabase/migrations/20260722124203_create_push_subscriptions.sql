create table
    push_subscriptions (
        id uuid primary key default gen_random_uuid (),
        user_id uuid not null references auth.users (id) on delete cascade,
        endpoint text not null,
        p256dh text not null,
        auth text not null,
        created_at timestamptz default now ()
    );

alter table push_subscriptions enable row level security;

create policy "Users can insert their own subscriptions" on push_subscriptions for insert to authenticated
with
    check (auth.uid () = user_id);

create policy "Users can view their own subscriptions" on push_subscriptions for
select
    to authenticated using (auth.uid () = user_id);

create policy "Users can update their own subscriptions" on push_subscriptions for
update to authenticated using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);

create policy "Users can delete their own subscriptions" on push_subscriptions for delete to authenticated using (auth.uid () = user_id);