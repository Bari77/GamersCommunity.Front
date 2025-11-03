import { Injectable } from "@angular/core";
import { UserDto } from "./dto/user.dto";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";
import { User } from "./models/user.model";
import { LoadRequestDto } from "./dto/load.dto";

@Injectable({ providedIn: "root" })
export class UsersService extends BaseService {
    public constructor() {
        super("/mainsite/users");
    }

    public loadUser(idKeycloak: string, nickname: string | undefined = undefined): Observable<User | null> {
        return this.post<UserDto, User>(User, "actions/Load", {
            idKeycloak: idKeycloak,
            nickname: nickname,
        } as LoadRequestDto);
    }

    public getUser(id: number): Observable<User> {
        return this.get<UserDto, User>(User, `${id}`);
    }
}
