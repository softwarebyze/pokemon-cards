import { useMemo } from "react";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import {
  Canvas,
  Group,
  Path,
  Skia,
  Text,
  useFont,
} from "@shopify/react-native-skia";

type ProgressCircle = {
  size: number;
  strokeWidth?: number;
  backgroundColor?: string;
  color?: SharedValue<string>;
  value: SharedValue<number>;
  max: number;
};

export const ProgressCircle = ({
  size,
  color,
  value,
  max,
  strokeWidth = 4,
  backgroundColor = "orange",
}: ProgressCircle) => {
  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"));

  const progress = value.value / max; //useDerivedValue(() => value.value / max);

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

  return (
    <Canvas style={style}>
      <Group origin={origin} transform={transform}>
        <Path
          start={0}
          end={1}
          path={path}
          style={"stroke"}
          strokeCap={"round"}
          color={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* <Circle
              cx={radius}
              cy={radius}
              r={radius}
              color={backgroundColor}
            /> */}
        <Path
          start={0}
          end={progress}
          path={path}
          style={"stroke"}
          strokeCap={"round"}
          color={color ?? "skyblue"}
          strokeWidth={strokeWidth}
        />
      </Group>
      <Text
        font={font}
        x={size / 4}
        y={size / 1.5}
        text={`${value.value.toString()}`}
      />
    </Canvas>
  );
};
