# Portfolio CMS (Vue 3 + TypeScript + Firebase)

Self-hosted personal portfolio with a built-in **Admin CMS** powered by Firebase Authentication and Cloud Firestore. Every section—Featured Works, Archive & Experiments, About & Highlights, Honors & Certifications, Core Capabilities, and Footer Settings—can be managed directly from `/admin` without redeploying code.

## Features

- **Dynamic Portfolio Sections**: Selected Works (pinned projects), Archive & Experiments (dynamic category filter + pagination), About & Quick Facts, Honors with SVG medal badges, Certifications, and Core Capabilities.
- **Full-Control Admin CMS (`/admin`)**:
  - CRUD for Projects, Categories, Honors, Certificates, Bio/Highlights, and Global Settings.
  - Pin/Unpin projects to Selected Works and Archive/Hide projects independently.
  - Drag-and-drop project reordering synced to Firestore (`displayOrder`).
  - Dynamic external links and Google Drive image URL support.
- **Interactive UX**: Command Palette (`Cmd/Ctrl + K`), X-Ray layout inspector, and responsive case study pages (`/project/:slug`).

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, Vue Router
- **Motion & UI**: Motion-v, Animate-UI, Hugeicons
- **Backend & Hosting**: Firebase Authentication, Cloud Firestore, Firebase Hosting

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
git clone [https://github.com/awfajri/awfajri-portfolio-2026.git](https://github.com/awfajri/awfajri-portfolio-2026.git)
cd awfajri-portfolio-2026
npm install
```

### 2. Firebase Project Setup

1. Buka [Firebase Console](https://console.firebase.google.com/) dan buat project baru (atau gunakan project yang sudah ada).
2. Daftarkan **Web App** baru untuk mendapatkan konfigurasi Firebase SDK (`apiKey`, `authDomain`, `projectId`, dll.).
3. **Enable Authentication**:
   - Masuk ke **Build → Authentication → Sign-in method**.
   - Aktifkan provider **Email/Password**.
   - Masuk ke tab **Users** → klik **Add user** untuk membuat akun admin, lalu salin **User UID**-nya.
4. **Enable Cloud Firestore**:
   - Masuk ke **Build → Firestore Database → Create database**.
   - Buka tab **Rules**, lalu pasang aturan berikut (ganti `YOUR_ADMIN_UID` dengan UID akun adminmu):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == "YOUR_ADMIN_UID";
    }
  }
}
```

### 3. Configure Environment Variables

Buat file `.env` di root project (jangan di-commit ke Git) dan isi sesuai konfigurasi Web App Firebase kamu:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Locally

```bash
npm run dev
```

- Halaman utama: `http://localhost:5173`
- Panel Admin: `http://localhost:5173/admin/login` (login menggunakan akun Email/Password yang dibuat di Firebase Authentication).

---

## Deployment (Firebase Hosting)

1. Login dan inisialisasi Firebase Hosting:

```bash
npx firebase-tools login
npx firebase-tools init hosting
```

- Public directory: `dist`
- Configure as a single-page app (rewrite all urls to `/index.html`): **Yes (`y`)**
- Overwrite `dist/index.html`: **No (`N`)**

2. Build dan deploy:

```bash
npm run build
npx firebase-tools deploy --only hosting
```

3. Pastikan domain hosting (`*.web.app` / custom domain) sudah terdaftar di **Firebase Console → Authentication → Settings → Authorized domains** agar login admin berjalan di production.
