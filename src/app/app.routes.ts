import { Routes } from "@angular/router";

export const appRoutes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full",
    },
    {
        path: "auth",
        loadChildren: () => import("./features/auth/auth.routes").then((r) => r.authRoutes),
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
        path: "world-of-warcraft",
        loadChildren: () =>
            import("./features/world-of-warcraft/world-of-warcraft.routes").then((r) => r.worldOfWarcraftRoutes),
    },
    {
        path: "league-of-legends",
        loadChildren: () =>
            import("./features/league-of-legends/league-of-legends.routes").then((r) => r.leagueOfLegendsRoutes),
    },
    {
        path: "offline",
        loadComponent: () =>
            import("@core/layout/splash/components/offline/offline.component").then((m) => m.OfflineComponent),
    },
    {
        path: "**",
        redirectTo: "/home",
    },
];
