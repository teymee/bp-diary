-- 🚨 READINGS TABLE 
drop policy "Users can update own readings" on readings;

create policy "Users can update own readings" on readings for
update using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);

    -- 🚨 GOALS TABLE
drop policy "User can update own goals" on goals;

create policy "User can update own goals" on goals for
update using (auth.uid () = user_id)
with
    check (auth.uid () = user_id);