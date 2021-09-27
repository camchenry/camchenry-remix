import {
  Frequency,
  getRepetitionsFromFrequency,
  getTimeProfit,
  Duration,
  getSecondsFromDuration,
  getDaysInDuration,
  getMonthsInDuration,
  getWeeksInDuration,
  getYearsInDuration,
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

// see: https://xkcd.com/1205/
const tests: {
  freq: [Frequency["value"], Frequency["frequency"]];
  timeShaved: [Duration["value"], Duration["unit"]];
  profit: [Duration["value"], Duration["unit"]];
}[] = [
  { freq: [50, "daily"], timeShaved: [1, "seconds"], profit: [1, "days"] },
  { freq: [50, "daily"], timeShaved: [5, "seconds"], profit: [5, "days"] },
  { freq: [50, "daily"], timeShaved: [30, "seconds"], profit: [4, "weeks"] },
  // FIXME: This may be wrong in the comic?
  // { freq: [50, "daily"], timeShaved: [1, "minutes"], profit: [8, "weeks"] },
  // FIXME: This may be wrong in the comic?
  // { freq: [50, "daily"], timeShaved: [5, "minutes"], profit: [9, "months"] },
  // FIXME: This may be wrong in the comic?
  // { freq: [50, "daily"], timeShaved: [5, "minutes"], profit: [9, "months"] },
  { freq: [5, "daily"], timeShaved: [1, "seconds"], profit: [2, "hours"] },
  { freq: [5, "daily"], timeShaved: [5, "seconds"], profit: [12, "hours"] },
  { freq: [5, "daily"], timeShaved: [30, "seconds"], profit: [3, "days"] },
  { freq: [5, "daily"], timeShaved: [1, "minutes"], profit: [6, "days"] },
  { freq: [5, "daily"], timeShaved: [1, "minutes"], profit: [6, "days"] },
  { freq: [5, "daily"], timeShaved: [5, "minutes"], profit: [4, "weeks"] },
  { freq: [5, "daily"], timeShaved: [30, "minutes"], profit: [6, "months"] },
  // FIXME: This may be wrong in the comic?
  // { freq: [5, "daily"], timeShaved: [1, "hours"], profit: [10, "months"] },
  { freq: [1, "daily"], timeShaved: [1, "seconds"], profit: [30, "minutes"] },
  { freq: [1, "daily"], timeShaved: [5, "seconds"], profit: [2, "hours"] },
  // FIXME: This may be wrong in the comic?
  // { freq: [1, "daily"], timeShaved: [30, "seconds"], profit: [12, "hours"] },
  { freq: [1, "daily"], timeShaved: [1, "minutes"], profit: [1, "days"] },
  { freq: [1, "daily"], timeShaved: [5, "minutes"], profit: [6, "days"] },
  { freq: [1, "daily"], timeShaved: [30, "minutes"], profit: [5, "weeks"] },
  { freq: [1, "daily"], timeShaved: [1, "hours"], profit: [2, "months"] },
  { freq: [1, "weekly"], timeShaved: [1, "seconds"], profit: [4, "minutes"] },
  { freq: [1, "weekly"], timeShaved: [5, "seconds"], profit: [21, "minutes"] },
  { freq: [1, "weekly"], timeShaved: [30, "seconds"], profit: [2, "hours"] },
  { freq: [1, "weekly"], timeShaved: [1, "minutes"], profit: [4, "hours"] },
  { freq: [1, "weekly"], timeShaved: [5, "minutes"], profit: [21, "hours"] },
  { freq: [1, "weekly"], timeShaved: [30, "minutes"], profit: [5, "days"] },
  { freq: [1, "weekly"], timeShaved: [1, "hours"], profit: [10, "days"] },
  { freq: [1, "weekly"], timeShaved: [6, "hours"], profit: [2, "months"] },
  { freq: [1, "monthly"], timeShaved: [1, "seconds"], profit: [1, "minutes"] },
  { freq: [1, "monthly"], timeShaved: [5, "seconds"], profit: [5, "minutes"] },
  {
    freq: [1, "monthly"],
    timeShaved: [30, "seconds"],
    profit: [30, "minutes"],
  },
  { freq: [1, "monthly"], timeShaved: [1, "minutes"], profit: [1, "hours"] },
  { freq: [1, "monthly"], timeShaved: [5, "minutes"], profit: [5, "hours"] },
  { freq: [1, "monthly"], timeShaved: [30, "minutes"], profit: [1, "days"] },
  { freq: [1, "monthly"], timeShaved: [1, "hours"], profit: [2, "days"] },
  { freq: [1, "monthly"], timeShaved: [6, "hours"], profit: [2, "weeks"] },
  { freq: [1, "monthly"], timeShaved: [1, "days"], profit: [8, "weeks"] },

  { freq: [1, "yearly"], timeShaved: [1, "seconds"], profit: [5, "seconds"] },
  { freq: [1, "yearly"], timeShaved: [5, "seconds"], profit: [25, "seconds"] },
  {
    freq: [1, "yearly"],
    timeShaved: [30, "seconds"],
    profit: [2, "minutes"],
  },
  { freq: [1, "yearly"], timeShaved: [1, "minutes"], profit: [5, "minutes"] },
  { freq: [1, "yearly"], timeShaved: [5, "minutes"], profit: [25, "minutes"] },
  { freq: [1, "yearly"], timeShaved: [30, "minutes"], profit: [2, "hours"] },
  { freq: [1, "yearly"], timeShaved: [1, "hours"], profit: [5, "hours"] },
  { freq: [1, "yearly"], timeShaved: [6, "hours"], profit: [1, "days"] },
  { freq: [1, "yearly"], timeShaved: [1, "days"], profit: [5, "days"] },
];
it.each(tests)(
  "shaving $timeShaved off a task done $freq will save $profit (over 5yrs)",
  ({ freq, timeShaved, profit }) => {
    let calculatedValue = getTimeProfit({
      taskTimeSaved: {
        value: timeShaved[0],
        unit: timeShaved[1],
      },
      taskRepetitions: getRepetitionsFromFrequency({
        frequency: { value: freq[0], frequency: freq[1] },
        interval: { value: 5, unit: "years" },
      }),
      timeToAutomate: {
        value: 0,
        unit: "seconds",
      },
    });
    let expectedValue = null;
    if (profit[1] === "seconds") {
      calculatedValue = Math.floor(calculatedValue);
      expectedValue = profit[0];
    } else if (profit[1] === "minutes") {
      calculatedValue = Math.floor(calculatedValue / 60);
      expectedValue = profit[0];
    } else if (profit[1] === "hours") {
      calculatedValue = Math.floor(calculatedValue / 60 / 60);
      expectedValue = profit[0];
    } else if (profit[1] === "days") {
      calculatedValue = Math.floor(
        getDaysInDuration({
          value: calculatedValue,
          unit: "seconds",
        })
      );
      expectedValue = profit[0];
    } else if (profit[1] === "weeks") {
      calculatedValue = Math.floor(
        getWeeksInDuration({
          value: calculatedValue,
          unit: "seconds",
        })
      );
      expectedValue = profit[0];
    } else if (profit[1] === "months") {
      calculatedValue = Math.floor(
        getMonthsInDuration({
          value: calculatedValue,
          unit: "seconds",
        })
      );
      expectedValue = profit[0];
    } else if (profit[1] === "years") {
      calculatedValue = Math.floor(
        getYearsInDuration({
          value: calculatedValue,
          unit: "seconds",
        })
      );
      expectedValue = profit[0];
    }
    expect(`${calculatedValue} ${profit[1]}`).toEqual(
      `${expectedValue} ${profit[1]}`
    );
  }
);

describe("getRepetitionsFromFrequency", () => {
  it("calculates daily repetitions correctly", () => {
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 50, frequency: "daily" },
        interval: { value: 10, unit: "days" },
      })
    ).toEqual(500);
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 50, frequency: "daily" },
        interval: { value: 2, unit: "weeks" },
      })
    ).toEqual(700);
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 50, frequency: "daily" },
        interval: { value: 1, unit: "months" },
      })
    ).toEqual(30 * 50);
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 50, frequency: "daily" },
        interval: { value: 5, unit: "years" },
      })
    ).toEqual(91310);
  });
  it("calculates weekly repetitions correctly", () => {
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 3, frequency: "weekly" },
        interval: { value: 1, unit: "weeks" },
      })
    ).toEqual(3);
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 7, frequency: "weekly" },
        interval: { value: 1, unit: "months" },
      })
    ).toEqual(30);
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 2, frequency: "weekly" },
        interval: { value: 1, unit: "years" },
      })
    ).toEqual(104);
  });
  it("calculates monthly repetitions correctly", () => {
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 2, frequency: "monthly" },
        interval: { value: 6, unit: "months" },
      })
    ).toEqual(12);
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 2, frequency: "monthly" },
        interval: { value: 10, unit: "years" },
      })
    ).toEqual(240);
  });
  it("calculates yearly repetitions correctly", () => {
    expect(
      getRepetitionsFromFrequency({
        frequency: { value: 4, frequency: "yearly" },
        interval: { value: 2, unit: "years" },
      })
    ).toEqual(8);
  });
});
