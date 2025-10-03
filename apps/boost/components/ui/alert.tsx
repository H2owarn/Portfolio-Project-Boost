import { MaterialIcons } from '@expo/vector-icons';
import { Text, View, useColorScheme } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';

interface AlertProps {
	type: 'info' | 'success' | 'warning' | 'error';
	message: string;
}

export const Alert = ({ type, message }: AlertProps) => {
	const palette = Colors[useColorScheme() ?? 'dark'];
	const colours = {
		info: palette.infoTransparent,
		success: palette.successTransparent,
		warning: palette.warningTransparent,
		error: palette.errorTransparent
	}[type];
	const backgroundColor = colours;
	const icon = (
		{
			info: 'info-outline',
			success: 'check-circle-outline',
			warning: 'warning-amber',
			error: 'error-outline'
		} as const
	)[type];

	return (
		<View
			style={{
				backgroundColor,
				padding: Spacing.md,
				borderRadius: Radii.md,
				flexDirection: 'row',
				gap: Spacing.sm,
				alignItems: 'center'
			}}
		>
			<MaterialIcons name={icon} size={32} color={palette[type]} />
			<Text style={{ color: palette[type], flexShrink: 1, lineHeight: 20 }}>{message}</Text>
		</View>
	);
};
