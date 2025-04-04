import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import HealthCollector from "../service/collect/HealthCollector";
import { Pressable } from "react-native-gesture-handler";
import BottomSheet from "../components/BottomSheet";
import Selector, { SelectableItem } from "../components/Selector";
import ScreenWrapper from "../components/ScreenWrapper";
import { Button, Icon, Snackbar, Text, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { Observation } from "fhir/r5";
import CustomLineChart from "../components/CustomLineChart";

export default function Index() {
  const [selectedDataType, setSelectedDataType] = useState<
    SelectableItem | undefined
  >(undefined);
  const now = new Date(Date.now());
  const initialStartDate = new Date(new Date().setDate(now.getDate() - 30));
  const [range, setRange] = React.useState({
    startDate: initialStartDate,
    endDate: now,
  });
  const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
  const [isSelectDataTypeOpen, setIsSelectDataTypeOpen] = useState(false);
  const [loadedData, setLoadedData] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = React.useState("");
  const onDismissError = () => setError("");
  useEffect(() => {
    if (
      selectedDataType === undefined ||
      range === null ||
      range.startDate === null ||
      range.endDate === null
    ) {
      return;
    }
    setIsLoading(true);
    setError("");
    const query = getPromiseForDataType(selectedDataType.value, range);
    query
      .then((result) => {
        console.log(
          `${selectedDataType.label} Data: ${JSON.stringify(result)}`
        );
        setLoadedData(result);
      })
      .catch((error) => {
        setError(
          `Viga andmetüübi ${selectedDataType.label} lugemisel. Viga: ${error}`
        );
        setLoadedData([]);
      })
      .finally(() => setIsLoading(false));
  }, [range, selectedDataType]);

  const onConfirmRange = React.useCallback(
    ({
      startDate,
      endDate,
    }: {
      startDate: CalendarDate;
      endDate: CalendarDate;
    }) => {
      if (!startDate || !endDate) {
        return;
      }
      setIsRangePickerOpen(false);
      setRange({
        startDate: startDate,
        endDate: endDate,
      });
    },
    [setIsRangePickerOpen, setRange]
  );

  const toggleSheet = () => setIsSelectDataTypeOpen(!isSelectDataTypeOpen);
  const onSelectDataType = (item: SelectableItem) => {
    setSelectedDataType(item);
    toggleSheet();
  };

  const selectableDataTypes = [
    { label: "Kaal", value: "weight" },
    { label: "Pikkus", value: "height" },
    { label: "Sammud", value: "steps" },
    { label: "Südame löögisagedus", value: "heartRate" },
    { label: "Vererõhk", value: "bloodPressure" },
    { label: "Veresuhkur", value: "bloodGlucose" },
  ];

  return (
    <ScreenWrapper withScrollView={false}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", gap: 2 }}>
          <Icon source="information-outline" size={25} />
          <Text
            variant="titleMedium"
            style={{ textAlign: "center", flexShrink: 1 }}
          >
            Diagrammi kuvamiseks vali soovitud kuupäeva vahemik ja andmetüüp
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
          <Pressable onPress={() => setIsRangePickerOpen(true)}>
            <TextInput
              dense={true}
              mode="outlined"
              editable={false}
              left={<TextInput.Icon icon="calendar" />}
            >
              {range.startDate.toLocaleDateString("et-EE", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}{" "}
              -{" "}
              {range.endDate.toLocaleDateString("et-EE", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            </TextInput>
          </Pressable>
        </View>
        {selectedDataType && !isLoading && loadedData.length === 0 && (
          <Text>Andmed puuduvad</Text>
        )}
        {loadedData.length > 0 && (
          <View style={{ width: "100%" }}>
            <CustomLineChart observations={loadedData} />
          </View>
        )}
        <DatePickerModal
          disableStatusBarPadding={false}
          locale="et"
          mode="range"
          visible={isRangePickerOpen}
          onDismiss={() => setIsRangePickerOpen(false)}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirmRange}
        />
        <Button
          mode={"contained"}
          onPress={toggleSheet}
          style={{ width: "50%" }}
        >
          {selectedDataType ? selectedDataType.label : "Vali andmetüüp"}
        </Button>
        {isSelectDataTypeOpen && (
          <BottomSheet toggleSheet={toggleSheet}>
            <Selector
              title={"Vali andmetüüp"}
              items={selectableDataTypes}
              onSelect={onSelectDataType}
            />
          </BottomSheet>
        )}
        <Snackbar visible={error !== ""} onDismiss={onDismissError}>
          {error}
        </Snackbar>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
});

function getPromiseForDataType(
  value: string,
  range: { startDate: Date; endDate: Date }
) {
  switch (value) {
    case "heartRate":
      return HealthCollector.readHeartRate(range.startDate, range.endDate);
    case "bloodPressure":
      return HealthCollector.readBloodPressure(range.startDate, range.endDate);
    case "bloodGlucose":
      return HealthCollector.readBloodGlucose(range.startDate, range.endDate);
    case "steps":
      return HealthCollector.readSteps(range.startDate, range.endDate);
    case "weight":
      return HealthCollector.readWeight(range.startDate, range.endDate);
    case "height":
      return HealthCollector.readHeight(range.startDate, range.endDate);
    default:
      return Promise.reject(new Error(`Unsupported data type: ${value}`));
  }
}
