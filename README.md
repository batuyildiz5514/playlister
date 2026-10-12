# 🎵 Playlister

<p align="center">
  <strong>Spotify çalma listelerini ve albümlerini tek tıkla YouTube'a taşıyan modern ve yüksek performanslı web uygulaması.</strong>
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

## ✨ Özellikler

- **🎧 Çalma Listesi & Albüm Desteği:** İster herkese açık herhangi bir Spotify çalma listesi, ister doğrudan bir albüm bağlantısı (`/album/` veya `/playlist/`) yapıştırın; Playlister link türünü otomatik algılar.
- **⚡ 5x Hızlı Paralel Dönüştürme:** Şarkıları tek tek beklemek yerine 5'erli eş zamanlı paketler (*concurrency chunk*) halinde YouTube'da aratır ve çalma listesine ekler. Google API sınırlarına takılmadan maksimum hız sunar.
- **📄 Akıllı Sayfalama (Pagination):** Spotify'ın varsayılan 100 şarkılık sınırını otomatik sayfalama mekanizmasıyla aşar. 300+, 500+ şarkılık devasa listeleri eksiksiz çeker.
- **👤 Kişiselleştirilmiş Profil Sayfası:** Spotify hesabınıza ait çalma listelerini listeleyin, üzerlerine tıklayarak açılan şık modal penceresinde tüm şarkıları önizleyin ve doğrudan dönüştürmeye gönderin.
- **🛡️ Akıllı Hata Toleransı:** Telif, bölge engeli veya gizlilik nedeniyle YouTube'a eklenemeyen parçalarda işlem durmaz; sistem bu parçaları ayrı bir listede raporlayıp sürece kesintisiz devam eder.
- **🔐 Bağımsız Çift OAuth 2.0 Akışı:** Spotify ve Google hesap oturumlarını aynı anda yönetebilmek için özel, durumsuz (stateless) ve HTTP-Only çerez tabanlı kimlik doğrulama mimarisi.
- **🎨 Modern Dark Mode Arayüz:** Göz yormayan koyu tema, neon yeşil-kırmızı gradient geçişleri ve akıcı geçiş animasyonları.

---

## 🛠️ Teknoloji Yığını

| Alan | Teknoloji | Açıklama |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server Components & Server Actions tabanlı modern mimari |
| **Kütüphane** | React 19 | Kullanıcı arayüzü bileşenleri |
| **Dil** | TypeScript | Uçtan uca tip güvenliği |
| **Stil** | Tailwind CSS | Hızlı ve modern stillendirme |
| **Müzik API** | Spotify Web API | Kullanıcı profili, çalma listesi ve albüm verileri |
| **Video API** | YouTube Data API v3 (`googleapis`) | Çalma listesi oluşturma ve video eşleme |

---

## 🚀 Hızlı Başlangıç

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/batuyildiz5514/playlister.git
cd playlister
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Çevre Değişkenlerini (Environment Variables) Ayarlayın
Kök dizinde `.env.local` adında bir dosya oluşturun ve gerekli anahtarları girin:

```env
# Spotify Web API
SPOTIFY_CLIENT_ID=spotify_istemci_id_buraya
SPOTIFY_CLIENT_SECRET=spotify_istemci_gizli_anahtari_buraya

# Google Cloud / YouTube Data API v3
GOOGLE_CLIENT_ID=google_istemci_id_buraya.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=google_istemci_gizli_anahtari_buraya
```

> **Önemli Not:** API anahtarlarınızı içeren `.env.local` dosyası `.gitignore` tarafından korunmaktadır ve kesinlikle depoya yüklenmemelidir. Örnek şablon için `.env.example` dosyasını inceleyebilirsiniz.

---

## 🔑 API Yapılandırma Rehberi

### Spotify Developer Dashboard
1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) adresine gidin ve yeni bir uygulama oluşturun.
2. **Redirect URIs** bölümüne tam olarak şu adresi ekleyin:
   ```text
   http://127.0.0.1:3000/api/auth/callback/spotify
   ```
3. Uygulama ayarlarından **Web API** seçeneğinin işaretli olduğundan emin olun.

### Google Cloud Console (YouTube Data API v3)
1. [Google Cloud Console](https://console.cloud.google.com/) adresinde bir proje oluşturun veya seçin.
2. **APIs & Services > Library** bölümünden **YouTube Data API v3** API'sini etkinleştirin.
3. **OAuth consent screen** bölümünde kullanıcı türünü *External* seçin ve geliştirme aşamasındaysanız test kullanıcısı olarak Gmail adresinizi ekleyin.
4. **Credentials** sayfasından bir *OAuth 2.0 Client ID* oluşturun (Web application) ve **Authorized redirect URIs** alanına ekleyin:
   ```text
   http://127.0.0.1:3000/api/auth/callback/google
   ```

---

## 💻 Geliştirme Sunucusunu Başlatma

```bash
npm run dev
```

> ⚠️ **Dikkat:** Spotify ve Google OAuth yönlendirmeleri güvenlik gereği `127.0.0.1` adresine ayarlandığı için tarayıcınızda:
> 
> 👉 **[http://127.0.0.1:3000](http://127.0.0.1:3000)** adresini kullanınız (`localhost:3000` yerine).

---

## 📂 Proje Yapısı

```text
playlister/
├── src/
│   ├── app/
│   │   ├── api/auth/               # OAuth yönlendirme ve geri çağırma (callback) rotaları
│   │   │   ├── google/
│   │   │   └── spotify/
│   │   ├── dashboard/              # Ana dönüştürücü arayüzü ve arama alanı
│   │   ├── profile/                # Kullanıcı çalma listeleri ve şarkı önizleme modalı
│   │   ├── actions.ts              # Server Actions (Spotify ve YouTube API mantığı)
│   │   ├── layout.tsx              # Genel düzen bileşeni
│   │   └── page.tsx                # Hesap bağlantı ve karşılama (Landing) sayfası
│   ├── components/
│   │   └── Navbar.tsx              # Dinamik üst menü bileşeni
│   └── lib/
│       └── google.ts               # Google OAuth2 istemci yapılandırması
├── public/                         # Statik varlıklar
├── .env.example                    # Ortam değişkenleri şablonu
├── .gitignore                      # Git dışlama kuralları (.env dosyaları dahil)
└── package.json
```

---

## 🔒 Güvenlik & Gizlilik

- **Gizli Veriler:** Hiçbir istemci gizli anahtarı (Client Secret), erişim belirteci (Access Token) veya kullanıcı e-postası depoda tutulmaz.
- **Çerez Güvenliği:** Oturum belirteçleri `HttpOnly` ve `SameSite=Lax` korumalı çerezlerde saklanır; JavaScript tarafından doğrudan okunamaz.
- **Yetkilendirme:** Sadece gerekli minimum izinler (Spotify çalma listesi okuma, YouTube çalma listesi oluşturma/ekleme) talep edilir.

---

## 📄 Lisans

Bu proje kişisel gelişim ve eğitim amaçlı geliştirilmiştir. MIT Lisansı kapsamında özgürce kullanılabilir.
