import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { SplashComponent } from "../splash/splash.component";

@Component({
    standalone: true,
    selector: "app-loading",
    imports: [CommonModule, SplashComponent],
    templateUrl: "./loading.component.html",
    styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent {
    public message = signal<string>($localize`:@@core.layout.loading.message:Loading...`);
}
