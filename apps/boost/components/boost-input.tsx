import { MaterialIcons } from '@expo/vector-icons';
import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type IconProps = {
	name: keyof typeof MaterialIcons.glyphMap;
};

type BoostInputProps = TextInputProps & {
	label?: string;
	hint?: string;
	leadingIcon?: IconProps;
	trailingIcon?: IconProps;
	containerStyle?: ViewStyle;
	inputRowStyle?: ViewStyle;
};

export const BoostInput = forwardRef<TextInput, BoostInputProps>(
	({ label, hint, leadingIcon, trailingIcon, style, containerStyle, inputRowStyle, ...rest }, ref) => {
		const colorScheme = useColorScheme() ?? 'dark';
		const palette = Colors[colorScheme];
		const styles = createStyles(palette);
		const [focused, setFocused] = useState(false);

		return (
			<View style={[styles.wrapper, containerStyle]}>
				{label ? <Text style={styles.label}>{label}</Text> : null}
				<View style={[styles.inputRow, inputRowStyle]}>
					{leadingIcon ? <MaterialIcons name={leadingIcon.name} size={20} color={palette.mutedText} /> : null}
					<TextInput
						ref={ref}
						placeholderTextColor={palette.mutedText}
						style={[styles.input, focused && {}, style]}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
						{...rest}
					/>
					{trailingIcon ? <MaterialIcons name={trailingIcon.name} size={20} color={palette.mutedText} /> : null}
				</View>
				{hint ? <Text style={styles.hint}>{hint}</Text> : null}
			</View>
		);
	}
);

BoostInput.displayName = 'BoostInput';

const createStyles = (palette: (typeof Colors)['light']) =>
	StyleSheet.create({
		wrapper: {
			gap: Spacing.sm
		},
		label: {
			color: palette.mutedText,
			fontSize: 13,
			fontWeight: '500'
		},
		inputRow: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: 'transparent',
			borderRadius: Radii.md,
			borderWidth: 1,
			borderColor: palette.borderColor,
			paddingHorizontal: Spacing.md,
			height: 52,
			gap: Spacing.sm
		},
		input: {
			flex: 1,
			color: palette.text,
			fontSize: 16,
			fontWeight: '500'
		},
		hint: {
			color: palette.mutedText,
			fontSize: 12
		}
	});
