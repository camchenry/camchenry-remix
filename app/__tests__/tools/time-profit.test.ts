import {
  getRepetitionsFromFrequency,
  getTimeProfit,
} from "../../routes/tools/worth-it-to-automate/time-profit";

it("calculates time profit correctly", () => {
  expect(
    getTimeProfit({
      taskTimeSaved: {
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
      taskTimeSaved: {
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
      taskTimeSaved: {
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
      taskTimeSaved: {
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
      taskTimeSaved: {
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
      taskTimeSaved: { value: 30, unit: "minutes" },
      taskRepetitions: 6 * 4 * 12,
      timeToAutomate: { value: 60, unit: "hours" },
    })
  );
});

describe("getRepetitionsFromFrequency", () => {
  it("calculates daily repetitions correctly", () => {
    expect(
      getRepetitionsFromFrequency({
        frequency: {
          value: 50,
          frequency: "daily",
        },
        interval: {
          value: 1,
          unit: "days",
        },
      })
    ).toEqual(50);
    expect(
      getRepetitionsFromFrequency({
        frequency: {
          value: 50,
          frequency: "daily",
        },
        interval: {
          value: 10,
          unit: "days",
        },
      })
    ).toEqual(500);
    expect(
      getRepetitionsFromFrequency({
        frequency: {
          value: 50,
          frequency: "daily",
        },
        interval: {
          value: 1,
          unit: "months",
        },
      })
    ).toEqual(30 * 50);
    expect(
      getRepetitionsFromFrequency({
        frequency: {
          value: 50,
          frequency: "daily",
        },
        interval: {
          value: 1,
          unit: "weeks",
        },
      })
    ).toEqual(350);
    expect(
      getRepetitionsFromFrequency({
        frequency: {
          value: 50,
          frequency: "daily",
        },
        interval: {
          value: 5,
          unit: "years",
        },
      })
    ).toEqual(91250);
  });
  it("calculates weekly repetitions correctly", () => {
    expect(
      getRepetitionsFromFrequency({
        frequency: {
          value: 3,
          frequency: "weekly",
        },
        interval: {
          value: 1,
          unit: "weeks",
        },
      })
    ).toEqual(3);
    expect(
      getRepetitionsFromFrequency({
        frequency: {
          value: 7,
          frequency: "weekly",
        },
        interval: {
          value: 1,
          unit: "months",
        },
      })
    ).toEqual(28);
    expect(
      getRepetitionsFromFrequency({
        frequency: {
          value: 2,
          frequency: "weekly",
        },
        interval: {
          value: 1,
          unit: "years",
        },
      })
    ).toEqual(104);
  });
});
