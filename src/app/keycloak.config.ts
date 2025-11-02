import { EnvironmentProviders } from "@angular/core";
import { environment } from "environments/environment";
import {
    provideKeycloak,
    createInterceptorCondition,
    IncludeBearerTokenCondition,
    INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    withAutoRefreshToken,
    AutoRefreshTokenService,
    UserActivityService,
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
            onLoad: "check-sso",
            silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
            checkLoginIframe: true,
            redirectUri: `${window.location.origin}/`,
        },
        features: [
            withAutoRefreshToken({
                onInactivityTimeout: "logout",
                sessionTimeout: 1000,
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
