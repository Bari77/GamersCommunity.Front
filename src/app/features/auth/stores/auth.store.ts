import { computed, inject, Injectable, signal } from "@angular/core";
import { User } from "../../../shared/models/user.model";
import { AuthService } from "../auth.service";

@Injectable({ providedIn: "root" })
export class AuthStore {
    public readonly user = computed(() => this.$user());
    public readonly isLoggedIn = computed(() => !!this.$user());

    private readonly authService: AuthService = inject(AuthService);
    private $user = signal<User | null>(null);

    public login(email: string, password: string): void {
        this.authService.login(email, password).subscribe({
            next: (user) => this.$user.set(user),
            error: (err) => console.error("Login failed", err),
        });
    }

    public logout(): void {
        this.$user.set(null);
        this.authService.logout();
    }
}
