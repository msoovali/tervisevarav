import { Observation } from "fhir/r5";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";
import { TimeRangeFilter } from "react-native-health-connect/lib/typescript/types/base.types";

const readHeartRate = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthConnect();
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "HeartRate" },
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Heart Rate data was not granted");
  }
  const timeRangeFilter = {
      operator: "between",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    } as TimeRangeFilter;
  const { records } = await readRecords("HeartRate", {
    timeRangeFilter,
  });
  return records.flatMap((record) =>
    record.samples.map((sample) => ({
      resourceType: "Observation",
      status: "final",
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "8867-4",
            display: "Heart rate",
          },
        ],
        text: "Heart rate",
      },
      effectiveDateTime: sample.time,
      valueQuantity: {
        value: sample.beatsPerMinute,
        unit: "beats/minute",
        system: "http://unitsofmeasure.org",
        code: "/min",
      },
    }))
  );
};

const readBloodPressure = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthConnect();
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "BloodPressure" },
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Blood Pressure data was not granted");
  }
  const { records } = await readRecords("BloodPressure", {
    timeRangeFilter: {
      operator: "between",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
  });
  return records.map((record) => ({
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "85354-9",
          display: "Blood pressure panel",
        },
      ],
      text: "Blood pressure panel",
    },
    effectiveDateTime: record.time,
    component: [
      {
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "8480-6",
              display: "Systolic blood pressure",
            },
          ],
          text: "Systolic blood pressure",
        },
        valueQuantity: {
          value: record.systolic.inMillimetersOfMercury,
          unit: "mmHg",
          system: "http://unitsofmeasure.org",
          code: "mm[Hg]",
        },
      },
      {
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "8462-4",
              display: "Diastolic blood pressure",
            },
          ],
          text: "Diastolic blood pressure",
        },
        valueQuantity: {
          value: record.diastolic.inMillimetersOfMercury,
          unit: "mmHg",
          system: "http://unitsofmeasure.org",
          code: "mm[Hg]",
        },
      },
    ],
  }));
};

const readBodyTemperature = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthConnect();
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "BodyTemperature" },
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Body Temperature data was not granted");
  }
  const { records } = await readRecords("BodyTemperature", {
    timeRangeFilter: {
      operator: "between",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
  });
  return records.map((record) => ({ 
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "8310-5",
          display: "Body temperature",
        },
      ],
      text: "Body temperature",
    },
    effectiveDateTime: record.time,
    valueQuantity: {
      value: record.temperature.inCelsius,
      unit: "°C",
      system: "http://unitsofmeasure.org",
      code: "Cel",
    },
  }));
};

const readSteps = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthConnect();
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "Steps" },
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Steps data was not granted");
  }
  const { records } = await readRecords("Steps", {
    timeRangeFilter: {
      operator: "between",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
  });
  // group by day
  const groupedRecords = records.reduce(
    (acc: Record<string, number>, record) => {
      const date = new Date(record.startTime).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += record.count;
      return acc;
    },
    {} as Record<string, number>
  );
  // convert to array
  const stepsPerDay = Object.keys(groupedRecords).map((date) => ({
    time: date,
    count: groupedRecords[date],
  }));
  return stepsPerDay.map((record) => ({
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "41950-7",
          display: "Number of steps in 24 hour Measured",
        },
      ],
      text: "Number of steps in 24 hour Measured",
    },
    effectiveDateTime: record.time,
    valueQuantity: {
      value: record.count,
      unit: "steps per day",
      system: "http://unitsofmeasure.org",
      code: "/d",
    },
  }));
};

const readDistance = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthConnect();
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "Distance" },
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Distance data was not granted");
  }
  const { records } = await readRecords("Distance", {
    timeRangeFilter: {
      operator: "between",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
  });
  return records.map((record) => ({
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "8339-4",
          display: "Distance walked or ran",
        },
      ],
      text: "Distance walked or ran",
    },
    effectiveDateTime: record.endTime,
    valueQuantity: {
      value: record.distance.inMeters,
      unit: "m",
      system: "http://unitsofmeasure.org",
      code: "m",
    },
  }));
}

const readWeight = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthConnect();
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "Weight" },
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Weight data was not granted");
  }
  const { records } = await readRecords("Weight", {
    timeRangeFilter: {
      operator: "between",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
  });
  return records.map((record) => ({
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "29463-7",
          display: "Body weight",
        },
      ],
      text: "Body weight",
    },
    effectiveDateTime: record.time,
    valueQuantity: {
      value: record.weight.inKilograms,
      unit: "kg",
      system: "http://unitsofmeasure.org",
      code: "kg",
    },
  }));
};

const readHeight = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthConnect();
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "Height" },
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Height data was not granted");
  }
  const { records } = await readRecords("Height", {
    timeRangeFilter: {
      operator: "between",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
  });
  return records.map((record) => ({
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "8302-2",
          display: "Body height",
        },
      ],
      text: "Body height",
    },
    effectiveDateTime: record.time,
    valueQuantity: {
      value: record.height.inMeters,
      unit: "cm",
      system: "http://unitsofmeasure.org",
      code: "cm",
    },
  }));
}

const readRestingHeartRate = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthConnect();
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "RestingHeartRate" },
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Resting Heart Rate data was not granted");
  }
  const { records } = await readRecords("RestingHeartRate", {
    timeRangeFilter: {
      operator: "between",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    },
  });
  return records.map((record) => ({
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "9279-1",
          display: "Resting heart rate",
        },
      ],
      text: "Resting heart rate",
    },
    effectiveDateTime: record.time,
    valueQuantity: {
      value: record.beatsPerMinute,
      unit: "beats/minute",
      system: "http://unitsofmeasure.org",
      code: "/min",
    },
  }));
}

const initHealthConnect = async () => {
  const isInitialized = await initialize();
  if (!isInitialized) {
    throw new Error("Health Connect SDK is not initialized");
  }
};

export default {
  readHeartRate,
  readBloodPressure,
  readBodyTemperature,
  readSteps,
  readDistance,
  readWeight,
  readHeight,
  readRestingHeartRate,
};
