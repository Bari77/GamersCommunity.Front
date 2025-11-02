import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { UsersService } from "../users.service";
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from "keycloak-angular";
import { User } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class UsersStore {
    public readonly user = computed(() => this.$user());
    public readonly isLoggedIn = computed(() => !!this.$user());

    private readonly authService = inject(UsersService);
    private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
    private $user = signal<User | null>(null);

    public constructor() {
        effect(() => {
            const event = this.keycloakSignal();

            console.log(event);
            switch (event.type) {
                case KeycloakEventType.Ready: {
                    const authenticated = typeEventArgs<ReadyArgs>(event.args);
                    if (authenticated) this.initializeUser();
                    break;
                }

                case KeycloakEventType.AuthSuccess:
                case KeycloakEventType.TokenExpired: {
                    this.initializeUser();
                    break;
                }

                case KeycloakEventType.AuthLogout: {
                    this.$user.set(null);
                    break;
                }
            }
        });
    }

    public async login(): Promise<void> {
        await this.authService.login();
    }

    public async logout(): Promise<void> {
        await this.authService.logout();
        this.$user.set(null);
    }

    private initializeUser(): void {
        this.authService.loadUser().subscribe({
            next: (user) => this.$user.set(user),
            error: (err) => {
                console.error("Failed to load user:", err);
                this.$user.set(null);
            },
        });
    }
}
