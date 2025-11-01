import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "@shared/models/user.model";
import { UserDto } from "./models/user.dto";
import { BaseService } from "@core/services/base.service";

@Injectable({ providedIn: "root" })
export class AuthService extends BaseService {
    public constructor() {
        super("/api/auth");
    }

    public getUser(id: number): Observable<User> {
        return this.get<UserDto, User>(User, `/api/users/${id}`);
    }

    public login(email: string, password: string): Observable<User> {
        return this.post<UserDto, User>(User, "/api/auth/login", { email, password });
    }

    public logout(): void {
        localStorage.removeItem("auth_token");
    }
}
