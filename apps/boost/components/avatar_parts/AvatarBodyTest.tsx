import * as React from "react";
import Svg, { Circle, SvgProps } from "react-native-svg";

// Type the props with SvgProps so you can pass width, height, style, etc.
const AvatarBodyTest: React.FC<SvgProps> = (props) => (
  <Svg width={250} height={250} {...props}>
    <Circle cx={125} cy={125} r={100} fill="gray" />
  </Svg>
);

export default AvatarBodyTest;
