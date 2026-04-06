# ☁️ Game Of Clouds Dashboard

75 kişilik, 5 takımlı Google Cloud sertifikasyon yarışmasını takip etmek için geliştirilmiş modern React dashboard uygulaması.

---

## ✨ Özellikler

- **Gerçek Zamanlı Geri Sayım** — 30 Kasım 2026 bitiş tarihine canlı sayaç
- **Takım Puan Tablosu** — 5 takımın anlık sıralaması ve istatistikleri
- **Bireysel Liderboard** — Filtrelenebilir/aranabilir tam sıralama; aylık sıralama modu ve tarih görünümü toggle
- **Eşit Sıralama** — Aynı puana sahip kişilere aynı sıra numarası gösterilir
- **Seviye Sistemi** — ☁️ Explorer → 🌤️ Ranger → ⚡ Ninja → 🏆 Master
- **Bonus Motoru** — Kusursuz Birlik, Bulut Ordusu, İstikrar Puanı + yönetim paneli kuralları + Manager/Direktör bonusları
- **Manager/Direktör Bonusu** — Manager veya Direktörün sertifika almasından sonraki 14 gün içindeki aktiviteler ×1.5 çarpanla hesaplanır; Home sayfasında aktif bonuslar banner olarak gösterilir
- **Responsive Tasarım** — Desktop sidebar + mobil alt navigasyon

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
npm install
npm run dev
```

Tarayıcıda `http://localhost:5173/Google-Cloud-Game/` adresini aç.

---

## 📋 Komutlar

```bash
npm run dev           # Geliştirme sunucusunu başlat
npm run sync          # Excel → participants.json dönüşümü
npm run sync:deploy   # Excel → JSON + production build
npm run build         # Production build (dist/ klasörüne)
npm run preview       # Production build'i önizle
```

> Excel sync için `syncExcel.cjs` kullanılır. Kaynak: `/Users/ayse/Desktop/All In One/GAMEOFCLOUDS/DATA/`

---

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── layout/          # Sidebar, Header, MobileNav, Layout
│   ├── common/          # Badge, ProgressBar, StatCard, CountdownTimer, BonusBanner
│   ├── charts/          # TeamScoreChart, MonthlyProgressChart, LevelDistributionChart
│   ├── cards/           # TeamCard, ParticipantCard, CertificateCard
│   └── tables/          # LeaderboardTable, TeamMembersTable
├── pages/
│   ├── Home.jsx               # /               — Genel bakış + ManagerBonusBanners
│   ├── Leaderboard.jsx        # /leaderboard    — Tam sıralama (aylık mod + tarih toggle)
│   ├── TeamDetail.jsx         # /team/:id       — Takım detayı
│   ├── ParticipantProfile.jsx # /participant/:id — Bireysel profil
│   ├── Certificates.jsx       # /certificates   — Sertifika takibi
│   └── Admin.jsx              # /admin          — Yönetim paneli
├── context/
│   └── CompetitionContext.jsx  # Global state (manager bonusları dahil)
├── utils/
│   ├── pointCalculator.js      # Puan & kural hesaplama; getManagerBonuses, getActiveManagerBonuses
│   ├── titleResolver.js        # Puana göre ünvan belirleme
│   └── helpers.js              # Genel yardımcı fonksiyonlar; isInTeam
├── hooks/
│   └── useCompetition.js       # Context hook
└── data/
    ├── mockData.js             # Sabit tanımlar (takımlar, sertifikalar)
    └── participants.json       # Excel'den üretilen katılımcı verisi (role, teamIds alanları dahil)
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

| Puan | Ünvan |
|------|-------|
| 0 – 150 | ☁️ Cloud Explorer |
| 151 – 350 | 🌤️ Cloud Ranger |
| 351 – 750 | ⚡ Cloud Ninja |
| 751+ | 🏆 Cloud Master |

---

## 🎯 Bonus Sistemi

### Takım Bonusları

| Bonus | Koşul | Etki |
|-------|-------|------|
| **Kusursuz Birlik** | Takımın tüm üyeleri ≥1 course/lab | Herkese +25 puan |
| **Bulut Ordusu** | Takımın tüm üyeleri ≥1 sertifika | Herkese +100 puan |

### Bireysel Bonuslar

| Bonus | Koşul | Etki |
|-------|-------|------|
| **İstikrar Puanı** | Önceki aya göre %50+ artış (ardışık ay) | O ayki puanlar ×1.2 |

### Manager / Direktör Bonusu

Bir **Manager** veya **Direktör** 1 Mart 2026 sonrasında sertifika aldığında, sertifika tarihinden itibaren **14 gün boyunca** ekip üyelerinin aktiviteleri bonuslu hesaplanır:

| Rol | Kapsam | Etki |
|-----|--------|------|
| **Manager** | Kendi takımı | Aktivite başına ×1.5 |
| **Direktör** | Tüm takımlar | Aktivite başına ×1.5 |

> Birden fazla bonus penceresi aynı anda aktifse çarpanlar kümülatif olarak uygulanır (her pencere için ayrı ×1.5). Aktif bonuslar Home sayfasında **ManagerBonusBanners** olarak gösterilir.

### Yönetim Kuralları

| Bonus | Koşul | Etki |
|-------|-------|------|
| **Yönetim Kuralları** | Admin panelinden aktif edilen kurallar | Seçilen kapsam için +%20/50/100/200 |

---

## 🏆 Ödüller

| Sıra | Ödül |
|------|------|
| 1. – 2. | Yurt dışı konferans katılımı |
| 3. – 8. | Çekiliş ile 1 kişiye yurt dışı konferans |

> ⚠️ Ödül almak için en az **1 sertifika** almış olmak zorunludur.

---

## 🔐 Yönetim Paneli

`/admin` adresine doğrudan gidin (menüde görünmez).

> Şifre: **Adminayse123**

Panel özellikleri:
- Özel bonus kuralı ekleme (kapsam, çarpan, tarih aralığı)
- Aktif kurallar dashboard'da banner olarak gösterilir
- Katılımcı rolü (PARTICIPANT / MANAGER / DIRECTOR) ve takım atamaları `syncExcel.cjs` üzerinden Excel'den okunur

---

## 📄 Lisans

MIT
