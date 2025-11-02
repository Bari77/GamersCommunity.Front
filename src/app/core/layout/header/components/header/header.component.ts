import { Component, inject, model, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GamesStore } from "@features/games/stores/games.store";
import { UsersStore } from "@features/users/stores/users.store";
import {
    NbButtonModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbUserModule,
} from "@nebular/theme";

@Component({
    standalone: true,
    selector: "app-header",
    imports: [
        FormsModule,
        NbLayoutModule,
        NbFormFieldModule,
        NbButtonModule,
        NbInputModule,
        NbIconModule,
        NbUserModule,
    ],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
    public readonly gameStore = inject(GamesStore);
    public readonly usersStore = inject(UsersStore);
    public search = model<string>();

    public async ngOnInit(): Promise<void> {
        await this.gameStore.init();
    }

    public doSearch(): void {
        console.log("Execute search", this.search());
    }

    public async doLogin(): Promise<void> {
        await this.usersStore.login();
    }
}
