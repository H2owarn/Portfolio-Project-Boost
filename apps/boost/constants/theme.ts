import { Platform } from 'react-native';

const primary = '#7DF843';
const secondary = '#1F2937';
const backgroundDark = '#000000';
const backgroundLight = '#FFFFFF';
const textDark = '#F9FAFB';
const textLight = '#111827';

export const Colors = {
  light: {
    text: textLight,
    mutedText: '#6B7280',
    background: backgroundLight,
    surface: '#F3F4F6',
    primary,
    secondary,
    tint: primary,
    icon: '#4B5563',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: primary,
  },
  dark: {
    text: textDark,
    mutedText: '#9CA3AF',
    background: backgroundDark,
    surface: '#111827',
    primary,
    secondary,
    tint: primary,
    icon: '#9CA3AF',
    tabIconDefault: '#4B5563',
    tabIconSelected: primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Radii = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
};
