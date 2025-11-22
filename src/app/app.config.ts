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
import { PermissionsService } from "@core/services/permissions.service";
import { RoleService } from "@core/services/role.service";
import { accessControlLol } from "@features/league-of-legends/nebular.security";
import { accessControlWow } from "@features/world-of-warcraft/nebular.security";
import {
    NbAuthJWTInterceptor,
    NbAuthJWTToken,
    NbAuthModule,
    NbOAuth2AuthStrategy,
    NbOAuth2ResponseType,
} from "@nebular/auth";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { NbRoleProvider, NbSecurityModule } from "@nebular/security";
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
import { accessControlGlobal } from "./nebular.security";

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

            // Nebular Auth
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
                            redirectUri: location.origin,
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

            // Nebular Security
            NbSecurityModule.forRoot({
                accessControl: {
                    ...accessControlGlobal,
                    ...accessControlLol,
                    ...accessControlWow,
                },
            }),
        ),

        // Interceptor JWT Nebular (ajoute automatiquement Authorization: Bearer ...)
        { provide: HTTP_INTERCEPTORS, useClass: NbAuthJWTInterceptor, multi: true },
        { provide: NbRoleProvider, useClass: RoleService },
        PermissionsService,
        AuthGuard,
        UnauthGuard,
    ],
};
