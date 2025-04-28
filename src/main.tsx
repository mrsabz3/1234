import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./index.css";

import Home from "./pages/index";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Logout from "./pages/logout";
import Dashboard from "./pages/dashboard";
import GermanExercises from "./pages/german-exercises";
import MathExercises from "./pages/math-exercises";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/german-exercises",
    element: <GermanExercises />,
  },
  {
    path: "/math-exercises",
    element: <MathExercises />,
  },
]);

console.log("What")

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="studienkolleg-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
