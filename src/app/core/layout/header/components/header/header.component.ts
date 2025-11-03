import { Component, inject, model, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { GamesStore } from "@features/games/stores/games.store";
import { UsersStore } from "@features/users/stores/users.store";
import {
    NbButtonModule,
    NbContextMenuModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbSearchModule,
    NbSearchService,
    NbSpinnerModule,
    NbTooltipModule,
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
        NbSearchModule,
        NbTooltipModule,
        NbContextMenuModule,
        NbSpinnerModule,
    ],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
    public readonly gameStore = inject(GamesStore);
    public readonly usersStore = inject(UsersStore);
    public readonly searchService = inject(NbSearchService);
    public readonly router = inject(Router);

    public search = model<string>();
    public copied = model<boolean>(false);

    public async ngOnInit(): Promise<void> {
        await this.gameStore.init();

        this.searchService.onSearchSubmit().subscribe((data: any) => {
            console.log(data.term);
        });
    }

    public goToLogin(): void {
        this.router.navigate(["/users/login"]);
    }

    public goToHome(): void {
        this.router.navigate(["/home"]);
    }

    public copyToClipboard(): void {
        navigator.clipboard.writeText(this.usersStore.fullNickname());
        this.copied.set(true);
    }
}
