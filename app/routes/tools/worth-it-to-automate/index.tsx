import { Button, H1, H2, Input, Label } from "../../../components/styled";
import { LoaderFunction, useRouteData } from "remix";
import { getTimeProfit } from "./time-profit";

type LoaderData = {
  profit?: number;
};

export const loader: LoaderFunction = ({ params, request }): LoaderData => {
  const url = new URL(request.url);
  const taskTime = url.searchParams.get("taskTime");
  const taskRepetitions = url.searchParams.get("taskRepetitions");
  const timeToAutomate = url.searchParams.get("timeToAutomate");
  const resources = url.searchParams.get("resources");
  if (taskTime && taskRepetitions && timeToAutomate && resources) {
    return {
      profit: getTimeProfit({
        taskTime: Number(taskTime),
        taskRepetitions: Number(taskRepetitions),
        timeToAutomate: Number(timeToAutomate),
        resource: Number(resources),
      }),
    };
  }
  return {};
};

export default function WorthItToAutomate() {
  const { profit } = useRouteData<LoaderData>();

  const header = <H1 className="mb-4">Is it worth it to automate?</H1>;

  if (profit) {
    if (profit > 0) {
      return (
        <div>
          {header}
          <H2>You can automate this task!</H2>
          <p>You can automate this task to save {profit} seconds.</p>
        </div>
      );
    } else if (profit === 0) {
      return (
        <div>
          {header}
          <H2>You can automate this task!</H2>
          <p>
            However, automating this task will not save any time, but it will
            not waste any time either.
          </p>
        </div>
      );
    } else if (profit < 0) {
      return (
        <div>
          {header}
          <H2>You cannot automate this task!</H2>
          <p>
            You cannot automate this task for {-profit} seconds. This is because
            you will not be able to save any time.
          </p>
        </div>
      );
    }
  }
  return (
    <div>
      <H1 className="mb-4">Is it worth it to automate?</H1>
      <form>
        <div className="mb-5">
          <Label htmlFor="taskTime">Task time (seconds): </Label>
          <Input id="taskTime" type="number" name="taskTime" className="mb-1" />
          <p className="text-gray-500">
            This is how long the task takes to complete each time it occurs.
          </p>
        </div>
        <div className="mb-5">
          <Label htmlFor="taskRepetitions" className="mb-1">
            Task repetitions:{" "}
          </Label>
          <Input
            id="taskRepetitions"
            type="number"
            name="taskRepetitions"
            className="mb-1"
          />
          <p className="text-gray-500">
            This is the number of times that the task will be done.
          </p>
        </div>
        <div className="mb-5">
          <Label htmlFor="timeToAutomate" className="mb-1">
            Time to automate (seconds):
          </Label>
          <Input
            id="timeToAutomate"
            type="number"
            name="timeToAutomate"
            className="mb-1"
          />
          <p className="text-gray-500">
            This is amount of time that it will take to automate the task.
          </p>
        </div>
        <div className="mb-5">
          <Label htmlFor="resources" className="mb-1">
            Resources (people):
          </Label>
          <Input
            id="resources"
            type="number"
            name="resources"
            className="mb-1"
          />
          <p className="text-gray-500">
            This is the number of resources that will be needed to automate the
            task.
          </p>
        </div>
        <Button>Calculate</Button>
      </form>
    </div>
  );
}
