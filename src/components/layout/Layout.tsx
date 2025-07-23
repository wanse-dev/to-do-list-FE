import { Outlet } from "react-router";
import { Navbar } from "../navbar/Navbar";

export const Layout = () => (
  <div className="layout">
    <Navbar />
    <Outlet />
  </div>
);
