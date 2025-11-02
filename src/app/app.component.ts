import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NbLayoutModule } from "@nebular/theme";
import { HeaderComponent } from "@core/layout/header/components/header/header.component";
import { FooterComponent } from "@core/layout/footer/components/footer/footer.component";

@Component({
    standalone: true,
    selector: "app",
    imports: [RouterOutlet, NbLayoutModule, HeaderComponent, FooterComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {}
