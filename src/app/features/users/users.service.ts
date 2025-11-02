import { inject, Injectable } from "@angular/core";
import { UserDto } from "./dto/user.dto";
import { BaseService } from "@shared/services/base.service";
import { Observable, of } from "rxjs";
import keycloak from "keycloak-js";
import { User } from "./models/user.model";

@Injectable({ providedIn: "root" })
export class UsersService extends BaseService {
    private readonly keycloak = inject(keycloak);

    public constructor() {
        super("/mainsite/users");
    }

    public register(): Promise<void> {
        console.log(this.keycloak);
        return this.keycloak.register();
    }

    public login(): Promise<void> {
        console.log(this.keycloak);
        return this.keycloak.login();
    }

    public logout(): Promise<void> {
        console.log(this.keycloak);
        return this.keycloak.logout();
    }

    public isLoggedIn(): boolean {
        console.log(this.keycloak);
        return !!this.keycloak.authenticated;
    }

    public loadUser(): Observable<User | null> {
        const tokenParsed = this.keycloak.tokenParsed;
        if (!tokenParsed) return of(null);

        console.log(tokenParsed);
        return this.post<UserDto, User>(User, "register", {
            id: tokenParsed.sub,
        });
    }

    public getUser(id: number): Observable<User> {
        return this.get<UserDto, User>(User, `${id}`);
    }
}
