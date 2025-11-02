import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { UsersService } from "../users.service";
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from "keycloak-angular";
import { User } from "../models/user.model";
import { NbDialogService } from "@nebular/theme";
import { NicknameDialogComponent } from "../components/nickname-dialog/nickname-dialog.component";
import keycloak from "keycloak-js";

@Injectable({ providedIn: "root" })
export class UsersStore {
    public readonly user = computed(() => this.$user());
    public readonly isLoggedIn = computed(() => !!this.$user());

    private readonly keycloak = inject(keycloak);
    private readonly usersService = inject(UsersService);
    private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
    private readonly dialogService = inject(NbDialogService);
    private $user = signal<User | null>(null);
    private idKeycloakCache: string | null = null;

    public constructor() {
        effect(() => {
            const event = this.keycloakSignal();

            switch (event.type) {
                case KeycloakEventType.Ready: {
                    const authenticated = typeEventArgs<ReadyArgs>(event.args);
                    if (authenticated) {
                        this.idKeycloakCache = this.keycloak.tokenParsed?.sub ?? null;
                        this.initializeUser();
                    }
                    break;
                }

                case KeycloakEventType.AuthSuccess:
                case KeycloakEventType.TokenExpired: {
                    this.initializeUser();
                    break;
                }

                case KeycloakEventType.AuthLogout: {
                    localStorage.removeItem("access_token");
                    this.$user.set(null);
                    break;
                }
            }
        });
    }

    public async login(): Promise<void> {
        await this.usersService.login();
    }

    public async logout(): Promise<void> {
        await this.usersService.logout();
        this.$user.set(null);
    }

    private initializeUser(): void {
        this.usersService.loadUser(this.idKeycloakCache!).subscribe({
            next: (user) => this.$user.set(user),
            error: (err) => {
                console.error("Failed to load user:", err);
                this.promptForNickname();
            },
        });
    }

    private promptForNickname(): void {
        const dialogRef = this.dialogService.open(NicknameDialogComponent, {
            closeOnBackdropClick: false,
            closeOnEsc: false,
        });

        dialogRef.onClose.subscribe((nickname: string | null) => {
            if (!nickname || !this.idKeycloakCache) return;

            this.usersService.loadUser(this.idKeycloakCache!, nickname).subscribe({
                next: (user) => this.$user.set(user),
                error: (err) => console.error("Signup failed", err),
            });
        });
    }
}
