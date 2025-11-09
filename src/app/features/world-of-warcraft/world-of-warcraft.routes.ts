import { Routes } from "@angular/router";

export const worldOfWarcraftRoutes: Routes = [
    {
        path: "",
        loadComponent: () =>
            import("./pages/home-container/home-container.component").then((m) => m.HomeContainerComponent),
    },
];
