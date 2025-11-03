import { Component, inject } from "@angular/core";
import { NbCardModule, NbButtonModule, NbIconModule, NbLayoutModule, NbAlertModule } from "@nebular/theme";
import { UsersStore } from "../../stores/users.store";
import { NbAuthModule } from "@nebular/auth";

@Component({
    standalone: true,
    selector: "app-login",
    imports: [NbLayoutModule, NbCardModule, NbButtonModule, NbIconModule, NbAlertModule, NbAuthModule],
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
    public readonly usersStore = inject(UsersStore);

    public login(): void {
        this.usersStore.login();
    }
}
