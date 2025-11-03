import { Routes } from "@angular/router";

export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full",
    },
    {
        path: "home",
        loadChildren: () => import("./features/home/home.routes").then((r) => r.homeRoutes),
    },
    {
        path: "users",
        loadChildren: () => import("./features/users/users.routes").then((r) => r.usersRoutes),
    },
    {
        path: "**",
        redirectTo: "/home",
    },
];
