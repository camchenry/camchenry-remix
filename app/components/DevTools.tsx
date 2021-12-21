import {
  useMatches,
  useParams,
  useTransition,
  useLocation,
  useLoaderData,
  useActionData,
  useNavigate,
  useNavigationType,
} from "remix";
import * as Popover from "@radix-ui/react-popover";
import { styled } from "@stitches/react";
import * as Toolbar from "@radix-ui/react-toolbar";
import React from "react";

const shadow = {
  small: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  normal: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  medium: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  large: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xlarge: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
};

const sizes = {
  0: "0rem",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.5rem",
  6: "2rem",
  7: "2.5rem",
  8: "3rem",
  9: "4rem",
};

const colors = {
  slate: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
};

const Code = styled("code", {
  fontFamily: "monospace",
});

const ToolbarRoot = styled(Toolbar.Root, {
  display: "flex",
  gap: sizes[4],
  position: "sticky",
  alignItems: "center",
  background: colors.slate[800],
  color: colors.slate[100],
  padding: `${sizes[2]} ${sizes[3]}`,
  boxShadow: shadow.small,
});

const ToolbarSeparator = styled(Toolbar.Separator, {
  borderLeft: `1px solid ${colors.slate[500]}`,
  display: "inline-block",
  height: 16,
});

const PopoverHeader = styled("div", {
  fontSize: "1.5rem",
  fontWeight: "bold",
});

const PopoverContent = styled(Popover.Content, {
  color: colors.slate[900],
  background: "White",
  padding: sizes[4],
  boxShadow: shadow.xlarge,
  minWidth: "30ch",
});

const PopoverArrow = styled(Popover.Arrow, {
  fill: "white",
});

const NameValuePair = ({
  name,
  value,
}: {
  name: string;
  value: string | undefined | null | number | boolean;
}) => (
  <>
    <dt style={{ display: "inline-block", fontWeight: "bold" }}>
      <Code>{name}:</Code>
    </dt>{" "}
    <dd style={{ display: "inline-block" }}>
      <Code>{value}</Code>
    </dd>
  </>
);

const BlueTag = styled("span", {
  background: "#93C5FD",
  color: "#1E3A8A",
  borderRadius: "0.25rem",
  padding: "0.25rem",
  marginRight: "0.5rem",
  fontSize: "0.8rem",
  textTransform: "uppercase",
});

const PurpleTag = styled("span", {
  background: "#A5B4FC",
  color: "#312E81",
  borderRadius: "0.25rem",
  padding: "0.25rem",
  marginRight: "0.5rem",
  fontSize: "0.8rem",
  textTransform: "uppercase",
});

export function DevTools() {
  const matches = useMatches();
  const reverseMatches = [...matches].reverse();
  const params = useParams();
  const transition = useTransition();
  const actionData = useActionData();
  console.log(useNavigationType());
  return (
    <ToolbarRoot>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <svg
          viewBox="0 0 165 165"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          aria-labelledby="remix-run-logo-title"
          role="img"
          width="16px"
          height="16px"
          fill="currentColor"
          style={{ display: "inline-block" }}
        >
          <title id="remix-run-logo-title">Remix Logo</title>
          <path d="M0 161V136H45.5416C53.1486 136 54.8003 141.638 54.8003 145V161H0Z M133.85 124.16C135.3 142.762 135.3 151.482 135.3 161H92.2283C92.2283 158.927 92.2653 157.03 92.3028 155.107C92.4195 149.128 92.5411 142.894 91.5717 130.304C90.2905 111.872 82.3473 107.776 67.7419 107.776H54.8021H0V74.24H69.7918C88.2407 74.24 97.4651 68.632 97.4651 53.784C97.4651 40.728 88.2407 32.816 69.7918 32.816H0V0H77.4788C119.245 0 140 19.712 140 51.2C140 74.752 125.395 90.112 105.665 92.672C122.32 96 132.057 105.472 133.85 124.16Z" />
        </svg>
      </div>
      <ToolbarSeparator />
      <Popover.Root>
        <Popover.Trigger>
          {matches.length} {matches.length === 1 ? "route" : "routes"}
        </Popover.Trigger>
        <PopoverContent>
          <PopoverHeader>Routes</PopoverHeader>
          <ol>
            {reverseMatches.map((match, index) => (
              <li key={match.pathname}>
                {index === 0 ? <BlueTag>Current</BlueTag> : null}
                {index === matches.length - 1 ? (
                  <PurpleTag>Root</PurpleTag>
                ) : null}
                <span style={{ fontWeight: "bold" }}>
                  <Code>{match.pathname}</Code>
                </span>
                <div style={{ padding: `${sizes[3]} ${sizes[4]}` }}>
                  <details>
                    <summary>
                      Loader data ({JSON.stringify(match.data).length}B)
                    </summary>
                    <pre
                      style={{
                        maxWidth: "50ch",
                        maxHeight: "50vh",
                        overflow: "scroll",
                      }}
                    >
                      <Code>{JSON.stringify(match.data, null, 2)}</Code>
                    </pre>
                  </details>
                  {actionData && (
                    <details>
                      <summary>
                        Action data ({JSON.stringify(actionData).length}B)
                      </summary>
                      <pre
                        style={{
                          maxWidth: "50ch",
                          maxHeight: "50vh",
                          overflow: "scroll",
                        }}
                      >
                        <Code>{JSON.stringify(actionData, null, 2)}</Code>
                      </pre>
                    </details>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <PopoverArrow />
        </PopoverContent>
      </Popover.Root>
      <ToolbarSeparator />
      <Popover.Root>
        <Popover.Trigger>
          {Object.keys(params).length}{" "}
          {Object.keys(params).length === 1 ? "param" : "params"}
        </Popover.Trigger>
        <PopoverContent>
          <PopoverHeader>Parameters</PopoverHeader>
          <dl>
            {Object.entries(params).map(([key, value]) => (
              <NameValuePair key={key} name={key} value={value} />
            ))}
          </dl>
          <PopoverArrow />
        </PopoverContent>
      </Popover.Root>
      <ToolbarSeparator />
      <div>
        {transition.state === "idle" ? `💤 ${transition.state}` : null}
        {transition.state === "loading" ? `💿 ${transition.state}` : null}
        {transition.state === "submitting" ? `📫 ${transition.state}` : null}
      </div>
    </ToolbarRoot>
  );
}
