import { Stack } from "expo-router";
import ThemeProvider, { useTheme } from "../theme/ThemeContext";
import { Appbar } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme as usePaperTheme } from "react-native-paper";
import { StatusBar } from "react-native";
import { enGB, registerTranslation } from "react-native-paper-dates";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GestureHandlerRootView>
        <App />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

const App = () => {
  const { toggleTheme } = useTheme();
  const theme = usePaperTheme();
  registerTranslation("et", {
    save: "Salvesta",
    selectSingle: "Vali kuupäev",
    selectMultiple: "Vali kuupäevad",
    selectRange: "Vali periood",
    notAccordingToDateFormat: (inputFormat) =>
      `Kuupäev peab olema vormingus ${inputFormat}`,
    mustBeHigherThan: (date) => `Peab olema hiljem kui ${date}`,
    mustBeLowerThan: (date) => `Peab olema varem kui ${date}`,
    mustBeBetween: (startDate, endDate) =>
      `Peab olema vahemikus ${startDate} - ${endDate}`,
    dateIsDisabled: "Kuupäev pole lubatud",
    previous: "Eelmine",
    next: "Järgmine",
    typeInDate: "Sisesta kuupäev",
    pickDateFromCalendar: "Vali kuupäev kalendrist",
    close: "Sulge",
    hour: "Tund",
    minute: "Minut",
  });
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={theme.dark ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            header: () => (
              <Appbar.Header>
                <Appbar.Content title="Vaata terviseandmeid" />
                <Appbar.Action
                  icon="brightness-6"
                  onPress={() => {
                    toggleTheme();
                  }}
                />
              </Appbar.Header>
            ),
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
};
