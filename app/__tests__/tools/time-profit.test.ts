import { getTimeProfit } from "../../routes/tools/worth-it-to-automate/time-profit";

it("calculates time profit correctly", () => {
  expect(
    getTimeProfit({
      taskTime: 5 * 60 /* 5 mins per day */,
      taskRepetitions: 90 /* once per day, over 3 months */,
      timeToAutomate: 45 * 60 /* 45 mins to automate */,
      resource: 1 /* 1 dev */,
    })
  ).toEqual(405 * 60 /* 405 minutes saved */);
  expect(
    getTimeProfit({
      taskTime: /* 30 minutes */ 30 * 60,
      taskRepetitions:
        /* 3-10 (avg 6) times per week */ 6 *
        4 *
        12 /* 4 weeks per month, over 1 year */,
      timeToAutomate: /* 60 hours */ 60 * 60 * 60,
      resource: 1 /* 1 dev */,
    })
  ).toEqual(302400);
});
