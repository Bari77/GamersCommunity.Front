import { GameDto } from "../../games/dto/game.dto";

export interface GameTypeDto {
    id: number;
    entitled: string;
    games: GameDto[];
}
