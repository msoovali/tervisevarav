import { Observation } from "fhir/r5";

const readHeartRate = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
};

const readBloodPressure = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
}

const readBodyTemperature = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
};

const readSteps = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
}

const readDistance = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
}

const readWeight = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
}

const readHeight = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
}

const readRestingHeartRate = async (startTime: Date, endTime: Date): Promise<Observation[]> => {
    throw new Error("Not implemented");
};

type HealthCollector = {
    readHeartRate: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readBloodPressure: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readBodyTemperature: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readSteps: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readDistance: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readWeight: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readHeight: (startTime: Date, endTime: Date) => Promise<Observation[]>;
    readRestingHeartRate: (startTime: Date, endTime: Date) => Promise<Observation[]>;
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
} as HealthCollector;