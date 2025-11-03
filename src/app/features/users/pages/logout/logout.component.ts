import { Component, inject } from "@angular/core";
import { NbCardModule, NbSpinnerModule } from "@nebular/theme";
import { NbAuthModule } from "@nebular/auth";
import { UsersStore } from "@features/users/stores/users.store";

@Component({
    standalone: true,
    selector: "app-logout",
    imports: [NbCardModule, NbAuthModule, NbSpinnerModule],
    templateUrl: "./logout.component.html",
    styleUrls: ["./logout.component.scss"],
})
export class LogoutComponent {
    public readonly usersStore = inject(UsersStore);
}
