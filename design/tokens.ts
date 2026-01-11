export const tokens = {
  // Premium iOS feel: off-white canvas, white cards, subtle borders
  colors: {
    bg: '#F7F7F5',        // off-white background
    card: '#FFFFFF',      // card background
    text: '#0B0B0B',      // near-black text
    muted: '#6B6B6B',     // secondary text
    border: '#E8E8E6',    // subtle borders
    tint: '#2F6BFF',      // primary accent
    action: '#059669',    // gamified action (rich emerald)
    danger: '#D92D20',

    // Calendar day states
    calendar: {
      inactive: '#E5E5E5',        // soft grey for days before joining
      win: '#D1FAE5',             // soft green fill
      winBorder: '#10B981',       // green border
      loss1: '#FEE2E2',           // soft red (1-2 day loss)
      loss2: '#FECACA',           // medium red (3-4 day streak)
      loss3: '#FCA5A5',           // darker red (5+ day streak)
    },
  },

  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
  },

  radius: {
    sm: 12,
    md: 16,
    lg: 20,
    pill: 999,
  },

  typography: {
    h1: { fontSize: 34, fontWeight: '800' as const, letterSpacing: -0.6 },
    h2: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.2 },
    body: { fontSize: 16, fontWeight: '500' as const },
    small: { fontSize: 14, fontWeight: '500' as const },
    tiny: { fontSize: 12, fontWeight: '600' as const },
  },

  shadow: {
    // subtle iOS shadow
    ios: {
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
    },
    android: {
      elevation: 3,
    },
  },
};
