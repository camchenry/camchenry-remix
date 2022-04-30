import { LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import blogStyles from "../styles/routes/blog/blog.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: blogStyles }];
};
export default function Blog() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
