import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/authContext/index.tsx";
import PrivateRoute from "./pages/privateRoute/PrivateRoute";
import { Layout } from "./components/layout/Layout.tsx";
import { FallBack } from "./pages/fallback/Fallback";
import { Register } from "./pages/auth/register/Register";
import { Login } from "./pages/auth/login/Login";
import { Tasks } from "./pages/tasks/Tasks.tsx";
import { RecycleBin } from "./pages/recycle_bin/RecycleBin.tsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <FallBack />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <FallBack />,
  },
  {
    element: <Layout />,
    errorElement: <FallBack />,
    children: [
      {
        path: "/",
        element: <PrivateRoute component={Tasks} />,
        errorElement: <FallBack />,
      },
      {
        path: "/tasks",
        element: <PrivateRoute component={Tasks} />,
        errorElement: <FallBack />,
      },
      {
        path: "/recycle-bin",
        element: <PrivateRoute component={RecycleBin} />,
        errorElement: <FallBack />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
