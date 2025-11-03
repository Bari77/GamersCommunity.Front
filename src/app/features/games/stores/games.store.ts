import { computed, inject, Injectable, signal } from "@angular/core";
import { Game } from "@features/games/models/game.model";
import { NbMenuItem } from "@nebular/theme";
import { finalize, zip } from "rxjs";
import { GameType } from "../models/gameType.model";
import { GameTypesService } from "../services/gameTypes.service";
import { GamesService } from "../services/games.service";

@Injectable({ providedIn: "root" })
export class GamesStore {
    public readonly gameMenu = computed(() => this.$gameMenu());
    public readonly loading = computed(() => this.$loading());

    private $gameMenu = signal<NbMenuItem[]>([]);
    private $gameTypes = signal<GameType[]>([]);
    private $loading = signal(false);

    private readonly gameTypesService = inject(GameTypesService);
    private readonly gamesService = inject(GamesService);

    public async init(): Promise<void> {
        this.$loading.set(true);
        try {
            zip(this.gameTypesService.list(), this.gamesService.list())
                .pipe(
                    finalize(() => {
                        this.$loading.set(false);
                    }),
                )
                .subscribe((result: [GameType[], Game[]]) => {
                    result[0].forEach((type) => {
                        type.games = result[1].filter((game) => game.idType === type.id);
                    });

                    result[0] = result[0].filter((type) => type.games.length > 0);

                    this.$gameTypes.set(result[0]);
                    this.buildMenu();
                });
        } catch (err) {
            console.error("Games init failed", err);
            this.$gameTypes.set([]);
        }
    }

    private buildMenu(): void {
        const result: NbMenuItem[] = this.$gameTypes().map((type) => ({
            title: type.entitled,
            group: true,
            children: type.games.map((game) => ({
                title: game.title,
                icon: game.picture,
                url: game.urlValue,
            })),
        }));

        this.$gameMenu.set(result);
    }
}
