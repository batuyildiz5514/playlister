# Playlister - Project Plan & Roadmap

## 📌 Project Overview
Playlister is a web application that enables users to effortlessly migrate their Spotify music playlists and albums to YouTube (and YouTube Music).
Initially architected as a Next.js web application, it is designed with future portability in mind for potential desktop (.exe via Tauri) or mobile (via Capacitor) distribution.

## 🛠️ Tech Stack
Built following a "Write Once, Run Anywhere" modular paradigm:

*   **Frontend (UI & Web):** [Next.js](https://nextjs.org/) (React 19, App Router)
    *   *Why?* Unified server-side routing, API routes, and Server Actions eliminate the need for a separate backend service.
*   **Styling:** Tailwind CSS (Modern, fast, dark mode aesthetics).
*   **Desktop App (Future Phase):** [Tauri](https://tauri.app/) (Lightweight Windows/macOS native compilation).
*   **Mobile App (Future Phase):** [Capacitor](https://capacitorjs.com/) (Web-to-mobile bridge).
*   **Authentication & Session:** Stateless HTTP-only cookie-based dual OAuth 2.0 flow.

## 🔗 APIs & Quotas
*   **Spotify Web API:** Free tier. Used for user profile retrieval, playlist querying, and album track extraction.
*   **YouTube Data API v3:** Free tier with standard quota allowances (10,000 units/day). Used for playlist creation and video search/insertion.

---

## 🚀 Development Roadmap

### Phase 1: Setup & Core Infrastructure
1.  [x] Initialize Next.js project repository configured for VS Code and TypeScript.
2.  [x] Git version control setup and initial commits.
3.  [x] Dependency installations (googleapis, tailwindcss, etc.).
4.  [x] Spotify Developer Dashboard & Google Cloud Console API credentials configuration.

### Phase 2: API Integrations & Authentication
1.  [x] Spotify OAuth 2.0 flow ("Connect with Spotify").
2.  [x] YouTube (Google) OAuth 2.0 flow ("Connect with YouTube").
3.  [x] Fetching user playlists and handling dual token cookie storage.

### Phase 3: Core Conversion Logic
1.  [x] Playlist & album track extraction with automatic type recognition.
2.  [x] YouTube video search with concurrency optimization (5x parallel chunks).
3.  [x] Automated playlist creation in user's YouTube account.
4.  [x] Inserting matched YouTube videos into the created playlist.
5.  [x] Automatic pagination handling for large playlists (100+ & 300+ tracks).

### Phase 4: UI/UX, Performance & Polish
1.  [x] Modern dark mode user interface with green-to-red gradient branding.
2.  [x] Live progress bar with status updates during batch transfer.
3.  [x] User profile dashboard showing created playlists with interactive track preview modal.
4.  [x] Connection management (Disconnect / Re-authenticate for both providers).
5.  [x] Channel & profile identity display with avatars on the landing screen.

### Phase 5: Desktop and Mobile Distribution (Future Roadmap)
1.  [ ] Package as desktop app (.exe / .dmg) via Tauri.
2.  [ ] Mobile deployment & testing via Capacitor.

---

## 💻 Contribution & Git Workflow
*   Follow clean commit conventions (`feat:`, `fix:`, `docs:`, `refactor:`).
*   Protect secrets in `.env.local` using `.gitignore` at all times.
