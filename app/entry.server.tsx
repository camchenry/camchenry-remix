import { EntryContext, redirect as remixRedirect } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import ReactDOMServer from "react-dom/server";
import fs from "./fs";
import path from "./path";

function typedBoolean<T>(
  value: T
): value is Exclude<T, "" | 0 | false | null | undefined> {
  return Boolean(value);
}

type Redirect = {
  methods: string[];
  from: string;
  toUrl: URL;
};

const handleRedirect = (
  req: Request,
  redirects: Redirect[]
): Response | undefined => {
  for (const redirect of redirects) {
    try {
      if (
        !redirect.methods.includes("*") &&
        !redirect.methods.includes(req.method)
      ) {
        continue;
      }
      const url = new URL(req.url);

      const match = url.pathname.match(redirect.from);
      if (!match) continue;

      const toUrl = redirect.toUrl;

      toUrl.protocol = url.protocol;
      if (toUrl.host === "same_host") toUrl.host = url.host;

      for (const [key, value] of url.searchParams.entries()) {
        toUrl.searchParams.append(key, value);
      }
      return remixRedirect(toUrl.toString());
    } catch (error: unknown) {
      // an error in the redirect shouldn't stop the request from going through
      console.error(`Error processing redirects:`, {
        error,
        redirect,
        "req.url": req.url,
      });
    }
  }
};

const getPossibleRedirects = (redirectFile: string): Redirect[] => {
  const possibleMethods = [
    "HEAD",
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "PATCH",
    "*",
  ];
  const redirectsString = fs.readFileSync(redirectFile, "utf8");
  const redirects = redirectsString
    .split("\n")
    .map((line, lineNumber) => {
      if (!line.trim() || line.startsWith("#")) return null;

      let methods, from, to;
      const [one, two, three] = line
        .split(" ")
        .map((l) => l.trim())
        .filter(Boolean);
      if (!one) return null;

      const splitOne = one.split(",");
      if (possibleMethods.some((m) => splitOne.includes(m))) {
        methods = splitOne;
        from = two;
        to = three;
      } else {
        methods = ["*"];
        from = one;
        to = two;
      }

      if (!from || !to) {
        console.error(`Invalid redirect on line ${lineNumber + 1}: "${line}"`);
        return null;
      }

      const toUrl = to.includes("//")
        ? new URL(to)
        : new URL(`https://same_host${to}`);
      try {
        return {
          methods,
          // TODO: Use pathToRegexp here to support regex-based redirects
          from,
          toUrl,
        };
      } catch (error: unknown) {
        // if parsing the redirect fails, we'll warn, but we won't crash
        console.error(
          `Failed to parse redirect on line ${lineNumber}: "${line}"`
        );
        return null;
      }
    })
    .filter(typedBoolean);

  return redirects;
};

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  if (responseStatusCode === 404) {
    // Before returning a true 404 response page, try to check if there is a matching redirect

    const redirects = getPossibleRedirects(path.resolve("./_redirects"));
    const redirectResponse = handleRedirect(request, redirects);
    if (redirectResponse) {
      return redirectResponse;
    }
  }

  const markup = ReactDOMServer.renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: {
      "Cache-Control":
        "public, max-age=600, s-maxage=31536000, stale-while-revalidate=86400",
      ...Object.fromEntries(responseHeaders),
      "Content-Type": "text/html",
    },
  });
}
