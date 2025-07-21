import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Register } from "./pages/register/Register";
import { FallBack } from "./pages/fallback/Fallback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Register />,
    errorElement: <FallBack />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <FallBack />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
