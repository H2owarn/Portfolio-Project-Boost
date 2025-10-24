import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type BoostButtonProps = {
	label?: string;
	onPress?: () => void;
	variant?: ButtonVariant;
	icon?: ReactNode;
	trailingIcon?: ReactNode;
	fullWidth?: boolean;
	disabled?: boolean;
	submitted?: boolean;
};

export function BoostButton(
	{
		label,
		onPress,
		variant = 'primary',
		icon,
		trailingIcon,
		fullWidth = true,
		disabled = false,
		submitted = false
	}: BoostButtonProps
) {
	const { palette } = useTheme();

	const styles = createStyles(palette, variant, fullWidth, disabled, !icon || !trailingIcon);

	return (
		<Pressable
			accessibilityRole="button"
			onPress={disabled ? undefined : onPress}
			style={({ pressed }) => [styles.button, ((pressed && !disabled) || submitted) && { opacity: 0.6 }]}
			disabled={disabled}
		>
			{submitted && icon ? (
				<ActivityIndicator color="black" size={20} />
			) : icon ? (
				<View style={styles.icon}>{icon}</View>
			) : null}

			{label && <Text style={styles.label}>{label}</Text>}

			{submitted && trailingIcon ? (
				<ActivityIndicator color="black" size={20} />
			) : trailingIcon ? (
				<View style={styles.icon}>{trailingIcon}</View>
			) : null}
		</Pressable>
	);
}

const createStyles = (
	palette: (typeof Colors)['light'],
	variant: ButtonVariant,
	fullWidth: boolean,
	disabled: boolean,
	iconOnly: boolean
) => {
	const base = {
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: Radii.lg,
		paddingVertical: Spacing.md,
		paddingHorizontal: iconOnly ? Spacing.md : Spacing.lg,
		flexDirection: 'row',
		gap: Spacing.sm
	} as const;

	const selected = {
		primary: {
			backgroundColor: disabled ? '#14532d' : palette.primary,
			textColor: '#000000'
		},
		secondary: {
			backgroundColor: palette.surface,
			textColor: palette.text
		},
		ghost: {
			backgroundColor: 'transparent',
			borderColor: '#374151',
			textColor: palette.mutedText
		}
	}[variant];

	return StyleSheet.create({
		button: {
			...base,
			width: fullWidth ? '100%' : undefined,
			backgroundColor: selected.backgroundColor,
			borderWidth: selected.borderColor ? 1 : 0,
			borderColor: selected.borderColor,
			opacity: disabled ? 0.6 : 1
		},
		label: {
			color: selected.textColor,
			fontSize: 16,
			fontWeight: '600',
			textAlign: 'center'
		},
		icon: {
			justifyContent: 'center',
			alignItems: 'center'
		}
	});
};
