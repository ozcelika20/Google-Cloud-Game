// Mock Data for Google Cloud Certification Competition

export const TEAMS = [
  { id: 'MSE', name: 'MSE', color: '#4285F4', fullName: 'Makine & Sistem Mühendisliği' },
  { id: 'WSE', name: 'WSE', color: '#34A853', fullName: 'Web & Yazılım Mühendisliği' },
  { id: 'DCBE', name: 'DCBE', color: '#FBBC04', fullName: 'Veri & Bulut İş Ortağı' },
  { id: 'ECBE', name: 'ECBE', color: '#EA4335', fullName: 'Kurumsal Bulut İş Ortağı' },
  { id: 'DPM', name: 'DPM', color: '#A142F4', fullName: 'Dijital Ürün Yönetimi' },
];

export const CERTIFICATES = {
  foundational: [
    { id: 'cloud-digital-leader', name: 'Cloud Digital Leader', points: 150, level: 'Temel' },
    { id: 'gen-ai-leader', name: 'Generative AI Leader', points: 150, level: 'Temel' },
  ],
  associate: [
    { id: 'cloud-engineer', name: 'Cloud Engineer', points: 150, level: 'Orta' },
    { id: 'workspace-admin', name: 'Google Workspace Administrator', points: 150, level: 'Orta' },
    { id: 'data-practitioner', name: 'Data Practitioner', points: 150, level: 'Orta' },
  ],
  professional: [
    { id: 'cloud-architect', name: 'Cloud Architect', points: 500, level: 'Profesyonel' },
    { id: 'cloud-db-engineer', name: 'Cloud Database Engineer', points: 500, level: 'Profesyonel' },
    { id: 'cloud-developer', name: 'Cloud Developer', points: 500, level: 'Profesyonel' },
    { id: 'data-engineer', name: 'Data Engineer', points: 500, level: 'Profesyonel' },
    { id: 'cloud-devops', name: 'Cloud DevOps Engineer', points: 500, level: 'Profesyonel' },
    { id: 'cloud-security', name: 'Cloud Security Engineer', points: 500, level: 'Profesyonel' },
    { id: 'cloud-network', name: 'Cloud Network Engineer', points: 500, level: 'Profesyonel' },
    { id: 'ml-engineer', name: 'Machine Learning Engineer', points: 500, level: 'Profesyonel' },
    { id: 'security-ops', name: 'Security Operations Engineer', points: 500, level: 'Profesyonel' },
  ],
};

export const ALL_CERTIFICATES = [
  ...CERTIFICATES.foundational,
  ...CERTIFICATES.associate,
  ...CERTIFICATES.professional,
];

const TURKISH_FIRST_NAMES = [
  'Ahmet', 'Mehmet', 'Mustafa', 'Ali', 'Emre', 'Burak', 'Can', 'Cem', 'Deniz', 'Enes',
  'Fatma', 'Ayşe', 'Zeynep', 'Elif', 'Merve', 'Selin', 'Büşra', 'Esra', 'Gül', 'Hande',
  'Hasan', 'Hüseyin', 'İbrahim', 'İsmail', 'Kemal', 'Levent', 'Murat', 'Onur', 'Ömer', 'Serkan',
  'Soner', 'Tayfun', 'Tolga', 'Ufuk', 'Volkan', 'Yusuf', 'Zafer', 'Barış', 'Caner', 'Doruk',
  'Erkan', 'Fikret', 'Güven', 'Haluk', 'Ilgaz', 'Koray', 'Leyla', 'Naz', 'Pınar', 'Rüya',
  'Sibel', 'Tuba', 'Ülkü', 'Vildan', 'Yasemin', 'Aslı', 'Bahar', 'Ceren', 'Derya', 'Duygu',
  'Ecem', 'Filiz', 'Gamze', 'Hatice', 'Iraz', 'Jale', 'Kübra', 'Lale', 'Mine', 'Nur',
  'Ozan', 'Pelin', 'Rabia', 'Şeyma', 'Tuğba', 'Ümit', 'Yağmur', 'Zülal', 'Alper', 'Berkay',
  'Cenk', 'Dogan', 'Egemen', 'Ferhat', 'Gökhan', 'Harun', 'Irfan', 'Kaan', 'Melih', 'Nihat',
];

const TURKISH_LAST_NAMES = [
  'Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Doğan', 'Kılıç', 'Arslan', 'Taş', 'Aydın',
  'Özdemir', 'Arslan', 'Doğru', 'Erdoğan', 'Güler', 'Koç', 'Kurt', 'Öztürk', 'Polat', 'Sarı',
  'Türk', 'Uçar', 'Yıldız', 'Zengin', 'Akçay', 'Balcı', 'Ceylan', 'Duman', 'Ekinci', 'Fidan',
  'Güneş', 'Hazar', 'Işık', 'Kara', 'Lale', 'Mert', 'Narin', 'Oral', 'Pektaş', 'Rüzgar',
  'Solmaz', 'Tekin', 'Uzun', 'Vardar', 'Yaman', 'Zorlu', 'Akın', 'Bayrak', 'Çiçek', 'Eroğlu',
];

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function generateMonthlyHistory(basePoints, rng) {
  const months = ['Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat', 'Mart'];
  let cumulative = 0;
  return months.map((month, i) => {
    const monthlyGain = Math.floor(rng() * (basePoints / 3)) + Math.floor(basePoints / 10);
    cumulative += monthlyGain;
    return { month, points: Math.min(cumulative, basePoints) };
  });
}

function generateParticipant(id, teamId, seed) {
  const rng = seededRandom(seed);
  const firstName = TURKISH_FIRST_NAMES[Math.floor(rng() * TURKISH_FIRST_NAMES.length)];
  const lastName = TURKISH_LAST_NAMES[Math.floor(rng() * TURKISH_LAST_NAMES.length)];

  // Distribute points: 40% Explorer (0-150), 30% Ranger (151-350), 20% Ninja (351-750), 10% Master (751+)
  const tierRoll = rng();
  let targetPoints;
  if (tierRoll < 0.40) {
    targetPoints = Math.floor(rng() * 150);
  } else if (tierRoll < 0.70) {
    targetPoints = 151 + Math.floor(rng() * 199);
  } else if (tierRoll < 0.90) {
    targetPoints = 351 + Math.floor(rng() * 399);
  } else {
    targetPoints = 751 + Math.floor(rng() * 500);
  }

  // Generate certificates
  const earnedCerts = [];
  let certPoints = 0;
  const availableCerts = [...ALL_CERTIFICATES];

  for (const cert of availableCerts) {
    if (certPoints + cert.points <= targetPoints && rng() > 0.6) {
      earnedCerts.push(cert.id);
      certPoints += cert.points;
    }
    if (certPoints >= targetPoints) break;
  }

  // Fill remaining with courses/labs
  const remainingPoints = Math.max(0, targetPoints - certPoints);
  const coursesLabs = Math.floor(remainingPoints / 20);

  const totalBasePoints = certPoints + coursesLabs * 20;
  const monthlyHistory = generateMonthlyHistory(totalBasePoints, rng);

  return {
    id,
    name: `${firstName} ${lastName}`,
    firstName,
    lastName,
    teamId,
    coursesLabs,
    certificates: earnedCerts,
    basePoints: totalBasePoints,
    totalPoints: totalBasePoints,
    monthlyHistory,
    joinDate: '2025-10-01',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}&backgroundColor=1A1D2E&textColor=ffffff`,
  };
}

// Generate 220 participants, ~44 per team
function generateAllParticipants() {
  const participants = [];
  const teams = ['MSE', 'WSE', 'DCBE', 'ECBE', 'DPM'];
  const perTeam = [44, 44, 44, 44, 44];

  let id = 1;
  teams.forEach((teamId, teamIndex) => {
    for (let i = 0; i < perTeam[teamIndex]; i++) {
      // Force WSE team to all have at least 1 course/lab (for Kusursuz Birlik)
      const participant = generateParticipant(id, teamId, id * 7 + teamIndex * 31);
      if (teamId === 'WSE' && participant.coursesLabs === 0 && participant.certificates.length === 0) {
        participant.coursesLabs = 1;
        participant.basePoints = 20;
        participant.totalPoints = 20;
      }
      participants.push(participant);
      id++;
    }
  });

  return participants;
}

export const MOCK_PARTICIPANTS = generateAllParticipants();

// Verify WSE team has Kusursuz Birlik (all members have ≥1 course or cert)
// WSE participants are forced above

export const INITIAL_BONUS_SETTINGS = {
  patronCildirdi: {
    active: false,
    startDate: '',
    endDate: '',
    label: 'Patron Çıldırdı',
    description: '%50 Ekstra Puan',
    banner: '🎉 Sürpriz Puan Haftası Aktif!',
  },
  doublePoint: {
    active: false,
    startDate: '',
    endDate: '',
    label: 'Çifte Puan',
    description: 'Sertifika Puanları 2x',
    banner: '🔥🔥 ÇİFTE PUAN DÖNEMİ! Son şansını kaçırma!',
  },
};

export const COMPETITION_END_DATE = new Date('2026-11-30T23:59:59');

export const REWARDS = [
  {
    rank: '1. ve 2. Sıra',
    icon: '🏆',
    reward: 'Yurt Dışı Konferans Katılımı',
    description: 'Kazanan 2 kişi konferansa katılma hakkı kazanır',
    color: '#FBBC04',
  },
  {
    rank: '3.-8. Sıra',
    icon: '🎲',
    reward: 'Çekiliş: 1 Kişiye Yurt Dışı Konferans',
    description: '3-8. sıradan çekiliş ile 1 kişi konferansa katılır',
    color: '#4285F4',
  },
];

export const REWARD_CONDITIONS = [
  { icon: '⚠️', text: 'En az 1 sertifika almış olmak zorunludur' },
  { icon: '📌', text: 'Mevcut sertifikalar puanlara dahildir' },
];
