import { useColorScheme as useRNColorScheme, type ColorSchemeName } from 'react-native';

const FORCED_COLOR_SCHEME: ColorSchemeName | null = 'dark';

export function useColorScheme(): ColorSchemeName {
  if (FORCED_COLOR_SCHEME) {
    return FORCED_COLOR_SCHEME;
  }

  return useRNColorScheme() ?? 'dark';
}
