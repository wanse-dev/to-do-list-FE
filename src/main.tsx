import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import PrivateRoute from "./pages/privateRoute/PrivateRoute";
import { FallBack } from "./pages/fallback/Fallback";
import { Register } from "./pages/auth/register/Register";
import { Login } from "./pages/auth/login/Login";
import { Tasks } from "./pages/tasks/Tasks.tsx";
import { AuthProvider } from "./contexts/authContext/index.tsx";

const router = createBrowserRouter([
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
      path: "/login",
      element: <Login />,
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
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
