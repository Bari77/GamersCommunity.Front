import { Routes } from "@angular/router";
import { UnauthGuard } from "@core/guards/unauth.guard";

export const usersRoutes: Routes = [
    {
        path: "login",
        loadComponent: () => import("./pages/login/login.component").then((m) => m.LoginComponent),
        canActivate: [UnauthGuard],
    },
    {
        path: "logout",
        loadComponent: () => import("./pages/logout/logout.component").then((m) => m.LogoutComponent),
    },
];
