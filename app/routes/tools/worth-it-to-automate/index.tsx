import { formatDistance } from "date-fns";
import { useState } from "react";
import { H1, H2, Input, Label, Select } from "../../../components/styled";
import { DurationUnit, getTimeProfit } from "./time-profit";

type TimeProfitParameters = Parameters<typeof getTimeProfit>[0];

const WorthItDisplay = ({
  taskRepetitions,
  taskTimeSaved,
  timeToAutomate,
}: TimeProfitParameters) => {
  if (Number.isNaN(taskTimeSaved.value) || Number.isNaN(timeToAutomate.value)) {
    return (
      <div>
        <p>
          Enter information about the task that you want to automate, and then
          the recommendation for whether you should automate or not will show up
          here.
        </p>
      </div>
    );
  }

  const profit = getTimeProfit({
    taskRepetitions,
    taskTimeSaved,
    timeToAutomate,
  });

  if (profit > 0) {
    return (
      <div>
        <H2>You should automate this task!</H2>
        <p>
          Automating this task would save{" "}
          <strong>
            {formatDistance(profit * 1000, 0, {
              includeSeconds: true,
            })}
          </strong>{" "}
          of time.
        </p>
      </div>
    );
  } else if (profit === 0) {
    return (
      <div>
        <H2>You could automate this task.</H2>
        <p>
          However, automating this task will not save any time, but it will not
          waste any time either.
        </p>
      </div>
    );
  } else if (profit < 0) {
    return (
      <div>
        <H2>You should not automate this task!</H2>
        <p>
          Automating this task would waste{" "}
          <strong>
            {formatDistance(profit * 1000, 0, {
              includeSeconds: true,
            })}
          </strong>{" "}
          of time.
        </p>
      </div>
    );
  }

  return null;
};

export default function WorthItToAutomate() {
  const [taskTimeSaved, setTaskTimeSaved] = useState<number | undefined>();
  const [taskTimeSavedUnit, setTaskTimeSavedUnit] =
    useState<keyof typeof DurationUnit>("hours");
  const [taskRepetitions, setTaskRepetitions] = useState<number>(1);
  const [timeToAutomate, setTimeToAutomate] = useState<number | undefined>();
  const [timeToAutomateUnit, setTimeToAutomateUnit] =
    useState<keyof typeof DurationUnit>("hours");

  return (
    <div>
      <H1 className="mb-4">Is it worth it to automate?</H1>
      <div className="md:flex">
        <div className="md:max-w-lg w-full md:mr-8 mb-8">
          <div className="mb-5">
            <div className="flex mb-1">
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
          </div>
          <div className="mb-5">
            <Label htmlFor="taskRepetitions" className="mb-1">
              Task repetitions
            </Label>
            <Input
              name="taskRepetitions"
              id="taskRepetitions"
              type="number"
              required
              min={1}
              value={taskRepetitions}
              onChange={(e) => setTaskRepetitions(e.target.valueAsNumber)}
            />
            <p className="text-gray-500">
              This is the number of times that the task will be done.
            </p>
          </div>
          <div className="mb-5">
            <div className="flex mb-1">
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
          </div>
        </div>
        <div>
          {taskTimeSaved !== undefined && timeToAutomate !== undefined && (
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
          )}
        </div>
      </div>
    </div>
  );
}
