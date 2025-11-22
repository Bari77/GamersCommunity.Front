import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { PermissionsService } from "@core/services/permissions.service";
import { NbAuthJWTToken, NbAuthService, NbTokenService } from "@nebular/auth";
import { NbDialogService, NbMenuItem, NbMenuService } from "@nebular/theme";
import { JwtUtils } from "@shared/utils/jwt.utils";
import { filter, finalize, map, Observable, Subscriber } from "rxjs";
import { NicknameDialogComponent } from "../components/nickname-dialog/nickname-dialog.component";
import { LoadRequestDto } from "../dto/load.dto";
import { User } from "../models/user.model";
import { UsersService } from "../users.service";

@Injectable({ providedIn: "root" })
export class UsersStore {
    public readonly redirectLoading = computed(() => this.$redirectLoading());
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
    private readonly permissionsService = inject(PermissionsService);
    private readonly router = inject(Router);

    private readonly $redirectLoading = signal<boolean>(false);
    private readonly $loading = signal<boolean>(false);
    private readonly $user = signal<User | null>(null);
    private readonly $menuItems = signal<NbMenuItem[]>(this.getMenuItems());

    public constructor() {
        this.authService.isAuthenticated().subscribe((authenticated) => {
            if (!authenticated) {
                // Not authenticated but maybe come from Keycloak redirection
                this.initializeFromRedirect();
                return;
            }

            this.authService.getToken().subscribe({
                next: (token) => {
                    if (!token?.getValue()) return;
                    const payload = JwtUtils.decodeJwt(token.getValue());
                    this.loadUserFromPayload(payload).subscribe();
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
        this.authService
            .logout("keycloak")
            .pipe(finalize(() => this.$loading.set(false)))
            .subscribe({
                next: () => {
                    this.router.navigate(["/home"]);
                    this.$user.set(null);
                },
            });
    }

    private initializeFromRedirect(): void {
        const token = JwtUtils.extractAccessTokenFromHash();
        if (!token) return;

        this.$redirectLoading.set(true);
        const jwt = new NbAuthJWTToken(token, "keycloak");
        this.tokenService.set(jwt);

        window.history.replaceState({}, document.title, window.location.pathname);

        const payload = JwtUtils.decodeJwt(token);
        this.loadUserFromPayload(payload)
            .pipe(
                finalize(() => {
                    this.$redirectLoading.set(false);
                }),
            )
            .subscribe();
    }

    private loadUserFromPayload(payload: any): Observable<void> {
        return new Observable<void>((sub: Subscriber<void>) => {
            if (!payload?.sub) {
                sub.error("Invalid token or without Keycloak identifier.");
                sub.complete();
                return;
            }

            const data: LoadRequestDto = {
                idKeycloak: payload?.sub,
            };

            this.$loading.set(true);
            this.usersService
                .loadUser(data)
                .pipe(
                    finalize(() => {
                        this.$loading.set(false);
                        sub.complete();
                    }),
                )
                .subscribe({
                    next: (user) => {
                        this.$user.set(user);
                        sub.next();
                    },
                    error: (err) => {
                        if (err.error?.Code === "NICKNAME_MANDATORY") {
                            // Signup, we create a new user with mail from SSO
                            // and input nickname
                            data.mail = payload.email;
                            this.promptForNickname(data);
                        }
                        sub.error(err);
                    },
                });
        });
    }

    private promptForNickname(data: LoadRequestDto): void {
        const dialogRef = this.dialogService.open(NicknameDialogComponent, {
            closeOnBackdropClick: false,
            closeOnEsc: false,
        });

        dialogRef.onClose.subscribe((nickname: string | null) => {
            if (!nickname) return;

            data.nickname = nickname;
            this.usersService.loadUser(data).subscribe({
                next: (user) => this.$user.set(user),
                error: (err) => console.error("Signup failed:", err),
            });
        });
    }

    private getMenuItems(): NbMenuItem[] {
        const result = [
            { data: "profile", title: $localize`:@@core.header.menu.profile:Profile`, icon: "person-outline" },
            { data: "logout", title: $localize`:@@core.header.menu.logout:Logout`, icon: "power-outline" },
        ];

        return result;
    }
}
