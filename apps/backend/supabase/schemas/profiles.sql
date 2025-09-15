CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
	level INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
