import { ReactNode, createContext, useContext, useState } from 'react';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Context {
	palette: (typeof Colors)['dark'];
	toggleTheme: () => void;
	theme: keyof typeof Colors;
}
interface Props {
	colorScheme: keyof typeof Colors;
	children: ReactNode;
}

export const ThemeContext = createContext<Context | null>(null!);

export const ThemeProvider = ({ children, colorScheme }: Props) => {
	const [theme, setTheme] = useState<keyof typeof Colors>(colorScheme);
	const palette = Colors[theme];

	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
	};

	return <ThemeContext.Provider value={{ theme, palette, toggleTheme }}>{children}</ThemeContext.Provider>;
};
