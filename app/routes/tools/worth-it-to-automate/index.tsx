import { formatDistance } from "date-fns";
import { useState } from "react";
import {
  Container,
  Details,
  H1,
  H2,
  Hr,
  Input,
  Label,
  Select,
  Summary,
} from "../../../components/styled";
import { DurationUnit, FrequencyUnit, getTimeProfit } from "./time-profit";
import styles from "../../../../styles/routes/tools/worth-it-to-automate.css";
import { LinksFunction } from "remix";

type TimeProfitParameters = Parameters<typeof getTimeProfit>[0];

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

const WorthItDisplay = ({
  taskRepetitions,
  taskTimeSaved,
  timeToAutomate,
}: TimeProfitParameters) => {
  if (Number.isNaN(taskTimeSaved.value) || Number.isNaN(timeToAutomate.value)) {
    return null;
  }

  const profit = getTimeProfit({
    taskRepetitions,
    taskTimeSaved,
    timeToAutomate,
  });

  if (profit > 0) {
    return (
      <section>
        <H2 className="mb-2">
          ✅ <strong>Yes</strong>, automate the task!
        </H2>
        <p>
          Automating this task would save{" "}
          <strong>
            {formatDistance(profit * 1000, 0, {
              includeSeconds: true,
            })}
          </strong>{" "}
          of time.
        </p>
      </section>
    );
  } else if (profit === 0) {
    return (
      <section>
        <H2 className="mb-2">
          ❓ <strong>Maybe</strong> automate the task.
        </H2>
        <p>
          However, automating this task will not save any time, but it will not
          waste any time either.
        </p>
      </section>
    );
  } else if (profit < 0) {
    return (
      <section>
        <H2 className="mb-2">
          ❌ <strong>No</strong>, don't automate the task.
        </H2>
        <p>
          Automating this task would waste{" "}
          <strong>
            {formatDistance(profit * 1000, 0, {
              includeSeconds: true,
            })}
          </strong>{" "}
          of time.
        </p>
      </section>
    );
  }

  return null;
};

const StepHeader = ({ children }: { children: React.ReactNode }) => (
  <H2 className="py-4 border-t step-header">{children}</H2>
);

export default function WorthItToAutomate() {
  const [taskTimeSaved, setTaskTimeSaved] = useState<number | undefined>();
  const [taskTimeSavedUnit, setTaskTimeSavedUnit] =
    useState<keyof typeof DurationUnit>("hours");
  const [frequency, setFrequency] = useState<number>(5);
  const [frequencyUnit, setFrequencyUnit] =
    useState<keyof typeof FrequencyUnit>("weekly");
  const [duration, setDuration] = useState<number>(1);
  const [durationUnit, setDurationUnit] =
    useState<keyof typeof DurationUnit>("years");
  const [timeToAutomate, setTimeToAutomate] = useState<number | undefined>();
  const [timeToAutomateUnit, setTimeToAutomateUnit] =
    useState<keyof typeof DurationUnit>("hours");

  const taskRepetitions = 0;

  return (
    <main>
      <Container>
        <H1 className="mb-4">Is it worth it to automate?</H1>
        <div className="mb-8">
          <section className="mb-5">
            <StepHeader>How much time is saved?</StepHeader>
            <div className="flex flex-wrap mb-1">
              <div className="mr-4">
                <Label htmlFor="taskTimeSaved">Time saved</Label>
                <Input
                  name="taskTimeSaved"
                  id="taskTimeSaved"
                  type="number"
                  required
                  min={0}
                  value={taskTimeSaved}
                  onChange={(e) => setTaskTimeSaved(e.target.valueAsNumber)}
                />
              </div>
              <div>
                <Label htmlFor="taskTimeSavedUnit">Unit</Label>
                <Select
                  id="taskTimeSavedUnit"
                  name="taskTimeSavedUnit"
                  value={taskTimeSavedUnit}
                  onChange={(e) =>
                    setTaskTimeSavedUnit(e.target.value as DurationUnit)
                  }
                >
                  {Object.entries(DurationUnit).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <p className="text-gray-500">
              This is how much time would be saved by automating the task.
            </p>
          </section>
          <section>
            <StepHeader>How often is the task done?</StepHeader>
            <div className="mb-5">
              <div className="flex flex-wrap mb-1">
                <div className="mr-4">
                  <Label htmlFor="frequency" className="mb-1">
                    Task occurrences
                  </Label>
                  <Input
                    name="frequency"
                    id="frequency"
                    type="number"
                    required
                    min={1}
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.valueAsNumber)}
                  />
                </div>
                <div>
                  <Label htmlFor="taskTimeSavedUnit">Frequency</Label>
                  <Select
                    id="frequencyUnit"
                    name="frequencyUnit"
                    value={frequencyUnit}
                    onChange={(e) =>
                      setFrequencyUnit(e.target.value as FrequencyUnit)
                    }
                  >
                    {Object.entries(FrequencyUnit).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <p className="text-gray-500">
                This is the number of times that the task will be done, and on
                what schedule it will occur. For example, something done each
                business day (Monday through Friday) would have 5 occurrences
                weekly.
              </p>
            </div>
            <div className="mb-5">
              <div className="flex flex-wrap mb-1">
                <div className="mr-4">
                  <Label htmlFor="duration" className="mb-1">
                    Time period
                  </Label>
                  <Input
                    name="duration"
                    id="duration"
                    type="number"
                    required
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(e.target.valueAsNumber)}
                  />
                </div>
                <div>
                  <Label htmlFor="durationUnit">Unit</Label>
                  <Select
                    id="durationUnit"
                    name="durationUnit"
                    value={durationUnit}
                    onChange={(e) =>
                      setDurationUnit(e.target.value as DurationUnit)
                    }
                  >
                    {Object.entries(DurationUnit).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <p className="text-gray-500">
                This is the period over which to calculate the total number of
                tasks. For example, a value of "1 year" would find how much time
                can be saved from automation in a year.
              </p>
            </div>
          </section>
          <section className="mb-5">
            <StepHeader>How long it will take to automate?</StepHeader>
            <div className="flex flex-wrap mb-1">
              <div className="mr-4">
                <Label htmlFor="timeToAutomate" className="mb-1">
                  Time to automate
                </Label>
                <Input
                  name="timeToAutomate"
                  id="timeToAutomate"
                  type="number"
                  required
                  min={0}
                  value={timeToAutomate}
                  onChange={(e) => setTimeToAutomate(e.target.valueAsNumber)}
                />
              </div>
              <div>
                <Label htmlFor="taskTimeSavedUnit">Unit</Label>
                <Select
                  name="timeToAutomateUnit"
                  id="timeToAutomateUnit"
                  value={timeToAutomateUnit}
                  onChange={(e) =>
                    setTimeToAutomateUnit(e.target.value as DurationUnit)
                  }
                >
                  {Object.entries(DurationUnit).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <p className="text-gray-500">
              This is amount of time that it will take to automate the task.
            </p>
          </section>
        </div>
        <div className="mb-8">
          {taskTimeSaved !== undefined && timeToAutomate !== undefined ? (
            <WorthItDisplay
              taskTimeSaved={{
                value: taskTimeSaved,
                unit: taskTimeSavedUnit,
              }}
              timeToAutomate={{
                unit: timeToAutomateUnit,
                value: timeToAutomate,
              }}
              taskRepetitions={taskRepetitions}
            />
          ) : (
            <p>
              Enter information about the task that you want to automate, and
              then a recommendation for automation will show up here.
            </p>
          )}
        </div>
        <Hr />
        <section>
          <H2 className="mb-4">Frequently Asked Questions</H2>
          <Details className="prose">
            <Summary>How is this calculated?</Summary>
            <p>
              The recommendation is calculated using a simple formula: <br />
              <var>time profit</var> = (<var>time saved</var> ✖️{" "}
              <var>number of repetitions</var>) - <var>time to automate</var>.
            </p>
            <p>
              If the time profit is greater than 0, then it is worth automating.
              If it is less than zero, then it is not worth automating. If the
              time profit is exactly equal zero, then it is the same amount of
              time, whether the task is automated or not.
            </p>
          </Details>
        </section>
      </Container>
    </main>
  );
}
