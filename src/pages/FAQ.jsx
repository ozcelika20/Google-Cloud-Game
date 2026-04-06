import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const sections = [
  {
    title: 'Oyun Hakkında',
    items: [
      {
        q: 'Ödüller neler?',
        a: '1.–2. sıraya giren katılımcılar yurt dışı konferans katılım hakkı kazanır. 3.–8. sıra arasındaki katılımcılar arasından çekiliş ile 1 kişiye yurt dışı konferans hakkı verilir. Ödül almak için en az 1 sertifika almış olmak zorunludur.',
      },
    ],
  },
  {
    title: 'Puan Sistemi',
    items: [
      {
        q: 'Temel puanlar nasıl hesaplanır?',
        a: 'Her tamamlanan course veya lab 20 puan kazandırır. Foundational ve Associate sertifikalar 150 puan, Professional sertifikalar ise 500 puan değerindedir.',
      },
      {
        q: 'Hangi sertifikalar hangi kategoriye girer?',
        a: `Foundational: Cloud Digital Leader, Generative AI Leader (150 puan).
Associate: Cloud Engineer, Google Workspace Administrator, Data Practitioner (150 puan).
Professional: Cloud Architect, Cloud Database Engineer, Cloud Developer, Data Engineer, Cloud DevOps Engineer, Cloud Security Engineer, Cloud Network Engineer, Machine Learning Engineer, Security Operations Engineer (500 puan).`,
      },
      {
        q: 'Seviye sistemi nasıl çalışır?',
        a: `Toplam puana göre unvan belirlenir:
• 0–150 puan → ☁️ Cloud Explorer
• 151–350 puan → 🌤️ Cloud Ranger
• 351–750 puan → ⚡ Cloud Ninja
• 751+ puan → 🏆 Cloud Master`,
      },
    ],
  },
  {
    title: 'Bonus Sistemi',
    items: [
      {
        q: 'Kusursuz Birlik bonusu nasıl kazanılır?',
        a: 'Bir takımdaki tüm üyeler en az 1 course veya lab tamamladığında, o takımdaki her üyeye +25 puan eklenir. Tek bir üyenin bile 0 aktivitesi olması bonusu tüm takım için engeller.',
      },
      {
        q: 'Bulut Ordusu bonusu nasıl kazanılır?',
        a: 'Bir takımdaki tüm üyeler en az 1 sertifika aldığında, o takımdaki her üyeye +100 puan eklenir. Her iki bonus (Kusursuz Birlik + Bulut Ordusu) aynı anda aktif olabilir; bu durumda toplam +125 puan eklenir.',
      },
      {
        q: 'İstikrar Puanı nedir ve nasıl tetiklenir?',
        a: 'Bir katılımcının bu ayki puanı, önceki aya kıyasla %50 veya daha fazla artmışsa, o ayki toplam puan ×1.2 ile çarpılır. Bu çarpan sadece ardışık aylar arasında geçerlidir (örneğin Ocak→Şubat). Önceki ay puanı 0 ise çarpan uygulanmaz.',
      },
      {
        q: 'Manager bonusu nasıl çalışır?',
        a: 'Bir Manager 1 Mart 2026 sonrasında sertifika aldığında, o tarihteki sertifika tarihinden itibaren 14 gün boyunca kendi takımındaki tüm üyelerin course/lab/sertifika aktiviteleri ×1.5 çarpanla hesaplanır. Çarpan aktivite başına ayrı ayrı uygulanır.',
      },
      {
        q: 'Direktör bonusu Manager\'dan farkı nedir?',
        a: 'Direktör bonusu Manager bonusuyla aynı mekanizmayı kullanır; tek farkı etkinin tüm takımları kapsamasıdır. Manager yalnızca kendi takımını etkilerken, Direktör tüm katılımcıları etkiler.',
      },
      {
        q: 'Birden fazla bonus penceresi aynı anda aktifse ne olur?',
        a: `Çarpanlar kümülatif olarak uygulanır: her aktif pencere için ayrı ×1.5 hesaplanır.
• 1 pencere → floor(20 × 1.5) = 30 puan
• 2 pencere → floor(floor(20 × 1.5) × 1.5) = 45 puan
• 3 pencere → floor(floor(floor(20 × 1.5) × 1.5) × 1.5) = 67 puan`,
      },
      {
        q: 'Bonus hesaplama sırası nedir?',
        a: `Bonuslar aşağıdaki sırayla uygulanır:
1. Course/Lab puanları (Manager çarpanı dahil)
2. Sertifika puanları (Manager çarpanı dahil)
3. İstikrar Puanı (×1.2 toplam üzerine)
4. Takım bonusları (+25 Kusursuz Birlik / +100 Bulut Ordusu sabit olarak eklenir)`,
      },
      {
        q: 'Direktörler takım bonuslarından (Kusursuz Birlik, Bulut Ordusu) yararlanır mı?',
        a: 'Hayır. Direktörlerin teamId değeri null olduğundan teamMembers listesi boş kalır ve bu iki bonus direktöre uygulanmaz.',
      },
    ],
  },
  {
    title: 'Test Senaryoları',
    items: [
      {
        q: 'Tüm üyeler aktiftir — beklenen sonuç?',
        a: `Ali (2 course), Ayşe (1 course), Can (3 course) içeren bir takımda Kusursuz Birlik tetiklenir:
  coursePoints (Ali) = 2 × 20 = 40
  total = 40 + 25 (Kusursuz Birlik) = 65 puan
Her üye +25 bonus alır.`,
      },
      {
        q: 'Kusursuz Birlik + Bulut Ordusu aynı anda nasıl hesaplanır?',
        a: `Ali (2 course + 1 Associate) için:
  coursePoints = 2 × 20 = 40
  certPoints   = 150
  total = 190 + 25 (Kusursuz Birlik) + 100 (Bulut Ordusu) = 315 puan
Her iki bonus birlikte uygulanır (+125 toplam).`,
      },
      {
        q: 'İstikrar Puanı tetiklenme örneği',
        a: `Önceki ay: 100 puan, Bu ay: 150 puan → 150 ≥ 100 × 1.5 → Koşul SAĞLANDI
  total = floor(150 × 1.2) = 180 puan
Tam %50 artış çarpanı tetikler.`,
      },
      {
        q: 'Manager bonus penceresinde aktivite',
        a: `Manager sertifika tarihi: 2026-04-01 → Bonus penceresi: 2026-04-01..2026-04-15
Üye aktivite tarihi: 2026-04-10 (pencere içi)
  base = 20, n = 1 aktif pencere
  floor(20 × 1.5) = 30 puan (normal 20 yerine)`,
      },
      {
        q: 'Tüm bonuslar aynı anda aktifse?',
        a: `Katılımcı: 2 course (2 aktif pencerede) + 1 Associate (1 aktif pencerede) + İstikrar tetikli + Kusursuz Birlik + Bulut Ordusu aktif:
  kurs 1: floor(floor(20×1.5)×1.5) = 45
  kurs 2: 45 → coursePoints = 90
  certPoints: floor(150×1.5) = 225
  total = 90 + 225 = 315
  İstikrar: floor(315 × 1.2) = 378
  Takım bonusları: 378 + 25 + 100 = 503 puan`,
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: '#DADCE0' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span className="font-medium text-sm" style={{ color: '#202124', lineHeight: 1.5 }}>{q}</span>
        {open
          ? <ChevronUp size={16} style={{ color: '#5F6368', flexShrink: 0, marginTop: 2 }} />
          : <ChevronDown size={16} style={{ color: '#5F6368', flexShrink: 0, marginTop: 2 }} />
        }
      </button>
      {open && (
        <div
          className="pb-4 text-sm"
          style={{ color: '#5F6368', lineHeight: 1.7, whiteSpace: 'pre-line' }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: '#202124' }}>Sık Sorulan Sorular</h1>
        <p className="text-sm" style={{ color: '#5F6368' }}>
          Game of Clouds kuralları, puan sistemi ve bonus mekanizmaları hakkında merak ettiğiniz her şey.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map(section => (
          <div
            key={section.title}
            className="rounded-xl"
            style={{ border: '1px solid #DADCE0', background: '#FFFFFF', overflow: 'hidden' }}
          >
            <div
              className="px-5 py-3"
              style={{ borderBottom: '1px solid #DADCE0', background: '#F8F9FA' }}
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5F6368' }}>
                {section.title}
              </h2>
            </div>
            <div className="px-5">
              {section.items.map(item => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
