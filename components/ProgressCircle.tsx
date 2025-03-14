import React, { useEffect, useMemo } from "react";
import Animated, {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import {
  Canvas,
  Group,
  Path,
  Skia,
  Text,
  useFont,
} from "@shopify/react-native-skia";
import { useThemeColor } from "./Themed";

type ProgressCircle = {
  size: number;
  strokeWidth?: number;
  backgroundColor?: string;
  color?: string;
  value: number;
  max: number;
};

export const ProgressCircle = ({
  size,
  color = "orange",
  value,
  max,
  strokeWidth = 4,
  backgroundColor = "grey",
}: ProgressCircle) => {
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"));
  const textColor = useThemeColor({}, "text");

  const realProgress = value / max;

  const animationProgress = useSharedValue(0);

  // animate from 0 to 1
  useEffect(() => {
    animationProgress.value = withTiming(1, {
      duration: 1000,
    });
  }, []);

  const animatedProgressValue = useDerivedValue(() =>
    interpolate(animationProgress.value, [0, 1], [0, realProgress])
  );

  const radius = size / 2 - strokeWidth / 2;

  const path = useMemo(() => {
    const skPath = Skia.Path.Make();

    skPath.addCircle(size / 2, size / 2, radius);

    return skPath;
  }, [radius, size]);

  const style = {
    width: size,
    height: size,
  };

  const origin = {
    x: size / 2,
    y: size / 2,
  };

  const transform = [
    {
      rotate: -Math.PI / 2,
    },
  ];

  const textDimensions = font?.measureText(value.toString());

  return (
    value >= 0 && (
      <Animated.View entering={FadeIn}>
        <Canvas style={style}>
          <Group origin={origin} transform={transform}>
            <Path
              start={0}
              end={1}
              path={path}
              style="stroke"
              strokeCap="round"
              color={backgroundColor}
              strokeWidth={strokeWidth}
            />
            <Path
              start={0}
              end={animatedProgressValue}
              path={path}
              style="stroke"
              strokeCap="round"
              color={color}
              strokeWidth={strokeWidth}
            />
          </Group>
          <Text
            color={textColor}
            font={font}
            x={(size - (textDimensions?.width ?? 0)) / 2}
            y={size / 1.6}
            text={`${value.toString()}`}
          />
        </Canvas>
      </Animated.View>
    )
  );
};
