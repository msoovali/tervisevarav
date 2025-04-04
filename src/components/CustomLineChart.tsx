import { Observation } from "fhir/r5";
import React from "react";
import { Dimensions } from "react-native";
import { useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LineChart, lineDataItem } from "react-native-gifted-charts";

export type CustomLineChartProps = {
  observations: Observation[];
};

const CustomLineChart = (props: CustomLineChartProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const TARGET_DATA_POINTS = 30;
  const dataLength = props.observations.length;
  const step = Math.max(1, Math.floor(dataLength / TARGET_DATA_POINTS));
  const lessThan10 = dataLength < 10;
  const mappedData : lineDataItem[] = props.observations
    .filter(
      (observation) =>
        !!observation &&
        observation.effectiveDateTime !== undefined &&
        observation.valueQuantity !== undefined &&
        observation.valueQuantity.value !== undefined
    )
    .filter((_, index) => index % step === 0)
    .map((observation, index) => {
      const date = new Date(observation.effectiveDateTime!);
      return {
        value: observation.valueQuantity!.value!,
        time: Date.parse(observation.effectiveDateTime!),
        label: index % 5 === 0 || lessThan10 ? date.toLocaleDateString("et-EE", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }) : undefined,
        showXAxisIndex: index % 5 === 0 || lessThan10,
      };
    });

  return (
    <LineChart
      data={mappedData}
      width={Dimensions.get("window").width - insets.left - insets.right}
      backgroundColor={theme.colors.background}
      xAxisColor={theme.colors.primary}
      yAxisColor={theme.colors.primary}
      color={theme.colors.secondary}
      dataPointsColor={theme.colors.secondary}
      xAxisLabelTextStyle={{color: theme.colors.primary, width: 200, textAlign: "start"}}
      yAxisTextStyle={{color: theme.colors.primary}}
      spacing={60}
      xAxisIndicesColor={theme.colors.primary}
      xAxisIndicesHeight={5}
      endSpacing={70}
      initialSpacing={50}
      rotateLabel={true}
      xAxisTextNumberOfLines={4}
      xAxisLabelsHeight={100}
    />
  );
};

export default CustomLineChart;
