// Static reference data for the competition

export const TEAMS = [
  { id: 'MSE',   name: 'MSE',   color: '#4285F4', fullName: 'Makine & Sistem Mühendisliği' },
  { id: 'WSE',   name: 'WSE',   color: '#34A853', fullName: 'Web & Yazılım Mühendisliği' },
  { id: 'DCBE',  name: 'DCBE',  color: '#FBBC04', fullName: 'Veri & Bulut İş Ortağı' },
  { id: 'ECCBE', name: 'ECCBE', color: '#EA4335', fullName: 'Kurumsal Bulut İş Ortağı' },
  { id: 'DPM',   name: 'DPM',   color: '#A142F4', fullName: 'Dijital Ürün Yönetimi' },
];

export const CERTIFICATES = {
  foundational: [
    { id: 'cloud-digital-leader', name: 'Cloud Digital Leader',    points: 150, level: 'Temel' },
    { id: 'gen-ai-leader',        name: 'Generative AI Leader',     points: 150, level: 'Temel' },
  ],
  associate: [
    { id: 'cloud-engineer',   name: 'Cloud Engineer',                    points: 150, level: 'Orta' },
    { id: 'workspace-admin',  name: 'Google Workspace Administrator',    points: 150, level: 'Orta' },
    { id: 'data-practitioner',name: 'Data Practitioner',                 points: 150, level: 'Orta' },
  ],
  professional: [
    { id: 'cloud-architect',  name: 'Cloud Architect',              points: 500, level: 'Profesyonel' },
    { id: 'cloud-db-engineer',name: 'Cloud Database Engineer',      points: 500, level: 'Profesyonel' },
    { id: 'cloud-developer',  name: 'Cloud Developer',              points: 500, level: 'Profesyonel' },
    { id: 'data-engineer',    name: 'Data Engineer',                points: 500, level: 'Profesyonel' },
    { id: 'cloud-devops',     name: 'Cloud DevOps Engineer',        points: 500, level: 'Profesyonel' },
    { id: 'cloud-security',   name: 'Cloud Security Engineer',      points: 500, level: 'Profesyonel' },
    { id: 'cloud-network',    name: 'Cloud Network Engineer',       points: 500, level: 'Profesyonel' },
    { id: 'ml-engineer',      name: 'Machine Learning Engineer',    points: 500, level: 'Profesyonel' },
    { id: 'security-ops',     name: 'Security Operations Engineer', points: 500, level: 'Profesyonel' },
  ],
};

export const ALL_CERTIFICATES = [
  ...CERTIFICATES.foundational,
  ...CERTIFICATES.associate,
  ...CERTIFICATES.professional,
];

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
