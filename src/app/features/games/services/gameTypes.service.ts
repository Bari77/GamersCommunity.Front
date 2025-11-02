import { Injectable } from "@angular/core";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";
import { GameType } from "../models/gameType.model";
import { GameTypeDto } from "../dto/gameType.dto";

@Injectable({ providedIn: "root" })
export class GameTypesService extends BaseService {
    public constructor() {
        super("/mainsite/gametypes");
    }

    public list(): Observable<GameType[]> {
        return this.getAll<GameTypeDto, GameType>(GameType);
    }
}
