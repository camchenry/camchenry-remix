import { Outlet } from "react-router-dom";

export default function Blog() {
  return (
    <div>
      <h2>Blog</h2>
      <Outlet />
    </div>
  );
}
