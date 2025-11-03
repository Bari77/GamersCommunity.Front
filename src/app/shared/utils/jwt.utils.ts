export class JwtUtils {
    public static extractAccessTokenFromHash(): string | null {
        const hash = window.location.hash?.substring(1) ?? "";
        if (!hash.includes("access_token=")) return null;
        const params = new URLSearchParams(hash);
        return params.get("access_token");
    }

    public static decodeJwt(token: string): any {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join(""),
            );
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Erreur lors du décodage du token :", e);
            return null;
        }
    }
}
