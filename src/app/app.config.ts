import {
    ApplicationConfig,
    importProvidersFrom,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { AuthGuard } from "@core/guards/auth.guard";
import { UnauthGuard } from "@core/guards/unauth.guard";
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import {
    NbAuthJWTInterceptor,
    NbAuthJWTToken,
    NbAuthModule,
    NbOAuth2AuthStrategy,
    NbOAuth2ResponseType,
} from "@nebular/auth";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import {
    NbButtonModule,
    NbCardModule,
    NbDialogModule,
    NbGlobalPhysicalPosition,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbMenuModule,
    NbThemeModule,
    NbToastrModule,
} from "@nebular/theme";
import { environment } from "environments/environment";
import { appRoutes } from "./app.routes";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({
            eventCoalescing: true,
        }),
        provideAnimations(),
        provideRouter(appRoutes),
        provideHttpClient(withInterceptors([errorInterceptor])),
        importProvidersFrom(
            // Nebular UI
            NbThemeModule.forRoot({ name: "cosmic" }),
            NbDialogModule.forRoot(),
            NbMenuModule.forRoot(),
            NbToastrModule.forRoot({
                duration: 5000,
                destroyByClick: true,
                position: NbGlobalPhysicalPosition.TOP_RIGHT,
            }),
            NbLayoutModule,
            NbEvaIconsModule,
            NbCardModule,
            NbButtonModule,
            NbInputModule,
            NbIconModule,

            // Nebular Auth (branché sur Keycloak)
            NbAuthModule.forRoot({
                strategies: [
                    NbOAuth2AuthStrategy.setup({
                        name: "keycloak",
                        baseEndpoint: `${environment.idpUrl}/realms/${environment.idpRealm}/protocol/openid-connect`,
                        clientId: environment.idpClientId,
                        authorize: {
                            endpoint: "/auth",
                            responseType: NbOAuth2ResponseType.TOKEN,
                            scope: "openid profile email offline_access",
                            redirectUri: "http://localhost:4200/",
                            requireValidToken: true,
                        },
                        token: {
                            class: NbAuthJWTToken,
                            requireValidToken: true,
                        },
                        refresh: {
                            endpoint: "/token",
                            grantType: "refresh_token",
                            requireValidToken: true,
                        },
                        redirect: {
                            success: "/home",
                        },
                    }),
                ],
                forms: {
                    login: {
                        strategy: "keycloak",
                        redirectDelay: 0,
                        showMessages: {
                            success: true,
                            error: true,
                        },
                    },
                    register: {
                        strategy: "keycloak",
                        redirectDelay: 0,
                    },
                    logout: {
                        strategy: "keycloak",
                        redirectDelay: 0,
                    },
                },
            }),
        ),

        // Interceptor JWT Nebular (ajoute automatiquement Authorization: Bearer ...)
        { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
        AuthGuard,
        UnauthGuard,
    ],
};
