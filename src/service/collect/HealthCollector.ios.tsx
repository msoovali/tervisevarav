import Healthkit, {
  BloodGlucoseUnit,
  HKQuantityTypeIdentifier,
} from "@kingstinct/react-native-healthkit";
import { Observation } from "fhir/r5";

const readHeartRate = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthkit();
  const grantedPermissions = await Healthkit.requestAuthorization([
    HKQuantityTypeIdentifier.heartRate,
    HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Heart Rate data was not granted");
  }
  const result = await Healthkit.queryQuantitySamples(
    HKQuantityTypeIdentifier.heartRate,
    {
      from: startTime,
      to: endTime,
      unit: "count/min",
    }
  );
  return result.map((sample) => ({
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
    effectiveDateTime: sample.endDate.toISOString(),
    valueQuantity: {
      value: sample.quantity,
      unit: "beats/minute",
      system: "http://unitsofmeasure.org",
      code: "/min",
    },
  }));
};

const readBloodPressure = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthkit();
  const grantedPermissions = await Healthkit.requestAuthorization([
    HKQuantityTypeIdentifier.bloodPressureSystolic,
    HKQuantityTypeIdentifier.bloodPressureDiastolic,
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Blood Pressure data was not granted");
  }
  const systolicResult = await Healthkit.queryQuantitySamples(
    HKQuantityTypeIdentifier.bloodPressureSystolic,
    {
      from: startTime,
      to: endTime,
      unit: "mmHg",
    }
  );
  const diastolicResult = await Healthkit.queryQuantitySamples(
    HKQuantityTypeIdentifier.bloodPressureDiastolic,
    {
      from: startTime,
      to: endTime,
      unit: "mmHg",
    }
  );
  return systolicResult.map((systolicSample, index) => ({
    resourceType: "Observation",
    status: "final",
    code: {
      coding: [
        {
          system: "http://loinc.org",
          code: "55284-4",
          display: "Blood pressure systolic and diastolic",
        },
      ],
      text: "Blood pressure systolic and diastolic",
    },
    effectiveDateTime: systolicSample.endDate.toISOString(),
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
          value: systolicSample.quantity,
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
          value: diastolicResult[index].quantity,
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
  await initHealthkit();
  const grantedPermissions = await Healthkit.requestAuthorization([
    HKQuantityTypeIdentifier.bloodGlucose,
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Blood Glucose data was not granted");
  }
  const result = await Healthkit.queryQuantitySamples(
    HKQuantityTypeIdentifier.bloodGlucose,
    {
      from: startTime,
      to: endTime,
      unit: BloodGlucoseUnit.GlucoseMgPerDl,
    }
  );
  return result.map((sample) => ({
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
    effectiveDateTime: sample.endDate.toISOString(),
    valueQuantity: {
      value: sample.quantity,
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
  await initHealthkit();
  const grantedPermissions = await Healthkit.requestAuthorization([
    HKQuantityTypeIdentifier.stepCount,
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Step Count data was not granted");
  }
  const result = await Healthkit.queryQuantitySamples(
    HKQuantityTypeIdentifier.stepCount,
    {
      from: startTime,
      to: endTime,
    }
  );
  // group by day
  const groupedResult = result.reduce((acc, sample) => {
    const date = sample.endDate.toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += sample.quantity;
    return acc;
  }, {} as Record<string, number>);
  const stepsPerDay = Object.keys(groupedResult).map((date) => ({
    time: date,
    count: groupedResult[date],
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
  await initHealthkit();
  const grantedPermissions = await Healthkit.requestAuthorization([
    HKQuantityTypeIdentifier.bodyMass,
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Weight data was not granted");
  }
  const result = await Healthkit.queryQuantitySamples(
    HKQuantityTypeIdentifier.bodyMass,
    {
      from: startTime,
      to: endTime,
      unit: "kg",
    }
  );
  return result.map((sample) => ({
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
    effectiveDateTime: sample.endDate.toISOString(),
    valueQuantity: {
      value: sample.quantity,
      unit: "kg",
      system: "http://unitsofmeasure.org",
      code: "kg",
    },
  }));
}

const readHeight = async (
  startTime: Date,
  endTime: Date
): Promise<Observation[]> => {
  await initHealthkit();
  const grantedPermissions = await Healthkit.requestAuthorization([
    HKQuantityTypeIdentifier.height,
  ]);
  if (!grantedPermissions) {
    throw new Error("Permission to read Height data was not granted");
  }
  const result = await Healthkit.queryQuantitySamples(
    HKQuantityTypeIdentifier.height,
    {
      from: startTime,
      to: endTime,
      unit: "cm",
    }
  );
  return result.map((sample) => ({
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
    effectiveDateTime: sample.endDate.toISOString(),
    valueQuantity: {
      value: sample.quantity,
      unit: "cm",
      system: "http://unitsofmeasure.org",
      code: "cm",
    },
  }));
}

const initHealthkit = async () => {
  const isAvailable = await Healthkit.isHealthDataAvailable();
  if (!isAvailable) {
    throw new Error("Health data is not available on this device");
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
