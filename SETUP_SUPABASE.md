# Setup Supabase untuk HabitFlow

## Langkah-langkah Setup

### 1. Buat Project di Supabase
- Buka https://supabase.com
- Klik "New project"
- Isi nama project: `habitflow`
- Pilih region terdekat
- Buat password database yang kuat
- Tunggu project siap (±2 menit)

### 2. Konfigurasi Database
- Buka "SQL Editor" di sidebar kiri
- Paste kode SQL berikut:

```sql
-- Create users table
CREATE TABLE public.users (
  id UUID DEFAULT auth.uid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create habits table
CREATE TABLE public.habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  target TEXT NOT NULL,
  priority TEXT DEFAULT 'Normal',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create habit history table
CREATE TABLE public.habit_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can read their own habits" ON public.habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create habits" ON public.habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON public.habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" ON public.habits
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own history" ON public.habit_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create history" ON public.habit_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own history" ON public.habit_history
  FOR UPDATE USING (auth.uid() = user_id);
```

- Klik "Run" untuk menjalankan SQL

### 3. Dapatkan Credentials
- Buka "Project Settings" → "API"
- Copy **Project URL** dan **Anon Key (public)**
- Paste ke file `js/config.js`:

```javascript
SUPABASE_URL: "https://YOUR_PROJECT_ID.supabase.co",
SUPABASE_ANON_KEY: "YOUR_ANON_KEY_HERE"
```

### 4. Aktifkan Email Authentication
- Buka "Authentication" di sidebar
- Klik "Providers"
- Pastikan "Email" sudah enabled
- (Opsional) Aktifkan Google, GitHub untuk login sosial

### 5. Test Aplikasi
- Buka `login.html` di browser
- Daftar akun baru
- Login dan mulai gunakan aplikasi

## Troubleshooting

### Error: "Invalid API key"
- Pastikan SUPABASE_URL dan SUPABASE_ANON_KEY benar di config.js

### Error: "User already exists"
- Email sudah terdaftar sebelumnya, gunakan email lain

### Data tidak tersimpan
- Periksa browser console untuk error message
- Pastikan RLS policies sudah disetup dengan benar

## Keamanan

⚠️ **Penting:**
- Jangan commit `config.js` dengan credentials asli ke Git
- Gunakan environment variables di production
- Password selalu di-hash oleh Supabase
- Enable 2FA di Supabase console
