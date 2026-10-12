# Playlister - Proje Planı

## Proje Özeti
Bu proje, kullanıcıların Spotify'daki müzik listelerini (playlist) YouTube Music ve standart YouTube platformlarına aktarmalarını sağlayan aracı bir uygulamadır. 
İlk etapta web uygulaması olarak geliştirilecek olan Playlister, ilerleyen aşamalarda mobil uygulama (iOS/Android) ve masaüstü (.exe) formatlarına da dönüştürülecektir.

## 🛠️ Teknoloji Yığını (Tech Stack) Önerisi
Hem web, hem mobil, hem de masaüstünde çalışacak bir yapı kurmak için "Bir Kere Yaz, Her Yerde Çalıştır" (Write Once, Run Anywhere) mantığını benimsemeliyiz.

*   **Frontend (Arayüz & Web):** [Next.js](https://nextjs.org/) (React tabanlı). 
    *   *Neden?* API rotaları sayesinde sunucu (backend) ihtiyacını tek bir projede çözebiliriz.
*   **Stillendirme (CSS):** Tailwind CSS (Hızlı ve modern arayüz tasarımı için).
*   **Masaüstü Uygulaması (İleri Aşama):** [Tauri](https://tauri.app/). 
    *   *Neden?* Yazdığımız web uygulamasını kolayca Windows (.exe) uygulamasına çevirir. Tauri çok daha hafif ve hızlıdır.
*   **Mobil Uygulama (İleri Aşama):** [Capacitor](https://capacitorjs.com/) (Web'i mobile çevirir).
*   **Veritabanı (Gerekirse):** İlk etapta veritabanına gerek yok, kullanıcı verileri (tokenlar) tarayıcıda tutulabilir.

## 🔗 API'ler ve Ücretlendirme
*   **Spotify Web API:** Kullanımı **ücretsizdir**. Kullanıcıların giriş yapması, çalma listelerini ve içindeki şarkıları okuması için kullanılacaktır.
*   **YouTube Data API v3:** Kullanımı **ücretsizdir** ancak günlük bir "Kota" (Quota) sınırı vardır (Günlük 10.000 kredi). 
    *   Şarkı aramak, çalma listesi oluşturmak ve şarkı eklemek kota harcar. Uygulama büyüdükçe Google'dan kota artırımı talep etmek ücretsizdir. Biz şimdilik kotaya takılmadan ilerleyeceğiz.

---

## 🚀 Geliştirme Aşamaları (Yol Haritası)

### Aşama 1: Kurulum ve Temel Yapı
1.  [x] Proje klasöründe Next.js uygulamasının oluşturulması (VScode'a uygun).
2.  [x] Git (versiyon kontrolü) başlatılması ve ilk "commit"in yapılması.
3.  [x] Gerekli kütüphanelerin kurulması.
4.  [x] Spotify ve Google Cloud (YouTube) Developer konsollarından API anahtarlarının alınması.

### Aşama 2: API Entegrasyonları ve Kimlik Doğrulama
1.  [x] Spotify OAuth 2.0 entegrasyonu (Kullanıcının "Spotify ile Giriş Yap" butonuna basması).
2.  [x] YouTube (Google) OAuth 2.0 entegrasyonu ("YouTube ile Giriş Yap").
3.  [x] Kullanıcının Spotify çalma listelerini çeken fonksiyonun yazılması.

### Aşama 3: Çekirdek Mantık (Dönüştürme İşlemi)
1.  [x] Kullanıcının seçtiği Spotify çalma listesindeki şarkıların listelenmesi (ve albüm desteği).
2.  [x] Her bir şarkı adı ve sanatçısının YouTube'da aratılması (Paralel 5x işlem motoru).
3.  [x] YouTube hesabında yeni bir çalma listesi oluşturulması.
4.  [x] Bulunan YouTube videolarının bu yeni çalma listesine eklenmesi.

### Aşama 4: Arayüz (UI/UX) ve Hata Yönetimi
1.  [x] Modern, karanlık tema (Dark mode) destekli, şık bir arayüz tasarımı.
2.  [x] Dönüşüm sırasında kullanıcıya ilerleme çubuğu (Progress bar) gösterilmesi.
3.  [x] Profil sayfası, çalma listesi modal önizlemesi ve oturum yönetimi (Bağlantıyı Kes).

### Aşama 5: Masaüstü ve Mobil Sürümler
1.  [ ] Tauri entegrasyonu ile uygulamanın `.exe` formatında derlenmesi.
2.  [ ] Capacitor kurularak mobil testlerin yapılması.

---

## 💻 VSCode ve GitHub Süreci
*   Proje kodlarını tamamen VSCode yapısına uygun oluşturacağım.
*   Önemli aşamaları tamamladıkça Terminal üzerinden `git add .`, `git commit -m "mesaj"` komutlarıyla değişiklikleri kaydedeceğiz.
*   Siz GitHub'da boş bir repo açtığınızda kodu doğrudan oraya göndereceğiz (Push).
