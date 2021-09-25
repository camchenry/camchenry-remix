/**
 * The number of days in a mean year, for the Gregorian calendar.
 */
const daysInYear = 365.2425;

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

export const getSecondsFromDuration = (duration: Duration): number => {
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
      return duration.value * 60 * 60 * 24 * daysInYear;
    default:
      throw new Error(`Unknown duration unit: ${duration.unit}`);
  }
};

export const getDaysInDuration = (duration: Duration) => {
  switch (duration.unit) {
    case "seconds":
      return duration.value / 60 / 60 / 24;
    case "minutes":
      return duration.value / 60 / 24;
    case "hours":
      return duration.value / 24;
    case "days":
      return duration.value;
    case "weeks":
      return duration.value * 7;
    case "months":
      return duration.value * 30;
    case "years":
      return duration.value * daysInYear;
    default:
      throw new Error(`Unknown duration unit: ${duration.unit}`);
  }
};

export const getWeeksInDuration = (duration: Duration) => {
  switch (duration.unit) {
    case "seconds":
      return duration.value / 60 / 60 / 24 / 7;
    case "minutes":
      return duration.value / 60 / 24 / 7;
    case "hours":
      return duration.value / 24 / 7;
    case "days":
      return duration.value / 7;
    case "weeks":
      return duration.value;
    case "months":
      return (duration.value * 30) / 7;
    case "years":
      return (duration.value * daysInYear) / 7;
    default:
      throw new Error(`Unknown duration unit: ${duration.unit}`);
  }
};

export const getMonthsInDuration = (duration: Duration) => {
  switch (duration.unit) {
    case "seconds":
      return duration.value / 60 / 60 / 24 / 30;
    case "minutes":
      return duration.value / 60 / 24 / 30;
    case "hours":
      return duration.value / 24 / 30;
    case "days":
      return duration.value / 30;
    case "weeks":
      return duration.value / (30 / 7);
    case "months":
      return duration.value;
    case "years":
      return duration.value * 12;
    default:
      throw new Error(`Unknown duration unit: ${duration.unit}`);
  }
};

export const getYearsInDuration = (duration: Duration) => {
  switch (duration.unit) {
    case "seconds":
      return duration.value / 60 / 60 / 24 / daysInYear;
    case "minutes":
      return duration.value / 60 / 24 / daysInYear;
    case "hours":
      return duration.value / 24 / daysInYear;
    case "days":
      return duration.value / daysInYear;
    case "weeks":
      return duration.value / (daysInYear / 7);
    case "months":
      return duration.value / (daysInYear / 30);
    case "years":
      return duration.value;
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
      const daysInInterval = getDaysInDuration(interval);
      return Math.floor(daysInInterval * frequency.value);
    }
    case "weekly": {
      const weeksInInterval = getWeeksInDuration(interval);
      return Math.floor(weeksInInterval * frequency.value);
    }
    case "monthly": {
      const monthsInInterval = getMonthsInDuration(interval);
      return Math.floor(monthsInInterval * frequency.value);
    }
    case "yearly": {
      const yearsInInterval = getYearsInDuration(interval);
      return Math.floor(yearsInInterval * frequency.value);
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
