export enum DurationUnit {
  seconds = "seconds",
  minutes = "minutes",
  hours = "hours",
  days = "days",
  weeks = "weeks",
  months = "months",
  years = "years",
}

export type Duration = {
  value: number;
  unit: DurationUnit | keyof typeof DurationUnit;
};

const getSecondsFromDuration = (duration: Duration): number => {
  switch (duration.unit) {
    case "seconds":
      return duration.value;
    case "minutes":
      return duration.value * 60;
    case "hours":
      return duration.value * 60 * 60;
    case "days":
      return duration.value * 60 * 60 * 24;
    case "weeks":
      return duration.value * 60 * 60 * 24 * 7;
    case "months":
      return duration.value * 60 * 60 * 24 * 30;
    case "years":
      return duration.value * 60 * 60 * 24 * 365;
    default:
      throw new Error(`Unknown duration unit: ${duration.unit}`);
  }
};

export type Frequency = {
  value: number;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
};

/**
 * Given a frequency interval and a length of time, returns how many
 * repetitions would occur with
 */
export const getRepetitionsFromFrequency = ({
  frequency,
  interval,
}: {
  frequency: Frequency;
  interval: Duration;
}) => {
  switch (frequency.frequency) {
    case "daily": {
      const daysInInterval = Math.floor(
        getSecondsFromDuration(interval) / 60 / 60 / 24
      );
      return daysInInterval * frequency.value;
    }
    case "weekly": {
      const weeksInInterval = Math.floor(
        getSecondsFromDuration(interval) / 60 / 60 / 24 / 7
      );
      return weeksInInterval * frequency.value;
    }
    default:
      throw new Error(`Unknown frequency: ${frequency.frequency}`);
  }
};

/**
 * Given the time saved by automating a task, number of repetitions, and the
 * time it would take to automate, calculates the "time profit," which is the
 * total amount of time that is wasted/saved by automating the task.
 */
export const getTimeProfit = ({
  taskTimeSaved,
  taskRepetitions,
  timeToAutomate,
}: {
  taskTimeSaved: Duration;
  taskRepetitions: number;
  timeToAutomate: Duration;
}) => {
  const value = getSecondsFromDuration(taskTimeSaved) * taskRepetitions;
  const cost = getSecondsFromDuration(timeToAutomate);
  const timeProfit = value - cost;
  return timeProfit;
};
