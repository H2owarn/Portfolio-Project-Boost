import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

type IconProps = {
  name: string; // icon name from the chosen library
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  library?: 'material' | 'material-community' | 'ant'; // choose library
};

export function IconSymbol({
  name,
  size = 24,
  color = 'black',
  style,
  library = 'material', // default = Material
}: IconProps) {
  if (library === 'material-community') {
    return (
      <MaterialCommunityIcons
        name={name as any}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  if (library === 'ant') {
    return (
      <AntDesign
        name={name as any}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // fallback = Material
  return (
    <MaterialIcons
      name={name as any}
      size={size}
      color={color}
      style={style}
    />
  );
}
