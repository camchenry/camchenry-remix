/*
  ORIGINAL EQUATION TAKEN FROM:
  https://triplebyte.com/blog/when-task-automation-is-worth-your-time

  time profit = (task time * duration without automation) - (time to automate * resource) = time profit
 */
export const getTimeProfit = ({
  taskTime,
  taskRepetitions,
  timeToAutomate,
  resource,
}: {
  taskTime: number;
  taskRepetitions: number;
  timeToAutomate: number;
  resource: number;
}) => {
  const value = taskTime * taskRepetitions;
  const cost = timeToAutomate * resource;
  const timeProfit = value - cost;
  return timeProfit;
};
