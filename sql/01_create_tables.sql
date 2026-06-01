-- =========================================================
-- HABITFLOW - 01_CREATE_TABLES.SQL
-- Membuat tabel-tabel utama untuk HabitFlow di Supabase
-- =========================================================

-- Tabel Habits
CREATE TABLE IF NOT EXISTS habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Lainnya',
    target TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Normal',
    completed_dates TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Habit History
CREATE TABLE IF NOT EXISTS habit_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    target TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Selesai',
    date_label TEXT NOT NULL,
    date_key TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel User Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS habits_user_id_idx ON habits(user_id);
CREATE INDEX IF NOT EXISTS history_user_id_idx ON habit_history(user_id);
CREATE INDEX IF NOT EXISTS history_habit_id_idx ON habit_history(habit_id);
CREATE INDEX IF NOT EXISTS history_date_key_idx ON habit_history(date_key);
