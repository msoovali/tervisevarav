import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type BottomSheetProps = {
    children?: React.ReactNode;
    toggleSheet: () => void;
};

const BottomSheet = (props: BottomSheetProps) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    sheet: {
      padding: 8,
      height: "40%",
      width: "100%",
      position: "absolute",
      bottom: insets.bottom,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      zIndex: 1,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.3,
      zIndex: 1,
    },
  });
  return (
    <>
      <Pressable style={[styles.backdrop, {backgroundColor: theme.colors.backdrop}]} onPress={props.toggleSheet} />
      <Animated.View
        style={[
          styles.sheet,
          { backgroundColor: theme.colors.background },
        ]}
        entering={SlideInDown}
        exiting={SlideOutDown}
      >
        {props.children}
      </Animated.View>
    </>
  );
};

export default BottomSheet;
