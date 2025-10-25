import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, StyleProp, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type SkeletonProps = {
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
};

export default function Skeleton({ style, borderRadius }: SkeletonProps) {
  const palette = Colors[useColorScheme() ?? 'dark'];
  const [width, setWidth] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  const baseColor = palette.surfaceElevated;
  const highlightColor = useMemo(() => (palette.text === '#F9FAFB' ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)'), [palette.text]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [anim]);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-0.6 * width, width],
  });

  return (
    <View onLayout={onLayout} style={[{ backgroundColor: baseColor, overflow: 'hidden', borderRadius }, style]}>
      {width > 0 && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: width * 0.6,
            transform: [{ translateX }],
            backgroundColor: highlightColor,
          }}
        />
      )}
    </View>
  );
}

