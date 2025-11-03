import { computed, inject, Injectable, signal } from "@angular/core";
import { NbDialogService, NbMenuItem, NbMenuService } from "@nebular/theme";
import { NbAuthJWTToken, NbAuthService, NbTokenService } from "@nebular/auth";
import { UsersService } from "../users.service";
import { User } from "../models/user.model";
import { NicknameDialogComponent } from "../components/nickname-dialog/nickname-dialog.component";
import { JwtUtils } from "@shared/utils/jwt.utils";
import { filter, finalize, map } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class UsersStore {
    public readonly loading = computed(() => this.$loading());
    public readonly user = computed(() => this.$user());
    public readonly isLoggedIn = computed(() => !!this.$user());
    public readonly discriminator = computed(() => `#${this.$user()?.discriminator}`);
    public readonly fullNickname = computed(() => `${this.$user()?.nickname}#${this.$user()?.discriminator}`);
    public readonly menuItems = computed(() => this.$menuItems());

    private readonly authService = inject(NbAuthService);
    private readonly tokenService = inject(NbTokenService);
    private readonly usersService = inject(UsersService);
    private readonly dialogService = inject(NbDialogService);
    private readonly menuService = inject(NbMenuService);
    private readonly router = inject(Router);

    private readonly $loading = signal<boolean>(false);
    private readonly $user = signal<User | null>(null);
    private readonly $menuItems = signal<NbMenuItem[]>([
        { data: "profile", title: $localize`:@@core.header.menu.profile:Profile`, icon: "person-outline" },
        { data: "logout", title: $localize`:@@core.header.menu.logout:Logout`, icon: "power-outline" },
    ]);

    public constructor() {
        this.initializeFromRedirect();

        this.authService.isAuthenticated().subscribe((authenticated) => {
            if (!authenticated) return;

            this.authService.getToken().subscribe({
                next: (token) => {
                    if (!token?.getValue()) return;
                    const payload = JwtUtils.decodeJwt(token.getValue());
                    this.loadUserFromPayload(payload);
                },
                error: (err) => console.error("Auth check error:", err),
            });
        });

        this.menuService
            .onItemClick()
            .pipe(
                filter(({ tag }) => tag === "header-user"),
                map(({ item: { data } }) => data),
            )
            .subscribe((data: string) => {
                switch (data) {
                    case "profile":
                        this.router.navigate(["/users/profile"]);
                        break;
                    case "logout":
                        this.logout();
                        break;
                }
            });
    }

    public login(): void {
        this.$loading.set(true);
        this.authService
            .authenticate("keycloak")
            .pipe(finalize(() => this.$loading.set(false)))
            .subscribe();
    }

    public logout(): void {
        this.$loading.set(true);
        this.router.navigate(["/users/logout"]);
        this.authService.logout("keycloak").subscribe({
            next: () => {
                this.$loading.set(false);
                this.router.navigate(["/home"]);
                this.$user.set(null);
            },
            error: () => {
                this.$loading.set(false);
            },
        });
    }

    private initializeFromRedirect(): void {
        const token = JwtUtils.extractAccessTokenFromHash();
        if (!token) return;

        const jwt = new NbAuthJWTToken(token, "keycloak");
        this.tokenService.set(jwt);

        window.history.replaceState({}, document.title, window.location.pathname);

        const payload = JwtUtils.decodeJwt(token);
        this.loadUserFromPayload(payload);
    }

    private loadUserFromPayload(payload: any): void {
        const idKeycloak = payload?.sub;
        const nickname = payload?.preferred_username;

        if (!idKeycloak) {
            console.error("Token invalide ou sans identifiant Keycloak.");
            return;
        }

        this.$loading.set(true);
        this.usersService
            .loadUser(idKeycloak, nickname)
            .pipe(finalize(() => this.$loading.set(false)))
            .subscribe({
                next: (user) => this.$user.set(user),
                error: (err) => {
                    console.error("Failed to load user:", err);
                    this.promptForNickname(idKeycloak);
                },
            });
    }

    private promptForNickname(idKeycloak: string): void {
        const dialogRef = this.dialogService.open(NicknameDialogComponent, {
            closeOnBackdropClick: false,
            closeOnEsc: false,
        });

        dialogRef.onClose.subscribe((nickname: string | null) => {
            if (!nickname) return;

            this.usersService.loadUser(idKeycloak, nickname).subscribe({
                next: (user) => this.$user.set(user),
                error: (err) => console.error("Signup failed:", err),
            });
        });
    }
}
