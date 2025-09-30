CREATE TABLE public.exercises (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	external_id text,
  name text,
  force text,
  level text,
  mechanic text,
  equipment text,
  primary_muscles text[],
  secondary_muscles text[],
  instructions text[],
  category text,
  images text[]
);
