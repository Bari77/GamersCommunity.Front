import { computed, inject, Injectable, signal } from "@angular/core";
import { zip } from "rxjs";
import { Game } from "@features/games/models/game.model";
import { GameTypesService } from "../services/gameTypes.service";
import { GamesService } from "../services/games.service";
import { GameType } from "../models/gameType.model";

@Injectable({ providedIn: "root" })
export class GamesStore {
    public readonly gameTypes = computed(() => this.$gameTypes());
    public readonly loading = computed(() => this.$loading());

    private $gameTypes = signal<GameType[]>([]);
    private $loading = signal(false);

    private readonly gameTypesService = inject(GameTypesService);
    private readonly gamesService = inject(GamesService);

    public async init(): Promise<void> {
        this.$loading.set(true);
        try {
            zip(this.gameTypesService.list(), this.gamesService.list()).subscribe((result: [GameType[], Game[]]) => {
                result[0].forEach((type) => {
                    type.games = result[1].filter((game) => game.idType === type.id);
                });
                this.$gameTypes.set(result[0]);
            });
        } catch (err) {
            console.error("Games init failed", err);
            this.$gameTypes.set([]);
        } finally {
            this.$loading.set(false);
        }
    }
}
