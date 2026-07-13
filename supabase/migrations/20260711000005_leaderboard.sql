-- Leaderboard & achievement badges (Master Doc §3, §7, ToS §7a).
-- Opt-in and OFF by default (profiles.leaderboard_opt_in, set in migration
-- 0001) — these functions only ever surface opted-in users, and only their
-- display name + aggregated numbers, never raw rows.
--
-- Badges shipped now (fully computable from existing data, no external
-- dependency): "First R500" (lifetime saved >= R500), "5-Week Streak"
-- (a saving logged in each of the last 5 calendar weeks), "Top 10"
-- (currently top 10 all-time by rand saved). The "Student" badge from the
-- mockup needs a verification method Luke hasn't decided on yet — deferred.

-- A user's own badge status. Callable by any authenticated user, for
-- themselves only (auth.uid()) — safe to expose broadly since it reveals
-- nothing about anyone else.
create function public.get_my_badges()
returns table (
  first_500 boolean,
  streak_5_week boolean,
  top_10_all_time boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  with my_total as (
    select coalesce(sum(amount_saved), 0) as total
    from public.savings_events
    where user_id = auth.uid()
  ),
  my_recent_weeks as (
    select count(distinct date_trunc('week', occurred_at)) as wk_count
    from public.savings_events
    where user_id = auth.uid()
      and occurred_at >= date_trunc('week', now()) - interval '4 weeks'
  ),
  lifetime_totals as (
    select user_id, sum(amount_saved) as total
    from public.savings_events
    group by user_id
  ),
  ranked as (
    select user_id, rank() over (order by total desc) as rnk
    from lifetime_totals
  )
  select
    (select total from my_total) >= 500 as first_500,
    (select wk_count from my_recent_weeks) = 5 as streak_5_week,
    coalesce(
      (select rnk <= 10 from ranked where user_id = auth.uid()),
      false
    ) as top_10_all_time;
$$;

grant execute on function public.get_my_badges() to authenticated;

-- Leaderboard roster for a given period: one row per opted-in user with
-- their display name (nickname, or full name if they've separately opted
-- into showing it), their saved total for the period, their badge count
-- (for the "achievements" ranking), and whether the row is the caller.
-- The client fetches once per period and sorts locally by whichever metric
-- tab is selected.
create function public.get_leaderboard(period_start timestamptz, period_end timestamptz)
returns table (
  display_name text,
  period_saved numeric,
  badge_count integer,
  is_me boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  with opted as (
    select
      id,
      case
        when leaderboard_show_full_name and full_name is not null and full_name <> ''
          then full_name
        else nickname
      end as display_name
    from public.profiles
    where leaderboard_opt_in = true
  ),
  period_totals as (
    select user_id, sum(amount_saved) as period_saved
    from public.savings_events
    where occurred_at >= period_start and occurred_at < period_end
    group by user_id
  ),
  lifetime_totals as (
    select user_id, sum(amount_saved) as total
    from public.savings_events
    group by user_id
  ),
  ranked_lifetime as (
    select user_id, rank() over (order by total desc) as rnk
    from lifetime_totals
  ),
  weeks_active as (
    select user_id, count(distinct date_trunc('week', occurred_at)) as wk_count
    from public.savings_events
    where occurred_at >= date_trunc('week', now()) - interval '4 weeks'
    group by user_id
  ),
  badges as (
    select
      o.id,
      (coalesce(lt.total, 0) >= 500)::int
        + (coalesce(wa.wk_count, 0) = 5)::int
        + (coalesce(rl.rnk, 999) <= 10)::int as badge_count
    from opted o
    left join lifetime_totals lt on lt.user_id = o.id
    left join weeks_active wa on wa.user_id = o.id
    left join ranked_lifetime rl on rl.user_id = o.id
  )
  select
    o.display_name,
    coalesce(pt.period_saved, 0) as period_saved,
    b.badge_count,
    o.id = auth.uid() as is_me
  from opted o
  left join period_totals pt on pt.user_id = o.id
  left join badges b on b.id = o.id;
$$;

grant execute on function public.get_leaderboard(timestamptz, timestamptz) to authenticated;
