// Mock Data for Google Cloud Certification Competition

export const TEAMS = [
  { id: 'MSE', name: 'MSE', color: '#4285F4', fullName: 'Makine & Sistem Mühendisliği' },
  { id: 'WSE', name: 'WSE', color: '#34A853', fullName: 'Web & Yazılım Mühendisliği' },
  { id: 'DCBE', name: 'DCBE', color: '#FBBC04', fullName: 'Veri & Bulut İş Ortağı' },
  { id: 'ECCBE', name: 'ECCBE', color: '#EA4335', fullName: 'Kurumsal Bulut İş Ortağı' },
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

function makeParticipant(id, teamId, fullName) {
  const parts = fullName.trim().split(' ');
  const lastName = parts[parts.length - 1];
  const firstName = parts.slice(0, parts.length - 1).join(' ');
  return {
    id,
    name: fullName,
    firstName,
    lastName,
    teamId,
    coursesLabs: 0,
    certificates: [],
    basePoints: 0,
    totalPoints: 0,
    monthlyHistory: [],
    joinDate: '2025-10-01',
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}${lastName}&backgroundColor=1A1D2E&textColor=ffffff`,
  };
}

export const MOCK_PARTICIPANTS = [
  // ECCBE (11)
  makeParticipant(1,  'ECCBE', 'Ahmet Colak'),
  makeParticipant(2,  'ECCBE', 'Enes Boyaci'),
  makeParticipant(3,  'ECCBE', 'Engin Sancak'),
  makeParticipant(4,  'ECCBE', 'Furkan Akarcesme'),
  makeParticipant(5,  'ECCBE', 'Furkan Atak'),
  makeParticipant(6,  'ECCBE', 'Haluk Furtuna'),
  makeParticipant(7,  'ECCBE', 'Kemal Acar'),
  makeParticipant(8,  'ECCBE', 'Mehmet Semih Apel'),
  makeParticipant(9,  'ECCBE', 'Melih Demircan'),
  makeParticipant(10, 'ECCBE', 'Ozan Kilinc'),
  makeParticipant(11, 'ECCBE', 'Soner Oz'),

  // WSE (10)
  makeParticipant(12, 'WSE', 'Erhan Arda'),
  makeParticipant(13, 'WSE', 'Ferhat Ozdemir'),
  makeParticipant(14, 'WSE', 'Gizem Boga'),
  makeParticipant(15, 'WSE', 'Kaan Yildirim'),
  makeParticipant(16, 'WSE', 'Melek Naz Aykut'),
  makeParticipant(17, 'WSE', 'Nisan Tarhan'),
  makeParticipant(18, 'WSE', 'Reha Ok'),
  makeParticipant(19, 'WSE', 'Tolunay Tezcan'),
  makeParticipant(20, 'WSE', 'Zafer Bozkurt'),
  makeParticipant(21, 'WSE', 'Zeynep Kara'),

  // MSE (13)
  makeParticipant(22, 'MSE', 'Ahmet Bekir Bakkal'),
  makeParticipant(23, 'MSE', 'Aysegul Durdu'),
  makeParticipant(24, 'MSE', 'Baris Uyar'),
  makeParticipant(25, 'MSE', 'Batuhan Erdogan'),
  makeParticipant(26, 'MSE', 'Can Kuloglu'),
  makeParticipant(27, 'MSE', 'Cansu Arar Erdem'),
  makeParticipant(28, 'MSE', 'Eren Papakci'),
  makeParticipant(29, 'MSE', 'Furkan Pasaoglu'),
  makeParticipant(30, 'MSE', 'Lorin Vural'),
  makeParticipant(31, 'MSE', 'Serkut Yegin'),
  makeParticipant(32, 'MSE', 'Umut Erol'),
  makeParticipant(33, 'MSE', 'Yusuf Burak Demir'),
  makeParticipant(34, 'MSE', 'Zeynep Baltalioglu'),

  // DPM (24)
  makeParticipant(35, 'DPM', 'Ayse Nur Ozcelik'),
  makeParticipant(36, 'DPM', 'Aysun Karagul'),
  makeParticipant(37, 'DPM', 'Baris Can Turkyilmaz'),
  makeParticipant(38, 'DPM', 'Burak Ozsahin'),
  makeParticipant(39, 'DPM', 'Cansu Keremitci'),
  makeParticipant(40, 'DPM', 'Dilara Unal'),
  makeParticipant(41, 'DPM', 'Duygu Algul'),
  makeParticipant(42, 'DPM', 'Ebru Tezcan Ustunluoglu'),
  makeParticipant(43, 'DPM', 'Eda Guneri'),
  makeParticipant(44, 'DPM', 'Esra Aydinlar'),
  makeParticipant(45, 'DPM', 'Faruk Gulsen'),
  makeParticipant(46, 'DPM', 'Gamze Sevdik Elci'),
  makeParticipant(47, 'DPM', 'Gizem Kabasakal'),
  makeParticipant(48, 'DPM', 'Kubra Cakar'),
  makeParticipant(49, 'DPM', 'Mehpare Ozsipahi'),
  makeParticipant(50, 'DPM', 'Melih Calli'),
  makeParticipant(51, 'DPM', 'Melike Disbudak'),
  makeParticipant(52, 'DPM', 'Nese Isik'),
  makeParticipant(53, 'DPM', 'Onurhan Bas'),
  makeParticipant(54, 'DPM', 'Ratipcan Uysal'),
  makeParticipant(55, 'DPM', 'Serkan Celenk'),
  makeParticipant(56, 'DPM', 'Sevcan Olcum'),
  makeParticipant(57, 'DPM', 'Ugur Erdem'),
  makeParticipant(58, 'DPM', 'Zeynep Aydin Ozdemir'),

  // DCBE (17)
  makeParticipant(59, 'DCBE', 'Anil Ozturk'),
  makeParticipant(60, 'DCBE', 'Cagri Artun'),
  makeParticipant(61, 'DCBE', 'Deniz Oner'),
  makeParticipant(62, 'DCBE', 'Dogukan Yalcin'),
  makeParticipant(63, 'DCBE', 'Erdal Sarioglu'),
  makeParticipant(64, 'DCBE', 'Esma Kilic'),
  makeParticipant(65, 'DCBE', 'Mehmet Sahin'),
  makeParticipant(66, 'DCBE', 'Mert Karaman'),
  makeParticipant(67, 'DCBE', 'Oguzhan Derici'),
  makeParticipant(68, 'DCBE', 'Onur Arslan'),
  makeParticipant(69, 'DCBE', 'Ozge Kisaoglu'),
  makeParticipant(70, 'DCBE', 'Ozgur Bozkurt'),
  makeParticipant(71, 'DCBE', 'Said Ozgat'),
  makeParticipant(72, 'DCBE', 'Sidar Orman'),
  makeParticipant(73, 'DCBE', 'Tunga Sayici'),
  makeParticipant(74, 'DCBE', 'Ugur Turkyilmaz'),
  makeParticipant(75, 'DCBE', 'Umutcan Caner'),
];

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
