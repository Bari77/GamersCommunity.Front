import { CommonModule } from "@angular/common";
import { Component, model } from "@angular/core";

@Component({
    standalone: true,
    selector: "app-avatar",
    imports: [CommonModule],
    templateUrl: "./avatar.component.html",
    styleUrls: ["./avatar.component.scss"],
})
export class AvatarComponent {
    public src = model<string>();
}
