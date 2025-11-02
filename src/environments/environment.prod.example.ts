import { Environment } from "@core/models/environment.model";

export const environment: Environment = {
    production: true,
    apiUrl: "",
    idpUrl: "https://idp-gc.bariserv.net",
    idpRealm: "gc-prod",
    idpClientId: "gc-front",
};
