import { Routes } from "@angular/router";

export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "/auth/login",
        pathMatch: "full",
    },
    {
        path: "auth",
        loadChildren: () => import("./features/auth/auth.routes").then((r) => r.authRoutes),
    },
    {
        path: "**",
        redirectTo: "/auth/login",
    },
];
