import { PropsWithChildren } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ScreenProps = PropsWithChildren<{
	scrollable?: boolean;
	style?: ViewStyle;
	contentStyle?: ViewStyle;
}>;

export function Screen({ children, scrollable = true, style, contentStyle }: ScreenProps) {
	const colorScheme = useColorScheme() ?? 'dark';
	const backgroundColor = Colors[colorScheme].background;

	return (
		<SafeAreaView style={[{ flex: 1 }, { backgroundColor }, style]}>
			{scrollable ? (
				<ScrollView contentContainerStyle={contentStyle}>{children}</ScrollView>
			) : (
				<View style={contentStyle}>{children}</View>
			)}
		</SafeAreaView>
	);
}
