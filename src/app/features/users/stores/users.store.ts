import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { PermissionsService } from "@core/services/permissions.service";
import { NbAuthOAuth2JWTToken, NbAuthService } from "@nebular/auth";
import { NbDialogService, NbMenuItem } from "@nebular/theme";
import { finalize, firstValueFrom, map, Observable, Subscriber } from "rxjs";
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
    private readonly usersService = inject(UsersService);
    private readonly dialogService = inject(NbDialogService);
    private readonly permissionsService = inject(PermissionsService);
    private readonly router = inject(Router);

    private readonly $redirectLoading = signal<boolean>(false);
    private readonly $loading = signal<boolean>(false);
    private readonly $user = signal<User | null>(null);
    private readonly $menuItems = signal<NbMenuItem[]>(this.getMenuItems());

    public constructor() {
        this.authService
            .getToken()
            .pipe(map((token) => token as NbAuthOAuth2JWTToken))
            .subscribe((token: NbAuthOAuth2JWTToken) => {
                if (!token?.isValid()) {
                    this.$user.set(null);
                    return;
                }

                this.loadUserFromPayload(token.getAccessTokenPayload()).subscribe();
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
        this.authService
            .logout("keycloak")
            .pipe(finalize(() => this.$loading.set(false)))
            .subscribe({
                next: () => {
                    this.$user.set(null);
                    this.router.navigate(["/home"]);
                },
            });
    }

    public loadUserFromPayload(payload: any): Observable<void> {
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
            this.usersService.loadUser(data).subscribe({
                next: (user) => {
                    this.$loading.set(false);
                    this.$user.set(user);
                    sub.next();
                    sub.complete();
                },
                error: async (err) => {
                    if (err.error?.Code !== "NICKNAME_MANDATORY") {
                        sub.error(err);
                    }

                    // Signup, we create a new user with mail from SSO
                    // and input nickname
                    data.mail = payload.email;
                    data.nickname = await firstValueFrom(this.promptForNickname());

                    this.usersService
                        .loadUser(data)
                        .pipe(
                            finalize(() => {
                                sub.complete();
                            }),
                        )
                        .subscribe({
                            next: (user) => {
                                this.$user.set(user);
                                sub.next();
                            },
                            error: (err) => {
                                console.error("Signup failed:", err);
                                sub.error(err);
                            },
                        });
                },
            });
        });
    }

    private promptForNickname(): Observable<string | undefined> {
        const dialogRef = this.dialogService.open(NicknameDialogComponent, {
            closeOnBackdropClick: false,
            closeOnEsc: false,
        });

        return dialogRef.onClose as Observable<string | undefined>;
    }

    private getMenuItems(): NbMenuItem[] {
        const result = [
            {
                data: "profile",
                link: "/users/profile",
                title: $localize`:@@core.header.menu.profile:Profile`,
                icon: "person-outline",
            },
            {
                data: "logout",
                link: "/users/logout",
                title: $localize`:@@core.header.menu.logout:Logout`,
                icon: "power-outline",
            },
        ];

        return result;
    }
}
