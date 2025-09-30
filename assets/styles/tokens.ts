export type ColorPalette = {
  background: string;
  surface: string;
  text: string;
  mutedText: string;
  primary: string;
  secondary: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
};

export type ThemeScheme = {
  light: ColorPalette;
  dark: ColorPalette;
};

export const Colors: ThemeScheme = {
  light: {
    text: '#11181C',
    mutedText: '#6B7280',
    background: '#FFFFFF',
    surface: '#F3F4F6',
    primary: '#4F46E5',
    secondary: '#1F2937',
    icon: '#4B5563',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#4F46E5',
  },
  dark: {
    text: '#F9FAFB',
    mutedText: '#9CA3AF',
    background: '#000000',
    surface: '#111827',
    primary: '#7DF843',
    secondary: '#1F2937',
    icon: '#9CA3AF',
    tabIconDefault: '#4B5563',
    tabIconSelected: '#7DF843',
  },
};
