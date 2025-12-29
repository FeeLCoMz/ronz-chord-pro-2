# RoNz Chord Pro 🎸

Aplikasi Chord dan Lirik berbasis React dengan fitur lengkap untuk musisi dan penggemar musik.

## ✨ Fitur Utama

- **📝 Chord Display** - Tampilan chord dan lirik dengan format ChordPro
- **🎵 Transpose** - Transposisi chord ke kunci yang diinginkan
- **🎨 Chord Highlight** - Sorot chord untuk memudahkan pembacaan
- **📺 YouTube Viewer** - Embedded YouTube player untuk menonton video lagu
- **📜 Auto Scroll** - Scroll otomatis dengan kecepatan yang dapat diatur
- **🎼 Song Structure Highlight** - Penanda bagian lagu (verse, chorus, bridge)
- **📋 Set List Management** - Kelola daftar lagu untuk performa/latihan
- **💾 Local Storage** - Simpan set list secara otomatis

## 🚀 Cara Menjalankan

### Install Dependencies

```bash
npm install
```

### Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Build untuk Production

```bash
npm run build
```

## 📖 Cara Menggunakan

### 1. Memilih Lagu
- Klik pada judul lagu di sidebar kiri
- Lagu akan ditampilkan dengan chord dan lirik

### 2. Transpose Chord
- Gunakan tombol `-1` dan `+1` untuk transpose
- Tombol `Reset` untuk kembali ke kunci asli

### 3. Highlight Chord
- Toggle checkbox "Highlight Chords" untuk menyorot chord
- Memudahkan membaca chord saat bermain musik

### 4. Auto Scroll
- Klik "Auto Scroll" untuk mengaktifkan scroll otomatis
- Atur kecepatan dengan tombol `-` dan `+`
- Berguna saat bermain musik

### 5. YouTube Viewer
- Video YouTube otomatis dimuat jika tersedia
- Gunakan kontrol play/pause/stop
- Toggle checkbox untuk menampilkan/menyembunyikan video

### 6. Set List Management
- Klik ikon ⚙ untuk membuka Set List Manager
- Buat set list baru untuk latihan atau performa
- Tambah/hapus lagu dari set list
- Pilih set list untuk filter lagu

## 🎼 Format ChordPro

Aplikasi menggunakan format ChordPro untuk lagu:

```
{title: Judul Lagu}
{artist: Nama Artis}
{key: C}

{start_of_verse}
[C]Lirik dengan [G]chord di [Am]atasnya [F]
{end_of_verse}

{start_of_chorus}
[C]Ini bagian [G]chorus [Am] [F]
{end_of_chorus}
```

### Tag yang Didukung:
- `{title:...}` - Judul lagu
- `{artist:...}` - Nama artis
- `{key:...}` - Kunci asli lagu
- `{start_of_verse}` / `{end_of_verse}` - Bagian verse
- `{start_of_chorus}` / `{end_of_chorus}` - Bagian chorus
- `{start_of_bridge}` / `{end_of_bridge}` - Bagian bridge
- `{start_of_intro}` / `{end_of_intro}` - Bagian intro
- `{start_of_outro}` / `{end_of_outro}` - Bagian outro
- `[chord]` - Chord di atas lirik

## 🎯 Menambah Lagu Baru

Edit file `src/data/songs.js`:

```javascript
{
  id: 4,
  title: "Judul Lagu",
  artist: "Nama Artis",
  youtubeId: "kode_video_youtube", // opsional
  lyrics: `{title: Judul Lagu}
{artist: Nama Artis}
{key: G}

{start_of_verse}
[G]Lirik dengan [D]chord
{end_of_verse}`
}
```

## 🛠️ Teknologi yang Digunakan

- **React 18** - Library UI
- **Vite** - Build tool & dev server
- **YouTube IFrame API** - YouTube player integration
- **CSS3** - Styling dengan custom properties

## 📱 Responsive Design

Aplikasi fully responsive dan dapat digunakan di:
- Desktop
- Tablet
- Mobile

## 📝 Lisensi

MIT License - Bebas digunakan untuk keperluan pribadi dan komersial

## 👨‍💻 Author

**RoNz**

---

Selamat bermain musik! 🎸🎵
