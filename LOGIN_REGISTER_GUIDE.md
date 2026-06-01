# HabitFlow - Panduan Login & Register

## 📋 Fitur Autentikasi

Halaman login dan register HabitFlow mendukung dua mode:

### 1️⃣ Mode Supabase (Recommended)
- Menggunakan database cloud Supabase
- Autentikasi aman dengan Supabase Auth
- Data tersimpan secara permanen
- Sinkronisasi lintas device

### 2️⃣ Mode LocalStorage (Fallback)
- Data tersimpan di browser saja
- Tidak memerlukan konfigurasi database
- Berguna untuk testing/development
- Data hilang jika cache dibersihkan

---

## 🚀 Quick Start

### Opsi A: Menggunakan Supabase (Production Ready)

1. **Setup Supabase**
   ```
   Ikuti: SETUP_SUPABASE.md
   ```

2. **Buka login.html**
   ```
   Browser: http://localhost/Habbit_Tracker/login.html
   (atau file:///C:/Users/MSI/Desktop/Habbit_Tracker/login.html)
   ```

3. **Daftar Akun Baru**
   - Klik "Daftar sekarang"
   - Isi form dengan data kamu
   - Email verifikasi akan dikirim (optional)

4. **Login**
   - Masukkan email & password
   - Klik "Masuk"
   - Akan diarahkan ke Dashboard

### Opsi B: Menggunakan LocalStorage (Instant)

1. **Buka login.html** (tanpa perlu setup Supabase)
2. **Proses registrasi & login sama seperti di atas**
3. **Data akan tersimpan di browser**

---

## 📝 Form Fields

### Register
- **Nama Lengkap** (wajib)
- **Email** (wajib, unik)
- **Password** (minimal 6 karakter)
- **Konfirmasi Password** (harus sama dengan password)

### Login
- **Email** (wajib)
- **Password** (wajib)

### Fitur
- ✅ Validasi email format
- ✅ Show/hide password
- ✅ Error message yang jelas
- ✅ Loading state pada tombol
- ✅ Redirect otomatis setelah sukses

---

## 🔐 Keamanan

### LocalStorage
```javascript
// Password di-encode dengan Base64 (basic protection)
password: btoa(password)
```
⚠️ Tidak aman untuk production!

### Supabase
- Password di-hash dengan bcrypt
- Tidak ada password di-simpan di client
- Row-level security (RLS) enforced
- Koneksi HTTPS terenkripsi

---

## 📱 Responsif Design

✅ Fully responsive untuk semua ukuran layar:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

---

## 🐛 Troubleshooting

### Error: "Invalid API key"
**Solusi:**
- Cek SUPABASE_URL dan SUPABASE_ANON_KEY di config.js
- Pastikan tidak ada typo atau spasi ekstra
- Jangan commit credentials ke Git

### Error: "User already exists"
**Solusi:**
- Email sudah terdaftar, gunakan email lain
- Atau login dengan akun yang sudah ada

### Data tidak tersimpan
**Solusi:**
- Jika menggunakan Supabase: check console untuk error detail
- Jika menggunakan LocalStorage: clear browser cache
- Cek RLS policies di Supabase

### Form button tidak responsif
**Solusi:**
- Hard refresh browser (Ctrl+F5)
- Clear browser cache
- Cek JavaScript console untuk error

---

## 📂 File Structure

```
├── login.html              # Halaman login
├── register.html           # Halaman register
├── css/
│   ├── style.css          # Style utama
│   └── auth.css           # Style khusus auth
├── js/
│   ├── config.js          # Konfigurasi app
│   ├── auth.js            # Logic login/register
│   ├── supabaseClient.js  # Supabase client
│   ├── helpers.js         # Helper functions
│   └── ...
└── SETUP_SUPABASE.md      # Panduan Supabase
```

---

## 🔗 Flow Diagram

```
Login/Register Page
    ↓
Validate Form
    ↓
├─→ Supabase Ready? → Sign Up/In via Supabase
│                   ↓
│   Supabase Cloud DB
│
└─→ Fallback → Sign Up/In via LocalStorage
             ↓
    Browser Storage

Set User Session
    ↓
Redirect to Dashboard
```

---

## ✨ Tips Penggunaan

### Testing
```javascript
// Local testing tanpa Supabase:
1. Buka login.html
2. Register dengan email: test@example.com, password: 123456
3. Login dengan data yang sama
4. Data tersimpan di localStorage
```

### Production
```javascript
// Dengan Supabase:
1. Setup project di supabase.com
2. Isi config.js dengan credentials
3. Deploy ke hosting
4. Enable custom domain & SSL
```

### Backup Data
```javascript
// Export user data dari localStorage
const backupData = {
    users: localStorage.getItem("habitflow_users"),
    habits: localStorage.getItem("habitflow_habits"),
    history: localStorage.getItem("habitflow_history")
};
console.log(JSON.stringify(backupData));
```

---

## 📞 Support

Jika ada error:
1. Cek browser console (F12 → Console)
2. Lihat error message di form
3. Baca SETUP_SUPABASE.md jika pakai Supabase
4. Cek network request di DevTools → Network tab
