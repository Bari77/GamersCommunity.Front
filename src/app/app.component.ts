import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NbLayoutModule } from "@nebular/theme";
import { HeaderComponent } from "@core/layout/header/components/header/header.component";
import { FooterComponent } from "@core/layout/footer/components/footer/footer.component";
import { LoadingScreenComponent } from "@shared/components/loading-screen/loading-screen.component";
import { UsersStore } from "@features/users/stores/users.store";

@Component({
    standalone: true,
    selector: "app",
    imports: [RouterOutlet, NbLayoutModule, HeaderComponent, FooterComponent, LoadingScreenComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    public readonly usersStore = inject(UsersStore);

    public isLoading = signal<boolean>(true);

    public ngOnInit(): void {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 2500);
    }
}
