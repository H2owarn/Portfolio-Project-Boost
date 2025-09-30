import type { ReactNode } from 'react';
import { StyleSheet, View, type ScrollViewProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 240;

type HeaderBackground = {
  light: string;
  dark: string;
};

type ParallaxScrollViewProps = ScrollViewProps & {
  children: ReactNode;
  headerBackgroundColor: HeaderBackground;
  headerImage: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export default function ParallaxScrollView({
  children,
  contentContainerStyle,
  contentStyle,
  headerBackgroundColor,
  headerImage,
  style,
  ...scrollProps
}: ParallaxScrollViewProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const surfaceColorLight = Colors.light.surface;
  const surfaceColorDark = Colors.dark.surface;
  const colorScheme = useColorScheme() ?? 'dark';

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
          [2, 1, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      <Animated.ScrollView
        ref={scrollRef}
        {...scrollProps}
        style={style}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_HEIGHT },
          contentContainerStyle,
        ]}
      >
        <ThemedView
          lightColor={surfaceColorLight}
          darkColor={surfaceColorDark}
          style={[styles.content, contentStyle]}
        >
          {children}
        </ThemedView>
      </Animated.ScrollView>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}
      >
        {headerImage}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 24,
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
