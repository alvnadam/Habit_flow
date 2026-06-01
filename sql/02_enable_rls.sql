-- =========================================================
-- HABITFLOW - 02_ENABLE_RLS.SQL
-- Mengaktifkan Row Level Security (RLS) untuk semua tabel
-- =========================================================

-- Enable RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
