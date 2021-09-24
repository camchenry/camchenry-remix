import { getTimeProfit } from "../../routes/tools/worth-it-to-automate/time-profit";

it("calculates time profit correctly", () => {
  expect(
    getTimeProfit({
      taskTime: {
        value: 5 * 60 /* 5 mins per day */,
        unit: "seconds",
      },
      taskRepetitions: 90 /* once per day, over 3 months */,
      timeToAutomate: {
        value: 45 * 60 /* 45 mins to automate */,
        unit: "seconds",
      },
    })
  ).toEqual(405 * 60 /* 405 minutes saved */);
  expect(
    getTimeProfit({
      taskTime: {
        value: /* 30 minutes */ 30 * 60,
        unit: "seconds",
      },
      taskRepetitions:
        /* 3-10 (avg 6) times per week; 4 weeks per month; over 1 year (12 months) */ 6 *
        4 *
        12,
      timeToAutomate: {
        value: /* 60 hours */ 60 * 60 * 60,
        unit: "seconds",
      },
    })
  ).toEqual(302400);
});

it("handles unit conversions correctly", () => {
  expect(
    getTimeProfit({
      taskTime: {
        value: 5 * 60 /* 5 mins per day */,
        unit: "seconds",
      },
      taskRepetitions: 90 /* once per day, over 3 months */,
      timeToAutomate: {
        value: 45 * 60 /* 45 mins to automate */,
        unit: "seconds",
      },
    })
  ).toEqual(
    getTimeProfit({
      taskTime: {
        value: 5 /* 5 mins per day */,
        unit: "minutes",
      },
      taskRepetitions: 90 /* once per day, over 3 months */,
      timeToAutomate: {
        value: 45 /* 45 mins to automate */,
        unit: "minutes",
      },
    })
  );

  expect(
    getTimeProfit({
      taskTime: {
        value: /* 30 minutes */ 30 * 60,
        unit: "seconds",
      },
      taskRepetitions:
        /* 3-10 (avg 6) times per week; 4 weeks per month; over 1 year (12 months) */ 6 *
        4 *
        12,
      timeToAutomate: {
        value: /* 60 hours */ 60 * 60 * 60,
        unit: "seconds",
      },
    })
  ).toEqual(
    getTimeProfit({
      taskTime: { value: 30, unit: "minutes" },
      taskRepetitions: 6 * 4 * 12,
      timeToAutomate: { value: 60, unit: "hours" },
    })
  );
});
