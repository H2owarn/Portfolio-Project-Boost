import { useColorScheme as useRNColorScheme, type ColorSchemeName } from 'react-native';

export function useColorScheme(): ColorSchemeName {
  return useRNColorScheme() ?? 'dark';
}
