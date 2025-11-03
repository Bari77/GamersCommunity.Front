import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "@core/layout/footer/components/footer/footer.component";
import { HeaderComponent } from "@core/layout/header/components/header/header.component";
import { LoadingComponent } from "@core/layout/splash/components/loading/loading.component";
import { UsersStore } from "@features/users/stores/users.store";
import { NbLayoutModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "app",
    imports: [RouterOutlet, NbLayoutModule, HeaderComponent, FooterComponent, LoadingComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    public readonly usersStore = inject(UsersStore);

    public isLoading = signal<boolean>(true);

    public ngOnInit(): void {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 5000);
    }
}
