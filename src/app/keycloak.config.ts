import { EnvironmentProviders } from "@angular/core";
import { environment } from "environments/environment";
import {
    AutoRefreshTokenService,
    createInterceptorCondition,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    IncludeBearerTokenCondition,
    provideKeycloak,
    UserActivityService,
    withAutoRefreshToken,
} from "keycloak-angular";

function createUrlPatternFromApiUrl(apiUrl: string): RegExp {
    const base = apiUrl.replace(/\/+$/, "");
    const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`^(${escaped})(\\/.*)?$`, "i");
}

const apiCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: createUrlPatternFromApiUrl(environment.apiUrl),
});

export const provideKeycloakAngular = (): EnvironmentProviders =>
    provideKeycloak({
        config: {
            url: environment.idpUrl,
            realm: environment.idpRealm,
            clientId: environment.idpClientId,
        },
        initOptions: {
            onLoad: "login-required",
            silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
            checkLoginIframe: false,
            redirectUri: `${window.location.origin}/`,
        },
        features: [
            withAutoRefreshToken({
                onInactivityTimeout: "none",
                sessionTimeout: 600_000,
            }),
        ],
        providers: [
            AutoRefreshTokenService,
            UserActivityService,
            {
                provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
                useValue: [apiCondition],
            },
        ],
    });
