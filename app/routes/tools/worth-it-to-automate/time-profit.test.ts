import { getTimeProfit } from "./time-profit";

it("calculates time profit correctly", () => {
  expect(
    getTimeProfit({
      taskTime: 5 * 60 /* 5 mins per day */,
      taskRepetitions: 90 /* once per day, over 3 months */,
      timeToAutomate: 45 * 60 /* 45 mins to automate */,
      resource: 1 /* 1 dev */,
    })
  ).toEqual(405 * 60 /* 405 minutes saved */);
});
