export const palette = {
  background: '#030609',
  backgroundDeep: '#020408',
  backgroundElevated: '#0B121A',
  surface: '#0F1824',
  surfaceMuted: '#151F2D',
  surfaceOutline: '#273245',
  overlay: 'rgba(4, 10, 18, 0.72)',
  textPrimary: '#E9EFFA',
  textSecondary: '#A8B6CC',
  textTertiary: '#73839A',
  accent: '#2BB2A4',
  accentStrong: '#18D0BE',
  accentSoft: '#1E7F76',
  accentGlow: 'rgba(24, 208, 190, 0.26)',
  exam: '#F28C48',
  warning: '#F5B75F',
  success: '#3FCF9A',
  successSoft: 'rgba(63, 207, 154, 0.2)',
  danger: '#F37474',
  dangerSoft: 'rgba(243, 116, 116, 0.2)',
  gradientStart: '#06101A',
  gradientMid: '#0E2232',
  gradientEnd: '#081A2A',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

export const typography = {
  hero: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700' as const,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  headline: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
  },
} as const;

export const shadows = {
  panel: {
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  glow: {
    shadowColor: '#18D0BE',
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
} as const;
