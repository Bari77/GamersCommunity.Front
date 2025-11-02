import { inject, Injectable } from "@angular/core";
import { UserDto } from "./dto/user.dto";
import { BaseService } from "@shared/services/base.service";
import { Observable } from "rxjs";
import keycloak from "keycloak-js";
import { User } from "./models/user.model";
import { LoadRequestDto } from "./dto/load.dto";

@Injectable({ providedIn: "root" })
export class UsersService extends BaseService {
    private readonly keycloak = inject(keycloak);

    public constructor() {
        super("/mainsite/users");
    }

    public register(): Promise<void> {
        return this.keycloak.register();
    }

    public login(): Promise<void> {
        return this.keycloak.login();
    }

    public logout(): Promise<void> {
        return this.keycloak.logout();
    }

    public isLoggedIn(): boolean {
        return !!this.keycloak.authenticated;
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
