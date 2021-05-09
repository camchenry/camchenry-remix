import type { LinksFunction, LoaderFunction, MetaFunction } from "remix";
import { Meta, Links, Scripts, useRouteData, LiveReload } from "remix";
import { Outlet } from "react-router-dom";

import stylesUrl from "./styles/global.css";
import { defaultMeta } from "./meta";

export const meta: MetaFunction = () => {
  return defaultMeta;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader: LoaderFunction = async () => {
  return { date: new Date() };
};

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}

        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteData();
  return (
    <Document>
      <nav>
        <a href="/">Home</a>
        <a href="/blog">Blog</a>
      </nav>
      <Outlet />
      <footer>
        <small>© Cameron McHenry 2016-{new Date().getFullYear()}</small>
        {process.env.NODE_ENV === "development" && (
          <p>This page was rendered at {data.date.toLocaleString()}</p>
        )}
      </footer>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document>
      <h1>App Error</h1>
      <pre>{error.message}</pre>
      <p>
        Replace this UI with what you want users to see when your app throws
        uncaught errors.
      </p>
    </Document>
  );
}
