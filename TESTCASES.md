# Game of Clouds — Bonus Sistemi Test Senaryoları

Temel referans değerleri:
- Course / Lab: **20 puan**
- Foundational / Associate sertifika: **150 puan**
- Professional sertifika: **500 puan**

Bonus hesaplama sırası (kodda uygulanan sıra):
1. Course / Lab puanları (manager çarpanı dahil)
2. Sertifika puanları (manager çarpanı dahil)
3. İstikrar Puanı (×1.2 toplam üzerine)
4. Takım bonusları (+25 / +100 sabiti olarak eklenir)

---

## 1. Kusursuz Birlik (+25)

Koşul: Takımdaki **tüm** üyeler en az 1 course veya lab tamamlamış olmalıdır.

---

### TC-KB-01 — Tetiklenme: Tüm üyeler aktif

| # | Katılımcı | coursesLabs | Beklenen Bonus |
|---|-----------|-------------|----------------|
| A | Ali       | 2           | +25            |
| B | Ayşe      | 1           | +25            |
| C | Can       | 3           | +25            |

Hesap örneği — Ali (2 course, sertifika yok):
```
coursePoints = 2 × 20 = 40
certPoints   = 0
total        = 40 + 25 (Kusursuz Birlik) = 65
```

**Beklenen:** Her üye +25 bonus alır.

---

### TC-KB-02 — Tetiklenmeme: Bir üye 0 aktivite

| # | Katılımcı | coursesLabs | Beklenen Bonus |
|---|-----------|-------------|----------------|
| A | Ali       | 2           | yok            |
| B | Ayşe      | 0           | yok            |
| C | Can       | 3           | yok            |

**Beklenen:** Ayşe'nin `coursesLabs = 0` olması bonusu tüm takım için engeller.

---

### TC-KB-03 — Sınır değeri: Tam olarak 1 aktivite yeterli

| # | Katılımcı | coursesLabs | Beklenen Bonus |
|---|-----------|-------------|----------------|
| A | Ali       | 1           | +25            |
| B | Ayşe      | 1           | +25            |

**Beklenen:** Minimum eşik (≥1) karşılandığında bonus tetiklenir.

---

## 2. Bulut Ordusu (+100)

Koşul: Takımdaki **tüm** üyeler en az 1 sertifika almış olmalıdır.

---

### TC-BO-01 — Tetiklenme: Tüm üyeler sertifikalı

| # | Katılımcı | Sertifika sayısı | Beklenen Bonus |
|---|-----------|-----------------|----------------|
| A | Ali       | 1 (Associate)   | +100           |
| B | Ayşe      | 2               | +100           |
| C | Can       | 1 (Professional)| +100           |

Hesap örneği — Ali (1 Associate = 150 puan, sertifika bonus penceresi yok):
```
certPoints = 150
total      = 150 + 100 (Bulut Ordusu) = 250
```

**Beklenen:** Her üye +100 bonus alır.

---

### TC-BO-02 — Tetiklenmeme: Bir üye sertifikasız

| # | Katılımcı | Sertifika sayısı | Beklenen Bonus |
|---|-----------|-----------------|----------------|
| A | Ali       | 1               | yok            |
| B | Ayşe      | 0               | yok            |

**Beklenen:** Tek bir üyenin sertifikasız olması bonusu tüm takım için engeller.

---

### TC-BO-03 — Kusursuz Birlik + Bulut Ordusu aynı anda

| # | Katılımcı | coursesLabs | Sertifika |
|---|-----------|-------------|-----------|
| A | Ali       | 2           | 1         |
| B | Ayşe      | 1           | 1         |

Hesap örneği — Ali (2 course + 1 Associate, bonus yok):
```
coursePoints = 40
certPoints   = 150
total        = 190 + 25 (Kusursuz Birlik) + 100 (Bulut Ordusu) = 315
```

**Beklenen:** Her iki bonus birlikte uygulanır (+125 toplam).

---

## 3. İstikrar Puanı (×1.2)

Koşul: Ardışık iki aydaki puan artışı **≥ %50** olmalıdır. Önceki ay puanı > 0 olmalıdır.

---

### TC-IP-01 — Tetiklenme: Tam %50 artış

```
Önceki ay: 100 puan (Mart 2026)
Bu ay:     150 puan (Nisan 2026)  → 150 ≥ 100 × 1.5 → EVET
```

Hesap örneği — toplam puan 150 ise:
```
total = floor(150 × 1.2) = 180
```

**Beklenen:** Toplam ×1.2 ile çarpılır.

---

### TC-IP-02 — Tetiklenme sınırı: %49 artış yeterli değil

```
Önceki ay: 100 puan
Bu ay:     149 puan  → 149 < 150 → HAYIR
```

**Beklenen:** Çarpan uygulanmaz.

---

### TC-IP-03 — Tetiklenmeme: Ardışık olmayan aylar

```
monthlyHistory: [{ month: '2026-01', points: 100 }, { month: '2026-03', points: 200 }]
```

Ocak → Mart ardışık değil (Şubat atlanmış).

**Beklenen:** Çarpan uygulanmaz.

---

### TC-IP-04 — Tetiklenmeme: Önceki ay puanı 0

```
monthlyHistory: [{ month: '2026-03', points: 0 }, { month: '2026-04', points: 200 }]
```

Kod koşulu: `prevEntry.points > 0` sağlanmadığı için çarpan uygulanmaz.

**Beklenen:** Çarpan uygulanmaz.


---

### TC-IP-06 — İstikrar Puanı + Takım bonusları etkileşimi

İstikrar çarpanı **takım bonusları eklenmeden önce** toplam üzerine uygulanır:

```
coursePoints = 100
certPoints   = 0
total        = 100
İstikrar (×1.2) → floor(100 × 1.2) = 120
Kusursuz Birlik (+25) → 120 + 25 = 145
```

**Beklenen:** ×1.2 önce uygulanır, sabit bonuslar sonra eklenir.

---

## 4. Manager Bonusu (aktivite başına ×1.5)

Koşul: Manager, **1 Mart 2026 sonrasında** bir sertifika aldığında, bu sertifikanın tarihinden itibaren **14 gün boyunca** kendi takımındaki üyelerin course/lab/sertifika aktivitelerinin her biri ×1.5 ile çarpılır.

---

### TC-MB-01 — Tetiklenme: Aktivite bonus penceresinde

```
Manager sertifika tarihi: 2026-04-01
Bonus penceresi: 2026-04-01 → 2026-04-15
Üye activite tarihi: 2026-04-10 (pencere içi)
```

Hesap örneği — 1 course (20 puan):
```
base = 20
n    = 1 (bir aktif pencere)
applyManagerMultiplier(20, 1) = floor(20 × 1.5) = 30
```

**Beklenen:** 20 puan yerine 30 puan.

---

### TC-MB-02 — Tetiklenmeme: Aktivite pencere dışında

```
Manager sertifika tarihi: 2026-04-01
Bonus penceresi: 2026-04-01 → 2026-04-15
Üye aktivite tarihi: 2026-04-16 (pencere dışı)
```

**Beklenen:** Normal puan (20) uygulanır.

---

### TC-MB-03 — Sınır: Pencerenin son günü dahil

```
Manager sertifika tarihi: 2026-04-01
Bonus penceresi bitiş: 2026-04-15 (dahil)
Üye aktivite tarihi: 2026-04-15
```

**Beklenen:** ×1.5 uygulanır (`actDate <= endDate`).

---

### TC-MB-04 — Tetiklenmeme: 1 Mart 2026 öncesi sertifika

```
Manager sertifika tarihi: 2026-02-28
MANAGER_BONUS_MIN_DATE  : 2026-03-01
```

**Beklenen:** Bu sertifika bonus penceresi oluşturmaz.

---

### TC-MB-05 — Kapsam: Manager yalnızca kendi takımını etkiler

```
Manager: takım A'da
Üye X  : takım A → ×1.5 alır
Üye Y  : takım B → etkilenmez
```

**Beklenen:** Üye Y normal puan alır.

---

## 5. Direktör Bonusu (aktivite başına ×1.5)

Koşul: Manager bonusuyla aynı mekanizma; fark olarak etki kapsamı **tüm takımları** kapsar.

---

### TC-DB-01 — Kapsam: Direktör tüm takımları etkiler

```
Direktör sertifika tarihi: 2026-04-01
Bonus penceresi: 2026-04-01 → 2026-04-15
```

| Katılımcı | Takım | Aktivite tarihi | Beklenen |
|-----------|-------|----------------|----------|
| Ali       | A     | 2026-04-05     | ×1.5     |
| Ayşe      | B     | 2026-04-10     | ×1.5     |
| Can       | C     | 2026-04-20     | ×1.0 (dışarıda) |

**Beklenen:** Tüm takımlar etkilenir; pencere dışındaki aktiviteler etkilenmez.

---

### TC-DB-02 — Direktör tekil sayılır (email deduplication)

Direktör birden fazla takımda görünse bile (teamIds), aynı sertifika yalnızca **bir kez** bonus penceresi oluşturur.

**Beklenen:** `seenDirectorEmails` kümesi ile tekrar sayılmaz; bonuslar 5× değil 1× hesaplanır.

---

## 6. Kümülatif Çarpan (çoklu pencere)

Her aktif bonus penceresi `applyManagerMultiplier` ile ayrı ayrı uygulanır: `floor(base × 1.5^n)`.

---

### TC-KM-01 — İki Manager penceresinin örtüşmesi

```
Pencere 1: Manager A sertifika tarihi 2026-04-01 → pencere 2026-04-01..14
Pencere 2: Manager B sertifika tarihi 2026-04-05 → pencere 2026-04-05..18
Aktivite : 2026-04-10 (her iki pencerede)
```

1 course (20 puan) için:
```
n = 2
floor(floor(20 × 1.5) × 1.5) = floor(30 × 1.5) = 45
```

**Beklenen:** 20 → 45 puan.

---

### TC-KM-02 — Manager + Direktör aynı anda aktif

```
Manager A penceresi aktif (takım A)
Direktör B penceresi aktif (tüm takımlar)
Takım A üyesinin aktivitesi her iki pencere kapsamında
```

1 course (20 puan) için:
```
n = 2 → floor(floor(20 × 1.5) × 1.5) = 45
```

**Beklenen:** 45 puan.

---

### TC-KM-03 — Üç pencere örtüşmesi

```
n = 3
floor(floor(floor(20 × 1.5) × 1.5) × 1.5)
= floor(floor(30 × 1.5) × 1.5)
= floor(45 × 1.5)
= floor(67.5) = 67
```

**Beklenen:** 20 → 67 puan.

---

## 7. Birleşik Senaryolar

---

### TC-COMBO-01 — Tüm bonuslar aynı anda

Katılımcı: 2 course (her biri 2 aktif pencerede) + 1 Associate sert. (1 aktif pencerede) + Kusursuz Birlik + Bulut Ordusu + İstikrar tetikli

```
coursePoints:
  kurs 1: floor(floor(20 × 1.5) × 1.5) = 45
  kurs 2: floor(floor(20 × 1.5) × 1.5) = 45
  → 90

certPoints:
  Associate: floor(150 × 1.5) = 225

total = 90 + 225 = 315

İstikrar (×1.2):
  floor(315 × 1.2) = 378

Takım bonusları:
  +25 (Kusursuz Birlik)
  +100 (Bulut Ordusu)
  → 378 + 125 = 503
```

**Beklenen:** 503 puan.

---

### TC-COMBO-02 — Manager bonusu + İstikrar birlikte

```
1 course, 1 aktif pencere → floor(20 × 1.5) = 30

İstikrar koşulu sağlanıyor:
  total = 30
  floor(30 × 1.2) = 36

Takım bonusu yok.
```

**Beklenen:** 36 puan.

---

### TC-COMBO-03 — Direktör yalnızca kendi puanını hesaplatmaz

Direktörlerin `teamId: null` olması nedeniyle `teamMembers` listesi boş kalır → Kusursuz Birlik ve Bulut Ordusu bonusları direktöre uygulanmaz.

**Beklenen:** Direktör bu iki bonus için 0 puan alır.

---

## 8. Veri Formatı Uyumluluğu

---

### TC-FMT-01 — Eski sertifika formatı (string)

```js
certificates: ['cloud-digital-leader']
```

`getCertId` string döner → `dateStr = null` → manager bonus penceresi kontrolü atlanır → ×1.0

**Beklenen:** Normal puan; hata yok.

---

### TC-FMT-02 — Yeni sertifika formatı (nesne)

```js
certificates: [{ id: 'cloud-digital-leader', dateCompleted: '2026-04-10' }]
```

`getCertId` `id` alanını döner; `dateStr` pencere kontrolünde kullanılır.

**Beklened:** Aktif pencere varsa ×1.5 uygulanır.

---

### TC-FMT-03 — Legacy integer kurs/lab formatı

```js
courses: 5  // array değil, sayı
labs:    2
```

Fallback kolu devreye girer: `5 × 20 = 100` + `2 × 20 = 40` = 140 puan. Manager çarpanı **uygulanmaz** (tarih bilgisi yok).

**Beklenen:** 140 puan; manager bonusu yok.
