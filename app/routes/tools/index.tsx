import React from "react";
import type { LoaderFunction } from "remix";
import { H1, H3 } from "../../components/styled";

export const loader: LoaderFunction = async () => {
  return {};
};

export default function ToolsIndex() {
  return (
    <div className="max-w-prose mx-auto my-4 lg:my-16">
      <H1 className="mb-4">Tools</H1>
      <ul className="flex flex-col space-y-4">
        <li>
          <div className="py-5">
            <H3>
              <a href={`/tools/worth-it-to-automate`}>
                Is it worth it to automate?
              </a>
            </H3>

            <p className="text-gray-600"></p>
          </div>
        </li>
      </ul>
    </div>
  );
}
