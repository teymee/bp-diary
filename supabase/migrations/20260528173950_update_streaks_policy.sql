drop policy "Users can update own streaks" on streaks;

drop policy "Users can view own streaks" on streaks;

create policy "Users can view own streaks" on streaks for
select
    using (auth.uid () = user_id);

create policy "Users can update own streaks" on streaks for
update using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);