import { Outlet, type RouteObject } from "react-router-dom";
import Home from "./src/pages/Home/Home";
import NotFoundPage from "./src/pages/NotFoundPage/NotFoundPage";
import Code from "./src/pages/Code/Code";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <Outlet />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "editor/:lang",
                element: <Code />,
                // loader: async (): Promise<never> => {
                //     throw new Error("Failed to load dashboard data.");
                // }
            },
            {
                path: "*",
                element: <NotFoundPage />,
            }
        ]
    }
];

export { routes };