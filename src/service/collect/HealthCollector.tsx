import { Observation } from "fhir/r5";

const readHeartRate = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
};

const readBloodPressure = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
}

const readBloodGlucose = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
};

const readSteps = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
}

const readWeight = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
}

const readHeight = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
}

type HealthCollector = {
    readHeartRate: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readBloodPressure: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readBloodGlucose: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readSteps: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readWeight: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readHeight: (startTime: Date, endTime: Date) => Promise<Observation[]>;
};

export default {
    readHeartRate,
    readBloodPressure,
    readBloodGlucose,
    readSteps,
    readWeight,
    readHeight,
} as HealthCollector;