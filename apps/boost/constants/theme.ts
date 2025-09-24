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
		surface: '#fff',
		surfaceElevated: '#eee',
		primary,
		secondary,
		tint: primary,
		icon: '#4B5563',
		tabIconDefault: '#9CA3AF',
		tabIconSelected: primary,
		borderColor: '#666',
		borderColorAlt: '#aaa'
	},
	dark: {
		text: textDark,
		mutedText: '#999',
		background: backgroundDark,
		surface: '#0c0a09',
		surfaceElevated: '#11100f',
		primary,
		secondary,
		tint: primary,
		icon: '#999',
		tabIconDefault: '#444',
		tabIconSelected: primary,
		borderColor: '#555',
		borderColorAlt: '#333'
	}
};

export const Fonts = Platform.select({
	ios: {
		sans: 'system-ui',
		serif: 'ui-serif',
		rounded: 'ui-rounded',
		mono: 'ui-monospace'
	},
	default: {
		sans: 'normal',
		serif: 'serif',
		rounded: 'normal',
		mono: 'monospace'
	},
	web: {
		sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
		serif: "Georgia, 'Times New Roman', serif",
		rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
		mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
	}
});

export const Spacing = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32
} as const;

export const Radii = {
	sm: 8,
	md: 16,
	lg: 24,
	pill: 999
} as const;

export const Shadow = {
	card: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 8,
		elevation: 4
	},
	overlay: {
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.25,
		shadowRadius: 12,
		elevation: 8
	}
} as const;

export const Font = {
	title: {
		fontSize: 24,
		fontWeight: '700',
		lineHeight: 32
	},
	subTitle: {
		fontSize: 16,
		fontWeight: '500',
		lineHeight: 28
	}
} as const;
