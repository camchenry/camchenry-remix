export enum DurationUnit {
  seconds = "seconds",
  minutes = "minutes",
  hours = "hours",
  days = "days",
  weeks = "weeks",
  months = "months",
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
    default:
      throw new Error(`Unknown duration unit: ${duration.unit}`);
  }
};

export const getTimeProfit = ({
  taskTime,
  taskRepetitions,
  timeToAutomate,
}: {
  taskTime: Duration;
  taskRepetitions: number;
  timeToAutomate: Duration;
}) => {
  const value = getSecondsFromDuration(taskTime) * taskRepetitions;
  const cost = getSecondsFromDuration(timeToAutomate);
  const timeProfit = value - cost;
  return timeProfit;
};
