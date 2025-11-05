import { Component, computed, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "@core/layout/footer/components/footer/footer.component";
import { HeaderComponent } from "@core/layout/header/components/header/header.component";
import { LoadingComponent } from "@core/layout/splash/components/loading/loading.component";
import { GamesStore } from "@features/games/stores/games.store";
import { UsersStore } from "@features/users/stores/users.store";
import { NbLayoutModule } from "@nebular/theme";

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

    public isLoading = computed<boolean>(() => this.userStore.redirectLoading() || this.gamesStore.loading());
}
