import * as React from "react";
import {
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "react-native-paper";

import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

type Props = ScrollViewProps & {
  children: React.ReactNode;
  withScrollView?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function ScreenWrapper({
  children,
  withScrollView = true,
  style,
  contentContainerStyle,
  ...rest
}: Props) {
  const theme = useTheme();

  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.container,
    {
      backgroundColor: theme.colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
  ];

  return (
    <SafeAreaProvider>
      {withScrollView ? (
        <ScrollView
          {...rest}
          contentContainerStyle={contentContainerStyle}
          keyboardShouldPersistTaps="always"
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          style={[containerStyle, style]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[containerStyle, style]}>{children}</View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
