import { Component, computed, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "@core/layout/footer/components/footer/footer.component";
import { HeaderComponent } from "@core/layout/header/components/header/header.component";
import { LoadingComponent } from "@core/layout/splash/components/loading/loading.component";
import { GamesStore } from "@features/games/stores/games.store";
import { UsersStore } from "@features/users/stores/users.store";
import { NbAuthOAuth2JWTToken, NbAuthService } from "@nebular/auth";
import { NbLayoutModule } from "@nebular/theme";
import { firstValueFrom, interval, map } from "rxjs";

@Component({
    standalone: true,
    selector: "app",
    imports: [RouterOutlet, NbLayoutModule, HeaderComponent, FooterComponent, LoadingComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    public readonly userStore = inject(UsersStore);
    public readonly gamesStore = inject(GamesStore);
    private readonly authService = inject(NbAuthService);

    public isLoading = computed<boolean>(() => this.userStore.redirectLoading() || this.gamesStore.loading());

    constructor() {
        interval(10000).subscribe(async () => {
            const token = await firstValueFrom(
                this.authService.getToken().pipe(map((token) => token as NbAuthOAuth2JWTToken)),
            );
            if (token.isValid()) {
                this.authService.refreshToken("keycloak", token).subscribe();
            }
        });
    }
}
