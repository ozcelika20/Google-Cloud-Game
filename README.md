# ☁️ Google Cloud Sertifikasyon Yarışması Dashboard

220 kişilik, 5 takımlı Google Cloud sertifikasyon yarışmasını takip etmek için geliştirilmiş modern, koyu temalı React dashboard uygulaması.

---

## 🖼️ Ekran Görüntüleri

> Ana Sayfa · Sıralama · Takım Detayı · Profil · Sertifikalar · Yönetim Paneli

---

## ✨ Özellikler

- **Gerçek Zamanlı Geri Sayım** — 30 Kasım 2026 bitiş tarihine canlı sayaç
- **Takım Puan Tablosu** — 5 takımın anlık sıralaması ve istatistikleri
- **Bireysel Liderboard** — 220 katılımcının filtrelenebilir/aranabilir tam sıralaması
- **Seviye Sistemi** — ☁️ Explorer → 🌤️ Ranger → ⚡ Ninja → 🏆 Master
- **Bonus Motoru** — Kusursuz Birlik, Bulut Ordusu, İstikrar Puanı, Patron Çıldırdı, Çifte Puan
- **Yönetim Paneli** — Bonus aktif/pasif yönetimi, katılımcı ekleme/düzenleme
- **Responsive Tasarım** — Desktop sidebar + mobil alt navigasyon
- **Dark Mode** — Google Cloud renk paletine uyumlu koyu tema

---

## 🛠️ Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | React 19 + Vite 8 |
| Stil | Tailwind CSS 4 |
| Grafikler | Recharts 3 |
| Routing | React Router DOM 7 |
| State | React Context API |
| İkonlar | Lucide React |

---

## 🚀 Kurulum

```bash
# Projeyi klonla
git clone https://github.com/kullanici-adi/gcp-dashboard.git
cd gcp-dashboard

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini aç.

### Diğer Komutlar

```bash
npm run build    # Production build (dist/ klasörüne)
npm run preview  # Production build'i önizle
npm run lint     # ESLint çalıştır
```

---

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── layout/          # Sidebar, Header, MobileNav, Layout
│   ├── common/          # Badge, ProgressBar, StatCard, CountdownTimer, BonusBanner
│   ├── charts/          # TeamScoreChart, MonthlyProgressChart, LevelDistributionChart, CertificateHeatmap
│   ├── cards/           # TeamCard, ParticipantCard, CertificateCard, CharacterCard
│   └── tables/          # LeaderboardTable, TeamMembersTable
├── pages/
│   ├── Home.jsx          # /          — Genel bakış
│   ├── Leaderboard.jsx   # /leaderboard — Tam sıralama
│   ├── TeamDetail.jsx    # /team/:id  — Takım detayı
│   ├── ParticipantProfile.jsx # /participant/:id — Bireysel profil
│   ├── Certificates.jsx  # /certificates — Sertifika takibi
│   └── Admin.jsx         # /admin     — Yönetim paneli
├── context/
│   └── CompetitionContext.jsx  # Global state
├── services/
│   └── api.js            # Soyutlanmış veri katmanı (ileride gerçek API'ye bağlanır)
├── utils/
│   ├── pointCalculator.js  # Puan & bonus hesaplama mantığı
│   ├── titleResolver.js    # Puana göre ünvan belirleme
│   └── helpers.js          # Genel yardımcı fonksiyonlar
├── hooks/
│   └── useCompetition.js   # Context hook
└── data/
    └── mockData.js         # 220 kişilik mock veri + sabit tanımlar
```

---

## 📊 Puan Sistemi

### Temel Puanlar

| Aktivite | Puan |
|----------|------|
| Course / Lab tamamlama | 20 |
| Foundational Sertifika | 150 |
| Associate Sertifika | 150 |
| Professional Sertifika | 500 |

### Sertifikalar

**Foundational:** Cloud Digital Leader, Generative AI Leader
**Associate:** Cloud Engineer, Google Workspace Administrator, Data Practitioner
**Professional:** Cloud Architect, Cloud Database Engineer, Cloud Developer, Data Engineer, Cloud DevOps Engineer, Cloud Security Engineer, Cloud Network Engineer, Machine Learning Engineer, Security Operations Engineer

### Seviye Sistemi

| Puan | Ünvan | |
|------|-------|-|
| 0 – 150 | Cloud Explorer | ☁️ |
| 151 – 350 | Cloud Ranger | 🌤️ |
| 351 – 750 | Cloud Ninja | ⚡ |
| 751+ | Cloud Master | 🏆 |

---

## 🎯 Bonus Sistemi

| Bonus | Koşul | Etki |
|-------|-------|------|
| **Kusursuz Birlik** | Takımın tüm üyeleri ≥1 course/lab | Herkese +25 puan |
| **Bulut Ordusu** | Takımın tüm üyeleri ≥1 sertifika | Herkese +100 puan |
| **İstikrar Puanı** | Önceki aya göre %50+ artış | O ayki puanlar ×1.2 |
| **Patron Çıldırdı** | Admin aktif eder (tarih aralığı) | Tüm kazanımlar +%50 |
| **Çifte Puan** | Admin aktif eder (son 45 gün) | Sertifika puanları ×2 |

---

## 🏆 Ödüller

| Sıra | Ödül |
|------|------|
| 1. – 2. | Yurt dışı konferans katılımı |
| 3. – 8. | Çekiliş ile 1 kişiye yurt dışı konferans |

> ⚠️ Ödül almak için en az **1 sertifika** almış olmak zorunludur.
> 📌 Yarışma öncesi alınmış sertifikalar puanlara dahil edilir.

---

## 🔐 Yönetim Paneli

`/admin` sayfasına erişim için giriş şifresi gereklidir.

> Varsayılan şifre: **admin123**

Panel özellikleri:
- Patron Çıldırdı ve Çifte Puan bonuslarını tarih aralığı ile aktif etme
- Manuel katılımcı ekleme ve düzenleme
- Yarışma tarihi yönetimi

---

## 🎨 Renk Paleti

```
Arka Plan:       #0F1117
Kart:            #1A1D2E
Kart Çerçeve:    #2A2D3E
Google Mavi:     #4285F4  (MSE)
Google Yeşil:    #34A853  (WSE)
Google Sarı:     #FBBC04  (DCBE)
Google Kırmızı:  #EA4335  (ECBE)
Mor:             #A142F4  (DPM)
```

---

## 🔄 Gerçek API'ye Geçiş

Mock veri `src/data/mockData.js` içindedir. Gerçek bir backend'e bağlanmak için yalnızca `src/services/api.js` dosyasını güncelle — tüm sayfalar bu servis katmanı üzerinden veri alır.

```js
// src/services/api.js — endpoint'leri buraya ekle
export const getParticipants = () => fetch('/api/participants').then(r => r.json());
export const getTeams = ()        => fetch('/api/teams').then(r => r.json());
```

---

## 📄 Lisans

MIT
