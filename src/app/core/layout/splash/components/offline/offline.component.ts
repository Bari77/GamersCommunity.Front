import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { SplashComponent } from "../splash/splash.component";

@Component({
    standalone: true,
    selector: "app-offline",
    imports: [CommonModule, SplashComponent],
    templateUrl: "./offline.component.html",
    styleUrls: ["./offline.component.scss"],
})
export class OfflineComponent {
    public message = signal<string>($localize`:@@core.layout.offline.message:Site offline`);
}
