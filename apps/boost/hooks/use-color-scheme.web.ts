import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme, type ColorSchemeName } from 'react-native';

const FORCED_COLOR_SCHEME: ColorSchemeName | null = 'dark';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): ColorSchemeName {
  if (FORCED_COLOR_SCHEME) {
    return FORCED_COLOR_SCHEME;
  }

  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme ?? 'dark';
  }

  return 'dark';
}
