import { PropsWithChildren } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

interface ScreenProps extends PropsWithChildren {
	scrollable?: boolean;
	style?: ViewStyle;
	contentStyle?: ViewStyle;
}

export function Screen({ children, scrollable = true, style, contentStyle }: ScreenProps) {
	const { palette } = useTheme();

	return (
		<SafeAreaView style={[{ flex: 1 }, { backgroundColor: palette.background }, style]}>
			{scrollable ? (
				<ScrollView contentContainerStyle={contentStyle}>{children}</ScrollView>
			) : (
				<View style={contentStyle}>{children}</View>
			)}
		</SafeAreaView>
	);
}
