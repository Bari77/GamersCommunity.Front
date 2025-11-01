import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

/**
 * Entry app component
 */
@Component({
    selector: "app",
    imports: [RouterOutlet],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    protected readonly title = signal("GamersCommunity.Front");
}
