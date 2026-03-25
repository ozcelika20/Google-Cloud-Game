export const TITLES = [
  {
    min: 0,
    max: 150,
    title: 'Cloud Explorer',
    emoji: '☁️',
    color: '#8B8FA3',
    bgColor: 'rgba(139, 143, 163, 0.15)',
    borderColor: 'rgba(139, 143, 163, 0.4)',
    label: '☁️ Cloud Explorer',
  },
  {
    min: 151,
    max: 350,
    title: 'Cloud Ranger',
    emoji: '🌤️',
    color: '#34A853',
    bgColor: 'rgba(52, 168, 83, 0.15)',
    borderColor: 'rgba(52, 168, 83, 0.4)',
    label: '🌤️ Cloud Ranger',
  },
  {
    min: 351,
    max: 750,
    title: 'Cloud Ninja',
    emoji: '⚡',
    color: '#FBBC04',
    bgColor: 'rgba(251, 188, 4, 0.15)',
    borderColor: 'rgba(251, 188, 4, 0.4)',
    label: '⚡ Cloud Ninja',
  },
  {
    min: 751,
    max: Infinity,
    title: 'Cloud Master',
    emoji: '🏆',
    color: '#EA4335',
    bgColor: 'rgba(234, 67, 53, 0.15)',
    borderColor: 'rgba(234, 67, 53, 0.4)',
    label: '🏆 Cloud Master',
  },
];

export function resolveTitle(points) {
  for (const tier of TITLES) {
    if (points >= tier.min && points <= tier.max) {
      return tier;
    }
  }
  return TITLES[0];
}

export function getTitleColor(points) {
  return resolveTitle(points).color;
}

export function getTitleLabel(points) {
  return resolveTitle(points).label;
}

export function getNextTierInfo(points) {
  const currentTierIndex = TITLES.findIndex(t => points >= t.min && points <= t.max);
  if (currentTierIndex === -1 || currentTierIndex === TITLES.length - 1) {
    return null;
  }
  const nextTier = TITLES[currentTierIndex + 1];
  return {
    nextTier,
    pointsNeeded: nextTier.min - points,
    progressPercent: Math.min(
      100,
      ((points - TITLES[currentTierIndex].min) /
        (TITLES[currentTierIndex].max - TITLES[currentTierIndex].min)) *
        100
    ),
  };
}
