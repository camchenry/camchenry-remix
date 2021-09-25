import { registerFont } from "canvas";
import { useForm } from "react-hook-form";
import {
  Button,
  H1,
  H2,
  Input,
  Label,
  Select,
} from "../../../components/styled";
import { DurationUnit, getTimeProfit } from "./time-profit";
import { formatDistance } from "date-fns";

type TimeProfitParameters = Parameters<typeof getTimeProfit>[0];

const WorthItDisplay = ({
  taskRepetitions,
  taskTimeSaved: taskTime,
  timeToAutomate,
}: TimeProfitParameters) => {
  console.log({ taskRepetitions, taskTime, timeToAutomate });

  if (!taskTime.value || !timeToAutomate.value) {
    return null;
  }

  const profit = getTimeProfit({
    taskRepetitions,
    taskTimeSaved: taskTime,
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
  const { register, watch, handleSubmit } = useForm<TimeProfitParameters>({
    defaultValues: {
      taskTimeSaved: {
        unit: "hours",
      },
      timeToAutomate: {
        unit: "hours",
      },
      taskRepetitions: 1,
    },
    shouldUseNativeValidation: true,
  });

  const values = watch();

  return (
    <div>
      <H1 className="mb-4">Is it worth it to automate?</H1>
      <div className="flex">
        <form onSubmit={handleSubmit(() => {})}>
          <div className="mb-5">
            <div className="flex mb-1">
              <div className="mr-4">
                <Label htmlFor="taskTime">Time saved</Label>
                <Input
                  {...register("taskTime.value", { valueAsNumber: true })}
                  id="taskTime"
                  type="number"
                  required
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="taskTimeUnit">Unit</Label>
                <Select id="taskTimeUnit" {...register("taskTime.unit")}>
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
              {...register("taskRepetitions", { valueAsNumber: true })}
              id="taskRepetitions"
              type="number"
              required
              min={1}
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
                  {...register("timeToAutomate.value", { valueAsNumber: true })}
                  id="timeToAutomate"
                  type="number"
                  required
                  min={0}
                />
              </div>
              <div>
                <Label htmlFor="taskTimeUnit">Unit</Label>
                <Select {...register("timeToAutomate.unit")} id="taskTimeUnit">
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
          <Button>Calculate</Button>
        </form>
        <div>
          <WorthItDisplay
            taskTimeSaved={values.taskTimeSaved}
            timeToAutomate={values.timeToAutomate}
            taskRepetitions={values.taskRepetitions}
          />
        </div>
      </div>
    </div>
  );
}
