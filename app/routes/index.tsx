import type { MetaFunction, LinksFunction, LoaderFunction } from "remix";
import { useRouteData } from "remix";
import { defaultMeta } from "../meta";

import stylesUrl from "../styles/index.css";

export const meta: MetaFunction = () => {
  return { ...defaultMeta };
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader: LoaderFunction = async () => {
  return { message: "this is awesome 😎" };
};

export default function Index() {
  const data = useRouteData();

  return (
    <div style={{ textAlign: "center", padding: 20 }}>This is my homepage</div>
  );
}
