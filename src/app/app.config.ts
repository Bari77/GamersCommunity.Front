import {
    ApplicationConfig,
    importProvidersFrom,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { appRoutes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { includeBearerTokenInterceptor } from "keycloak-angular";
import { NbThemeModule, NbLayoutModule, NbDialogModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { provideKeycloakAngular } from "./keycloak.config";

export const appConfig: ApplicationConfig = {
    providers: [
        provideKeycloakAngular(),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({
            eventCoalescing: true,
        }),
        provideRouter(appRoutes),
        provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
        importProvidersFrom(
            NbThemeModule.forRoot({ name: "cosmic" }),
            NbDialogModule.forRoot(),
            NbLayoutModule,
            NbEvaIconsModule,
        ),
    ],
};
