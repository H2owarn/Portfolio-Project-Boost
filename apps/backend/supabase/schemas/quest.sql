create table public.quest (
  id serial primary key,
  name text,
  description text,
  quest_type text check (quest_type in ('main','side')),
  min_level int,
  max_level int,
  goal text,
  exercise_ids int[]
);
