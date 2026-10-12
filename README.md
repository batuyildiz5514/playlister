# 🎵 Playlister

<p align="center">
  <strong>A modern, high-performance web application to seamlessly transfer Spotify playlists and albums to YouTube.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Spotify-Web_API-1DB954?style=for-the-badge&logo=spotify" alt="Spotify API" />
  <img src="https://img.shields.io/badge/YouTube-Data_API_v3-FF0000?style=for-the-badge&logo=youtube" alt="YouTube API" />
</p>

---

## ✨ Features

- **🎧 Playlist & Album Support:** Paste any public Spotify playlist or album URL (`/album/` or `/playlist/`); Playlister automatically detects the source type and extracts all tracks.
- **⚡ 5x Faster Concurrent Transfer:** Rather than sequential processing, tracks are queried and added in concurrent chunks of 5. This achieves maximum speed while respecting YouTube API rate limits.
- **📄 Infinite Pagination:** Bypasses Spotify's default 100-track limit via automatic pagination. Effortlessly fetches massive playlists with 300+, 500+ songs.
- **👤 Personalized Profile View:** Browse your own created Spotify playlists, inspect the full tracklist inside an interactive modal dialog, and start converting in a single click.
- **🛡️ Intelligent Error Handling:** If a video cannot be added to YouTube due to regional restrictions or copyright flags, the process does not halt; failed tracks are tracked and summarized gracefully.
- **🔐 Independent Dual OAuth 2.0 Flow:** Manages concurrent Spotify and Google authenticated sessions using a custom, stateless, HTTP-only cookie architecture.
- **🎨 Modern Dark Mode Interface:** Clean dark aesthetics with dynamic neon green and red gradients, responsive layouts, and smooth micro-interactions.

---

## 🛠️ Tech Stack

| Area | Technology | Description |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server Components & Server Actions architecture |
| **UI Library** | React 19 | Declarative user interface components |
| **Language** | TypeScript | End-to-end type safety |
| **Styling** | Tailwind CSS | Modern utility-first styling |
| **Music Data** | Spotify Web API | User profile, playlists, and album metadata |
| **Video Platform** | YouTube Data API v3 (`googleapis`) | Playlist creation and automated video search/insertion |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/batuyildiz5514/playlister.git
cd playlister
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Spotify Web API
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Google Cloud / YouTube Data API v3
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

> **Security Note:** `.env.local` is protected by `.gitignore` and must never be committed to git. Refer to `.env.example` for reference.

---

## 🔑 API Configuration Guide

### Spotify Developer Dashboard
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create a new application.
2. In the **Redirect URIs** field, enter:
   ```text
   http://127.0.0.1:3000/api/auth/callback/spotify
   ```
3. Ensure the **Web API** toggle is enabled in your app settings.

### Google Cloud Console (YouTube Data API v3)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. Under **APIs & Services > Library**, enable the **YouTube Data API v3**.
3. Under **OAuth consent screen**, set user type to *External* and add your email under Test Users.
4. Under **Credentials**, create an *OAuth 2.0 Client ID* (Web Application) and add the following to **Authorized redirect URIs**:
   ```text
   http://127.0.0.1:3000/api/auth/callback/google
   ```

---

## 💻 Running the Development Server

```bash
npm run dev
```

> ⚠️ **Important:** Because Spotify and Google OAuth redirects are bound to `127.0.0.1` for local cookie and websocket consistency, open:
> 
> 👉 **[http://127.0.0.1:3000](http://127.0.0.1:3000)** in your browser (instead of `localhost:3000`).

---

## 📂 Project Structure

```text
playlister/
├── src/
│   ├── app/
│   │   ├── api/auth/               # OAuth initiation and callback handlers
│   │   │   ├── google/
│   │   │   └── spotify/
│   │   ├── dashboard/              # Converter interface and search input
│   │   ├── profile/                # User playlists and preview modal
│   │   ├── actions.ts              # Server Actions for Spotify & YouTube logic
│   │   ├── layout.tsx              # Root application layout
│   │   └── page.tsx                # Landing & account authentication page
│   ├── components/
│   │   └── Navbar.tsx              # Dynamic navigation bar
│   └── lib/
│       └── google.ts               # Google OAuth2 client initialization
├── public/                         # Static assets
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules (protecting .env files)
└── package.json
```

---

## 🔒 Security & Privacy

- **No Stored Credentials:** No client secrets, API tokens, or user emails are stored in this repository.
- **Secure Sessions:** Authentication tokens are stored exclusively in encrypted, `HttpOnly`, `SameSite=Lax` cookies, preventing client-side script inspection.
- **Minimal Permissions:** Only strictly necessary OAuth scopes (reading playlists and creating YouTube playlist items) are requested.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
