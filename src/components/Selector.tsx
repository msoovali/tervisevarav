import React from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";

export type SelectableItem = {
  label: string;
  value: string;
};

export type BottomSheetProps = {
  title: string;
  items: SelectableItem[];
  onSelect: (item: SelectableItem) => void;
};

const Selector = (props: BottomSheetProps) => {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={{ alignSelf: "center" }}>
        {props.title}
      </Text>
      <Divider />
      <ScrollView
        style={styles.itemsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          rowGap: 10,
        }}
      >
        {props.items.map((item, index) => (
            <Button key={index + item.value} mode={"text"} onPress={() => props.onSelect(item)}>{item.label}</Button>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flex: 1,
  },
  itemsContainer: {
    alignContent: "center",
    flexDirection: "column",
    flex: 1,
    gap: 10,
    width: "100%",
  },
});

export default Selector;
