import { LinksFunction, MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import blogStyles from "../styles/routes/blog/blog.css";
import { defaultMeta } from "../meta";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: blogStyles }];
};

export const meta: MetaFunction = () => {
  return { ...defaultMeta, title: `Blog | ${defaultMeta.title}` };
};

export default function Blog() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
