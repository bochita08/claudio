export const colors = {
  primary: '#0E7C66',
  primaryDark: '#0A5F4E',
  primaryLight: '#E3F3EF',
  accent: '#F2A65A',

  background: '#F4F6F8',
  surface: '#FFFFFF',
  border: '#E1E5EA',

  text: '#1A2230',
  textMuted: '#6B7684',
  textInverse: '#FFFFFF',

  danger: '#D64545',
  dangerBg: '#FCECEC',
  success: '#2E9E5B',
  successBg: '#E7F6EC',
  warning: '#E0A106',

  overlay: 'rgba(16, 24, 32, 0.45)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 26, fontWeight: '700' as const },
  h2: { fontSize: 20, fontWeight: '700' as const },
  h3: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  small: { fontSize: 13, fontWeight: '400' as const },
  tiny: { fontSize: 11, fontWeight: '500' as const },
};

export const shadow = {
  card: {
    shadowColor: '#0A2540',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
};
