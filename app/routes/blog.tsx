import { LinksFunction, Outlet } from "remix";
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
