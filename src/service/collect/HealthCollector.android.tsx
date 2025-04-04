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

const readBloodGlucose = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthConnect();
  const grantedPermissions = await requestPermission([
    { accessType: "read", recordType: "BloodGlucose" },
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Blood Glucose data was not granted");
  }
  const { records } = await readRecords("BloodGlucose", {
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
          code: "15074-8",
          display: "Blood glucose",
        },
      ],
      text: "Blood glucose",
    },
    effectiveDateTime: record.time,
    valueQuantity: {
      value: record.level.inMilligramsPerDeciliter,
      unit: "mg/dL",
      system: "http://unitsofmeasure.org",
      code: "mg/dL",
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

const initHealthConnect = async () => {
  const isInitialized = await initialize();
  if (!isInitialized) {
    throw new Error("Health Connect SDK is not initialized");
  }
};

export default {
  readHeartRate,
  readBloodPressure,
  readBloodGlucose,
  readSteps,
  readWeight,
  readHeight,
};
