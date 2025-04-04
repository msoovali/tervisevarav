# Tervisevärav 👋

Proof of concept hybrid mobile app to gather patient generated health data as FHIR structures from Android Health Connect and Apple HealthKit

## HealthCollector

The core of this app (HealthCollector) is located at [src/service/collect](src/service/collect) which includes mapping to FHIR Observation resources.

Currently there are total of 6 mappings:
- Weight
- Height
- Steps
- Heart rate
- Blood pressure
- Blood clucose

## Charts

As a proof of concept app supports displaying graph for all above data types except blood pressure (this requires additional work as it has 2 measurements while other types have 1)

## Run

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo
