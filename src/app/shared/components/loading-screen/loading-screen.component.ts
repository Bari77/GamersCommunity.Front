import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NbIconModule, NbSpinnerModule } from "@nebular/theme";

@Component({
    standalone: true,
    selector: "app-loading-screen",
    imports: [CommonModule, NbSpinnerModule, NbIconModule],
    templateUrl: "./loading-screen.component.html",
    styleUrls: ["./loading-screen.component.scss"],
})
export class LoadingScreenComponent {}
