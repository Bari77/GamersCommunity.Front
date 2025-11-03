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
    NbMenuModule,
    NbPopoverModule,
    NbSearchModule,
    NbSearchService,
    NbSpinnerModule,
    NbToastrService,
    NbTooltipModule,
    NbUserModule,
} from "@nebular/theme";
import { AvatarComponent } from "@shared/components/avatar/avatar.component";

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
        NbMenuModule,
        NbPopoverModule,
        AvatarComponent,
    ],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
    public readonly gamesStore = inject(GamesStore);
    public readonly usersStore = inject(UsersStore);
    public readonly searchService = inject(NbSearchService);
    public readonly router = inject(Router);
    public toastr = inject(NbToastrService);

    public search = model<string>();
    public copied = model<boolean>(false);

    public async ngOnInit(): Promise<void> {
        await this.gamesStore.init();

        this.searchService.onSearchSubmit().subscribe((data: any) => {
            console.log(data.term);
        });
    }

    public copyToClipboard(): void {
        navigator.clipboard.writeText(this.usersStore.fullNickname());
        this.copied.set(true);
    }

    public redirect(url: string): void {
        this.router.navigate([url]);
    }
}
