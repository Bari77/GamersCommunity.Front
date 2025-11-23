import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { UsersStore } from "@features/users/stores/users.store";
import { NbAuthOAuth2JWTToken, NbAuthResult, NbAuthService } from "@nebular/auth";
import { NbCardModule, NbLayoutModule, NbSpinnerModule } from "@nebular/theme";

@Component({
    standalone: true,
    imports: [NbLayoutModule, NbCardModule, NbSpinnerModule],
    templateUrl: "./callback.component.html",
    styleUrls: ["./callback.component.scss"],
})
export class CallbackComponent implements OnInit {
    private auth = inject(NbAuthService);
    private router = inject(Router);
    private usersStore = inject(UsersStore);

    public ngOnInit(): void {
        this.auth.authenticate("keycloak").subscribe((result: NbAuthResult) => {
            if (result.isSuccess()) {
                const token = result.getToken() as NbAuthOAuth2JWTToken;
                this.usersStore.loadUserFromPayload(token.getAccessTokenPayload()).subscribe(() => {
                    const redirect = result.getRedirect() || "/home";
                    this.router.navigateByUrl(redirect);
                });
            } else {
                this.router.navigateByUrl("/login");
            }
        });
    }
}
