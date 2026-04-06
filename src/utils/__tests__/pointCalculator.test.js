/**
 * pointCalculator.js — Birim Testleri
 * Referans: TESTCASES.md
 *
 * Geçerli sertifika ID'leri (ALL_CERTIFICATES'dan):
 *   cloud-digital-leader → 150 pt (Temel)
 *   cloud-engineer       → 150 pt (Orta / Associate)
 *   cloud-architect      → 500 pt (Profesyonel)
 *
 * Önemli not: `coursesLabs` alanı yalnızca takım bonusu kontrolünde (KB/BO)
 * kullanılır. Puan hesabı `courses` / `labs` dizisinden yapılır.
 * Takım bonuslarını kasıtlı test etmeyen senaryolarda `coursesLabs: 0`
 * set edilir; bu sayede KB/BO bonusu yanlışlıkla tetiklenmez.
 */

import { describe, it, expect } from 'vitest';
import {
  getCertId,
  getManagerBonuses,
  calculateParticipantPoints,
  hasKusursuzBirlik,
  hasBulutOrdusu,
} from '../pointCalculator.js';

// ---------------------------------------------------------------------------
// Test veri yardımcıları
// ---------------------------------------------------------------------------

/** Temel katılımcı şablonu. Üzerine yazılabilir. */
function makeParticipant(overrides = {}) {
  return {
    name: 'Test User',
    email: 'test@example.com',
    teamId: 'TEAM_A',
    role: 'MEMBER',
    courses: [],
    labs: [],
    certificates: [],
    coursesLabs: 0,   // varsayılan 0 → KB/BO yanlışlıkla tetiklenmez
    monthlyHistory: [],
    ...overrides,
  };
}

/** Belirli tarih aralığında el ile oluşturulmuş bonus penceresi. */
function makeBonus(startStr, endStr, teamId = 'TEAM_A', type = 'manager') {
  return {
    type,
    teamId: type === 'director' ? null : teamId,
    managerName: 'Manager',
    certId: 'cloud-engineer',
    startDate: new Date(startStr),
    endDate: new Date(endStr + 'T23:59:59'),
  };
}

/** Aktivite nesnesi. */
const act = (dateCompleted) => ({ dateCompleted });

// ===========================================================================
// 1. Kusursuz Birlik (+25)
// ===========================================================================

describe('1. Kusursuz Birlik (+25)', () => {
  // TC-KB-01: Tüm üyeler aktif
  it('TC-KB-01 — Tüm üyeler ≥1 aktiviteye sahipse her üye +25 alır', () => {
    const ali  = makeParticipant({ name: 'Ali',  coursesLabs: 2, courses: [act('2026-03-10'), act('2026-03-11')] });
    const ayse = makeParticipant({ name: 'Ayşe', coursesLabs: 1, courses: [act('2026-03-10')] });
    const can  = makeParticipant({ name: 'Can',  coursesLabs: 3, courses: [act('2026-03-10'), act('2026-03-11'), act('2026-03-12')] });
    const all  = [ali, ayse, can];

    // Ali: 2×20 = 40 + 25 (KB) = 65
    expect(calculateParticipantPoints(ali, null, all)).toBe(65);
    // Ayşe: 1×20 = 20 + 25 = 45
    expect(calculateParticipantPoints(ayse, null, all)).toBe(45);
    // Can: 3×20 = 60 + 25 = 85
    expect(calculateParticipantPoints(can, null, all)).toBe(85);
  });

  // TC-KB-02: Bir üye 0 aktivite → bonus tetiklenmez
  it('TC-KB-02 — Bir üyenin coursesLabs=0 olması bonusu tüm takım için engeller', () => {
    const ali  = makeParticipant({ name: 'Ali',  coursesLabs: 2, courses: [act('2026-03-10'), act('2026-03-11')] });
    const ayse = makeParticipant({ name: 'Ayşe', coursesLabs: 0 });
    const can  = makeParticipant({ name: 'Can',  coursesLabs: 3, courses: [act('2026-03-10'), act('2026-03-11'), act('2026-03-12')] });
    const all  = [ali, ayse, can];

    expect(calculateParticipantPoints(ali,  null, all)).toBe(40);
    expect(calculateParticipantPoints(ayse, null, all)).toBe(0);
    expect(calculateParticipantPoints(can,  null, all)).toBe(60);
  });

  // TC-KB-03: Tam olarak 1 aktivite yeterli
  it('TC-KB-03 — coursesLabs=1 (minimum eşik) bonusu tetikler', () => {
    const ali  = makeParticipant({ coursesLabs: 1, courses: [act('2026-03-10')] });
    const ayse = makeParticipant({ coursesLabs: 1, courses: [act('2026-03-10')] });
    const all  = [ali, ayse];

    expect(calculateParticipantPoints(ali,  null, all)).toBe(45);  // 20 + 25
    expect(calculateParticipantPoints(ayse, null, all)).toBe(45);
  });

  // hasKusursuzBirlik yardımcı fonksiyonu
  it('hasKusursuzBirlik — tüm üyeler aktifse true döner', () => {
    expect(hasKusursuzBirlik([{ coursesLabs: 1 }, { coursesLabs: 5 }])).toBe(true);
  });

  it('hasKusursuzBirlik — bir üye 0 ise false döner', () => {
    expect(hasKusursuzBirlik([{ coursesLabs: 2 }, { coursesLabs: 0 }])).toBe(false);
  });

  it('hasKusursuzBirlik — boş liste false döner', () => {
    expect(hasKusursuzBirlik([])).toBe(false);
  });
});

// ===========================================================================
// 2. Bulut Ordusu (+100)
// ===========================================================================

describe('2. Bulut Ordusu (+100)', () => {
  // TC-BO-01: Tüm üyeler sertifikalı
  it('TC-BO-01 — Tüm üyeler ≥1 sertifikaya sahipse her üye +100 alır', () => {
    const ali  = makeParticipant({
      coursesLabs: 0,
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-03-01' }],
    });
    const ayse = makeParticipant({
      coursesLabs: 0,
      certificates: [
        { id: 'cloud-engineer',       dateCompleted: '2026-03-01' },
        { id: 'cloud-digital-leader', dateCompleted: '2026-03-05' },
      ],
    });
    const can  = makeParticipant({
      coursesLabs: 0,
      certificates: [{ id: 'cloud-architect', dateCompleted: '2026-03-01' }],
    });
    const all = [ali, ayse, can];

    // Ali: 150 (Associate) + 100 (BO) = 250
    expect(calculateParticipantPoints(ali, null, all)).toBe(250);
    // Can: 500 (Professional) + 100 = 600
    expect(calculateParticipantPoints(can, null, all)).toBe(600);
  });

  // TC-BO-02: Bir üye sertifikasız → bonus tetiklenmez
  it('TC-BO-02 — Bir üyenin sertifikası yoksa bonus tüm takım için engellenir', () => {
    const ali  = makeParticipant({
      coursesLabs: 0,
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-03-01' }],
    });
    const ayse = makeParticipant({ coursesLabs: 0, certificates: [] });
    const all  = [ali, ayse];

    expect(calculateParticipantPoints(ali,  null, all)).toBe(150);  // +100 yok
    expect(calculateParticipantPoints(ayse, null, all)).toBe(0);
  });

  // TC-BO-03: Kusursuz Birlik + Bulut Ordusu aynı anda
  it('TC-BO-03 — Kusursuz Birlik ve Bulut Ordusu birlikte uygulanır (+125)', () => {
    const ali  = makeParticipant({
      coursesLabs: 2,
      courses: [act('2026-03-10'), act('2026-03-11')],
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-03-01' }],
    });
    const ayse = makeParticipant({
      coursesLabs: 1,
      courses: [act('2026-03-10')],
      certificates: [{ id: 'cloud-digital-leader', dateCompleted: '2026-03-05' }],
    });
    const all = [ali, ayse];

    // Ali: (2×20=40) + 150 = 190 + 25 (KB) + 100 (BO) = 315
    expect(calculateParticipantPoints(ali,  null, all)).toBe(315);
    // Ayşe: 20 + 150 = 170 + 25 + 100 = 295
    expect(calculateParticipantPoints(ayse, null, all)).toBe(295);
  });

  // hasBulutOrdusu yardımcı fonksiyonu
  it('hasBulutOrdusu — tüm üyeler sertifikalıysa true döner', () => {
    expect(hasBulutOrdusu([
      { certificates: ['cloud-engineer'] },
      { certificates: ['cloud-architect', 'cloud-digital-leader'] },
    ])).toBe(true);
  });

  it('hasBulutOrdusu — bir üyede sertifika yoksa false döner', () => {
    expect(hasBulutOrdusu([
      { certificates: ['cloud-engineer'] },
      { certificates: [] },
    ])).toBe(false);
  });
});

// ===========================================================================
// 3. İstikrar Puanı (×1.2)
// ===========================================================================

describe('3. İstikrar Puanı (×1.2)', () => {
  // TC-IP-01: Tam %50 artış → çarpan tetiklenir
  it('TC-IP-01 — Tam %50 artış (100→150): floor(total × 1.2) uygulanır', () => {
    const p = makeParticipant({
      // coursesLabs: 0 (varsayılan) → KB tetiklenmez
      courses: [act('2026-04-01'), act('2026-04-02'), act('2026-04-03'),
                act('2026-04-04'), act('2026-04-05'), act('2026-04-06'),
                act('2026-04-07'), act('2026-04-08')],
      monthlyHistory: [
        { month: '2026-03', points: 100 },
        { month: '2026-04', points: 160 },  // 160 >= 150 ✓
      ],
    });
    // 8 × 20 = 160 → floor(160 × 1.2) = 192
    expect(calculateParticipantPoints(p, null, [p])).toBe(192);
  });

  // TC-IP-02: %49 artış → çarpan uygulanmaz
  it('TC-IP-02 — %49 artış (100→149): İstikrar çarpanı uygulanmaz', () => {
    const p = makeParticipant({
      courses: [act('2026-04-01')],
      monthlyHistory: [
        { month: '2026-03', points: 100 },
        { month: '2026-04', points: 149 },  // 149 < 150 → hayır
      ],
    });
    expect(calculateParticipantPoints(p, null, [p])).toBe(20);
  });

  // TC-IP-03: Ardışık olmayan aylar
  it('TC-IP-03 — Ardışık olmayan aylar (Ocak→Mart): çarpan uygulanmaz', () => {
    const p = makeParticipant({
      courses: [act('2026-03-01')],
      monthlyHistory: [
        { month: '2026-01', points: 100 },
        { month: '2026-03', points: 200 },  // Şubat atlanmış
      ],
    });
    expect(calculateParticipantPoints(p, null, [p])).toBe(20);
  });

  // TC-IP-04: Önceki ay puanı 0
  it('TC-IP-04 — Önceki ay puanı 0 ise çarpan uygulanmaz', () => {
    const p = makeParticipant({
      courses: [act('2026-04-01')],
      monthlyHistory: [
        { month: '2026-03', points: 0 },
        { month: '2026-04', points: 200 },
      ],
    });
    expect(calculateParticipantPoints(p, null, [p])).toBe(20);
  });

  // Yıl geçişi: Aralık → Ocak ardışık sayılır
  it('Aralık→Ocak yıl geçişi ardışık kabul edilir → ×1.2 uygulanır', () => {
    const p = makeParticipant({
      courses: [act('2026-01-01')],
      monthlyHistory: [
        { month: '2025-12', points: 10 },
        { month: '2026-01', points: 20 },  // 20 >= 15 ✓
      ],
    });
    // 20 → floor(20 × 1.2) = 24
    expect(calculateParticipantPoints(p, null, [p])).toBe(24);
  });

  // TC-IP-06: İstikrar çarpanı takım bonuslarından önce uygulanır
  it('TC-IP-06 — İstikrar (×1.2) takım bonuslarından önce; KB sonra eklenir', () => {
    // 5 kurs = 100 puan, İstikrar → floor(100×1.2) = 120, KB (+25) → 145
    const p = makeParticipant({
      coursesLabs: 5,  // kasıtlı: KB tetiklensin
      courses: [act('2026-04-01'), act('2026-04-02'), act('2026-04-03'),
                act('2026-04-04'), act('2026-04-05')],
      monthlyHistory: [
        { month: '2026-03', points: 50 },
        { month: '2026-04', points: 100 },  // 100 >= 75 ✓
      ],
    });
    expect(calculateParticipantPoints(p, null, [p])).toBe(145);
  });
});

// ===========================================================================
// 4. Manager Bonusu (aktivite başına ×1.5)
// ===========================================================================

describe('4. Manager Bonusu (×1.5)', () => {
  // TC-MB-01: Aktivite bonus penceresinde → ×1.5
  it('TC-MB-01 — Aktivite bonus penceresinde: 20 → floor(20×1.5) = 30', () => {
    const p = makeParticipant({
      // coursesLabs: 0 → KB tetiklenmez
      courses: [act('2026-04-10')],
    });
    const bonuses = [makeBonus('2026-04-01', '2026-04-15', 'TEAM_A')];
    expect(calculateParticipantPoints(p, null, [p], bonuses)).toBe(30);
  });

  // TC-MB-02: Aktivite pencere dışında → normal puan
  it('TC-MB-02 — Aktivite pencere dışında (2026-04-16): normal 20 puan', () => {
    const p = makeParticipant({
      courses: [act('2026-04-16')],
    });
    const bonuses = [makeBonus('2026-04-01', '2026-04-15', 'TEAM_A')];
    expect(calculateParticipantPoints(p, null, [p], bonuses)).toBe(20);
  });

  // TC-MB-03: Pencerenin son günü dahil
  it('TC-MB-03 — Son gün (2026-04-15) dahil: ×1.5 uygulanır', () => {
    const p = makeParticipant({
      courses: [act('2026-04-15')],
    });
    const bonuses = [makeBonus('2026-04-01', '2026-04-15', 'TEAM_A')];
    expect(calculateParticipantPoints(p, null, [p], bonuses)).toBe(30);
  });

  // TC-MB-04: 1 Mart 2026 öncesi sertifika → bonus penceresi oluşmaz
  it('TC-MB-04 — 2026-02-28 tarihli sertifika bonus penceresi oluşturmaz', () => {
    const manager = makeParticipant({
      role: 'MANAGER',
      teamId: 'TEAM_A',
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-02-28' }],
    });
    expect(getManagerBonuses([manager])).toHaveLength(0);
  });

  // TC-MB-05: Manager yalnızca kendi takımını etkiler
  it('TC-MB-05 — Manager bonusu yalnızca kendi takımındaki üyeleri etkiler', () => {
    const memberA = makeParticipant({ teamId: 'TEAM_A', courses: [act('2026-04-10')] });
    const memberB = makeParticipant({ teamId: 'TEAM_B', courses: [act('2026-04-10')] });
    const bonuses = [makeBonus('2026-04-01', '2026-04-15', 'TEAM_A', 'manager')];

    expect(calculateParticipantPoints(memberA, null, [memberA, memberB], bonuses)).toBe(30); // ×1.5
    expect(calculateParticipantPoints(memberB, null, [memberA, memberB], bonuses)).toBe(20); // etkilenmez
  });
});

// ===========================================================================
// 5. Direktör Bonusu (×1.5 — tüm takımlar)
// ===========================================================================

describe('5. Direktör Bonusu (×1.5)', () => {
  // TC-DB-01: Direktör tüm takımları etkiler
  it('TC-DB-01 — Direktör bonusu penceresindeki tüm takım üyeleri ×1.5 alır', () => {
    const ali  = makeParticipant({ name: 'Ali',  teamId: 'TEAM_A', courses: [act('2026-04-05')] });
    const ayse = makeParticipant({ name: 'Ayşe', teamId: 'TEAM_B', courses: [act('2026-04-10')] });
    const can  = makeParticipant({ name: 'Can',  teamId: 'TEAM_C', courses: [act('2026-04-20')] }); // pencere dışı
    const all  = [ali, ayse, can];
    const bonuses = [makeBonus('2026-04-01', '2026-04-15', null, 'director')];

    expect(calculateParticipantPoints(ali,  null, all, bonuses)).toBe(30);  // ×1.5
    expect(calculateParticipantPoints(ayse, null, all, bonuses)).toBe(30);  // ×1.5
    expect(calculateParticipantPoints(can,  null, all, bonuses)).toBe(20);  // dışarıda
  });

  // TC-DB-02: Direktör email ile tekilleştirilir
  it('TC-DB-02 — Aynı direktörün birden fazla teamId kaydı yalnızca bir pencere oluşturur', () => {
    const director1 = makeParticipant({
      role: 'DIRECTOR',
      email: 'director@example.com',
      teamId: 'TEAM_A',
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-04-01' }],
    });
    const director2 = { ...director1, teamId: 'TEAM_B' }; // aynı kişi, farklı takım

    const bonuses = getManagerBonuses([director1, director2]);
    expect(bonuses).toHaveLength(1);
    expect(bonuses[0].type).toBe('director');
  });
});

// ===========================================================================
// 6. Kümülatif Çarpan (çoklu pencere)
// ===========================================================================

describe('6. Kümülatif Çarpan (çoklu pencere)', () => {
  // TC-KM-01: İki pencere örtüşmesi → 20 → 45
  it('TC-KM-01 — İki manager penceresi örtüşürse: floor(floor(20×1.5)×1.5) = 45', () => {
    const p = makeParticipant({
      teamId: 'TEAM_A',
      courses: [act('2026-04-10')],
    });
    const bonuses = [
      makeBonus('2026-04-01', '2026-04-14', 'TEAM_A'),  // pencere 1
      makeBonus('2026-04-05', '2026-04-18', 'TEAM_A'),  // pencere 2
    ];
    expect(calculateParticipantPoints(p, null, [p], bonuses)).toBe(45);
  });

  // TC-KM-02: Manager + Direktör aynı anda
  it('TC-KM-02 — Manager + Direktör aynı anda: floor(floor(20×1.5)×1.5) = 45', () => {
    const p = makeParticipant({
      teamId: 'TEAM_A',
      courses: [act('2026-04-10')],
    });
    const bonuses = [
      makeBonus('2026-04-01', '2026-04-14', 'TEAM_A', 'manager'),
      makeBonus('2026-04-01', '2026-04-14', null, 'director'),
    ];
    expect(calculateParticipantPoints(p, null, [p], bonuses)).toBe(45);
  });

  // TC-KM-03: Üç pencere örtüşmesi → 67
  it('TC-KM-03 — Üç pencere örtüşmesi: floor(floor(floor(20×1.5)×1.5)×1.5) = 67', () => {
    const p = makeParticipant({
      teamId: 'TEAM_A',
      courses: [act('2026-04-10')],
    });
    const bonuses = [
      makeBonus('2026-04-01', '2026-04-14', 'TEAM_A', 'manager'),
      makeBonus('2026-04-01', '2026-04-14', 'TEAM_A', 'manager'),
      makeBonus('2026-04-01', '2026-04-14', null, 'director'),
    ];
    expect(calculateParticipantPoints(p, null, [p], bonuses)).toBe(67);
  });
});

// ===========================================================================
// 7. Birleşik Senaryolar
// ===========================================================================

describe('7. Birleşik Senaryolar', () => {
  /**
   * TC-COMBO-01: Tüm bonuslar aynı anda → 503
   *
   * Pencere düzeni:
   *   Direktör: 2026-04-01 → 2026-04-14  (sertifika tarihi 2026-04-05'i kapsar)
   *   Manager:  2026-04-08 → 2026-04-21  (kurs tarihleri 2026-04-10'u kapsar)
   *
   * Böylece:
   *   kurs 1 (2026-04-10) → her iki pencerede → n=2 → floor(floor(20×1.5)×1.5) = 45
   *   kurs 2 (2026-04-10) → aynı → 45  →  coursePoints = 90
   *   sertifika (2026-04-05) → yalnızca direktör penceresi → n=1 → floor(150×1.5) = 225
   *   total = 315
   *   İstikrar ×1.2 → floor(315×1.2) = 378
   *   KB +25, BO +100 → 503
   */
  it('TC-COMBO-01 — 2 kurs (2 pencere) + 1 Associate (1 pencere) + KB + BO + İstikrar = 503', () => {
    const p = makeParticipant({
      teamId: 'TEAM_A',
      coursesLabs: 2,  // KB için
      courses: [act('2026-04-10'), act('2026-04-10')],
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-04-05' }],
      monthlyHistory: [
        { month: '2026-03', points: 100 },
        { month: '2026-04', points: 315 },  // 315 >= 150 ✓
      ],
    });
    const teammate = makeParticipant({
      teamId: 'TEAM_A',
      coursesLabs: 1,  // KB için
      courses: [act('2026-04-10')],
      certificates: [{ id: 'cloud-digital-leader', dateCompleted: '2026-04-10' }],
    });
    const all = [p, teammate];
    const bonuses = [
      makeBonus('2026-04-08', '2026-04-21', 'TEAM_A', 'manager'),   // kursları kapsar, sertifikayı kapsamaz
      makeBonus('2026-04-01', '2026-04-14', null, 'director'),       // her ikisini de kapsar
    ];

    expect(calculateParticipantPoints(p, null, all, bonuses)).toBe(503);
  });

  // TC-COMBO-02: Manager bonusu + İstikrar → 36
  it('TC-COMBO-02 — 1 kurs (1 pencere) + İstikrar: floor(floor(20×1.5)×1.2) = 36', () => {
    const p = makeParticipant({
      teamId: 'TEAM_A',
      // coursesLabs: 0 → KB tetiklenmez
      courses: [act('2026-04-10')],
      monthlyHistory: [
        { month: '2026-03', points: 10 },
        { month: '2026-04', points: 30 },  // 30 >= 15 ✓
      ],
    });
    const bonuses = [makeBonus('2026-04-01', '2026-04-14', 'TEAM_A', 'manager')];

    // floor(20×1.5) = 30 → floor(30×1.2) = 36
    expect(calculateParticipantPoints(p, null, [p], bonuses)).toBe(36);
  });

  // TC-COMBO-03: Direktörler (teamId: null) KB/BO bonusu almaz
  it('TC-COMBO-03 — teamId=null olan direktör KB ve BO bonusu almaz', () => {
    const director = makeParticipant({
      role: 'DIRECTOR',
      teamId: null,
      coursesLabs: 1,
      courses: [act('2026-04-10')],
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-04-10' }],
    });
    // teamId: null → teamMembers boş → KB ve BO uygulanmaz
    // 1 kurs (20) + 1 cert (150) = 170
    expect(calculateParticipantPoints(director, null, [director])).toBe(170);
  });
});

// ===========================================================================
// 8. Veri Formatı Uyumluluğu
// ===========================================================================

describe('8. Veri Formatı Uyumluluğu', () => {
  // TC-FMT-01: Eski format (string sertifika) → bonus penceresi oluşmaz
  it('TC-FMT-01 — String sertifika formatı: getManagerBonuses pencere oluşturmaz', () => {
    const manager = makeParticipant({
      role: 'MANAGER',
      teamId: 'TEAM_A',
      certificates: ['cloud-engineer'],  // eski format
    });
    expect(getManagerBonuses([manager])).toHaveLength(0);
  });

  it('TC-FMT-01 — String sertifika formatı: üye aktivitesi normal puan alır', () => {
    const p = makeParticipant({
      teamId: 'TEAM_A',
      // coursesLabs: 0 → KB tetiklenmez
      courses: [act('2026-04-10')],
    });
    expect(calculateParticipantPoints(p, null, [p], [])).toBe(20);
  });

  // TC-FMT-02: Yeni format (nesne sertifika) → bonus penceresi oluşur, aktiviteye ×1.5
  it('TC-FMT-02 — Nesne sertifika formatı: aktif pencerede ×1.5 uygulanır', () => {
    const manager = makeParticipant({
      role: 'MANAGER',
      email: 'mgr@example.com',
      teamId: 'TEAM_A',
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-04-01' }],
    });
    const member = makeParticipant({
      teamId: 'TEAM_A',
      // coursesLabs: 0 → KB tetiklenmez
      courses: [act('2026-04-10')],
    });
    const bonuses = getManagerBonuses([manager]);
    expect(bonuses).toHaveLength(1);
    expect(calculateParticipantPoints(member, null, [member], bonuses)).toBe(30);
  });

  // TC-FMT-03: Legacy integer kurs/lab formatı → manager bonusu uygulanmaz
  it('TC-FMT-03 — Integer kurs/lab formatı: puan hesaplanır, manager bonusu uygulanmaz', () => {
    const p = makeParticipant({
      courses: 5,  // integer (legacy)
      labs: 2,     // integer (legacy)
      coursesLabs: 0,  // KB tetiklenmez
    });
    const bonuses = [makeBonus('2026-04-01', '2026-04-14', 'TEAM_A', 'manager')];

    // Fallback: 5×20 + 2×20 = 100 + 40 = 140 (tarih bilgisi yok → manager bonusu yok)
    expect(calculateParticipantPoints(p, null, [p], bonuses)).toBe(140);
  });
});

// ===========================================================================
// getCertId — yardımcı fonksiyon
// ===========================================================================

describe('getCertId', () => {
  it('string format → string döner', () => {
    expect(getCertId('cloud-engineer')).toBe('cloud-engineer');
  });

  it('nesne format → id alanını döner', () => {
    expect(getCertId({ id: 'cloud-architect', dateCompleted: '2026-04-01' })).toBe('cloud-architect');
  });
});

// ===========================================================================
// getManagerBonuses — pencere hesaplama
// ===========================================================================

describe('getManagerBonuses', () => {
  it('2026-03-01 sonrası sertifika 14 günlük pencere oluşturur', () => {
    const manager = makeParticipant({
      role: 'MANAGER',
      email: 'mgr@example.com',
      teamId: 'TEAM_A',
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-03-01' }],
    });
    const bonuses = getManagerBonuses([manager]);
    expect(bonuses).toHaveLength(1);
    expect(bonuses[0].type).toBe('manager');
    expect(bonuses[0].teamId).toBe('TEAM_A');
    expect(bonuses[0].startDate).toEqual(new Date('2026-03-01'));
    expect(bonuses[0].endDate.toDateString()).toBe(new Date('2026-03-15').toDateString());
  });

  it('Katılımcılar listesi boşsa boş dizi döner', () => {
    expect(getManagerBonuses([])).toHaveLength(0);
  });

  it('MEMBER rolü bonus penceresi oluşturmaz', () => {
    const member = makeParticipant({
      role: 'MEMBER',
      certificates: [{ id: 'cloud-engineer', dateCompleted: '2026-04-01' }],
    });
    expect(getManagerBonuses([member])).toHaveLength(0);
  });
});
