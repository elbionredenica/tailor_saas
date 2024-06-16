import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import DressesList from "./components/Dresses/DressesList";
import Dress from "./components/Dresses/Dress";
import ClientsList from "./components/Clients/ClientsList";
import ClientDetails from "./components/Clients/ClientDetails";
import Client from "./components/Clients/Client";
import OrdersList from "./components/Orders/OrdersList";
import Order from "./components/Orders/Order";
import ExpensesList from "./components/Expenses/ExpensesList";
import Expense from "./components/Expenses/Expense";
import RentalsList from "./components/Rentals/RentalsList";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/dresses",
        element: <DressesList />,
      },
      {
        path: "/clients",
        element: <ClientsList />,
      },
      {
        path: "/client/:id",
        element: <ClientDetails />,
      },
      {
        path: "/orders",
        element: <OrdersList />,
      },
      {
        path: "/expenses",
        element: <ExpensesList />,
      },
      {
        path: "/rentals",
        element: <RentalsList />
      },
      {
        path: "/clients/create",
        element: <Client />,
      },
      {
        path: "/dresses/create",
        element: <Dress />,
      },
      {
        path: "/orders/create",
        element: <Order />,
      },
      {
        path: "/expenses/create",
        element: <Expense />,
      },
      {
        path: "/client/edit/:id",
        element: <Client />,
      },
      {
        path: "/dress/edit/:id",
        element: <Dress />,
      },
      {
        path: "/order/edit/:id",
        element: <Order />,
      },
      {
        path: "/expense/edit/:id",
        element: <Expense />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);