# 🧱 GamersCommunity Front — Angular 20 Architecture Guide

## 📘 Overview

This document defines the **architecture, structure, and naming best practices** used in the **GamersCommunity** project.  
The goal is to ensure a **clean, maintainable, and consistent codebase** for all developers joining the team.

---

## 🚀 Tech Stack

| Element          | Version / Technology                 | Description                                                  |
| ---------------- | ------------------------------------ | ------------------------------------------------------------ |
| Framework        | **Angular 20**                       | Using _standalone components_                                |
| State management | **Signals API**                      | Native Angular signal-based stores                           |
| Routing          | **Standalone Routes**                | `loadComponent` and `loadChildren`                           |
| Styling          | **SCSS**                             | Per component                                                |
| HTTP & Services  | **Angular HttpClient**               | + global interceptors                                        |
| Structure        | **Clean Feature-Based Architecture** | Clear separation between `core/`, `shared/`, and `features/` |

---

## 🧩 Project Structure

```
src/
 ├── app/
 │   ├── core/
 │   │   ├── guards/
 │   │   ├── interceptors/
 │   │   ├── layout/
 │   │   │   └── header
 │   │   │       └── components/
 │   │   │           └── header/
 │   │   └── models/
 │   │
 │   ├── features/
 │   │   ├── home/
 │   │   │   ├── components/
 │   │   │   ├── models/
 │   │   │   ├── pages/
 │   │   │   │   └── /home-container
 │   │   │   ├── stores/
 │   │   │   │   └── home.store.ts
 │   │   │   └── home.routes.ts
 │   │   └── games/
 │   │       ├── dto/
 │   │       │   └── games.dto.ts
 │   │       ├── models/
 │   │       │   └── games.model.ts
 │   │       ├── services/
 │   │       │   └── games.service.ts
 │   │       └── stores/
 │   │           └── games.store.ts
 │   │
 │   ├── shared/
 │   │   ├── components/
 │   │   ├── directives/
 │   │   ├── pipes/
 │   │   ├── models/
 │   │   └── utils/
 │   │
 │   ├── app.component.html
 │   ├── app.component.scss
 │   ├── app.component.ts
 │   ├── app.config.ts
 │   └── app.routes.ts
 │
 └── environments/
```

---

## ⚙️ Standalone Architecture

### ✅ Standalone Components

```ts
@Component({
  standalone: true,
  selector: 'app-home-container',
  templateUrl: './home-container.component.html',
  styleUrls: ['./home-container.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class HomeContainer { ... }
```

### ✅ Standalone Routes

```ts
export const homeRoutes: Routes = [
    {
        path: "home",
        loadComponent: () =>
            import("./pages/home-container/home-container.component").then((m) => m.HomeContainerComponent),
    },
];
```

---

## ⚡ State Management with Signals

### Example of a Signal-Based Store

```ts
@Injectable({ providedIn: "root" })
export class UsersStore {
    public readonly user = computed(() => this.$user());
    public readonly isLoggedIn = computed(() => !!this.$user());

    private readonly authService = inject(UsersService);
    private $user = signal<User | null>(null);

    login(user: User) {
        this.$user.set(user);
    }

    logout() {
        this.$user.set(null);
    }
}
```

---

## 📦 Naming Conventions

| Type        | File Naming                    | Example                     | Associated Class       |
| ----------- | ------------------------------ | --------------------------- | ---------------------- |
| Component   | `xxx.component.ts`             | `user-profile.component.ts` | `UserProfileComponent` |
| Directive   | `xxx.directive.ts`             | `auto-focus.directive.ts`   | `AutoFocusDirective`   |
| Pipe        | `xxx.pipe.ts`                  | `truncate.pipe.ts`          | `TruncatePipe`         |
| Service     | `xxx.service.ts`               | `auth.service.ts`           | `AuthService`          |
| Store       | `xxx.store.ts`                 | `auth.store.ts`             | `AuthStore`            |
| Model / Dto | `xxx.model.ts` or `xxx.dto.ts` | `user.model.ts`             | `User`                 |
| Utility     | `xxx.utils.ts`                 | `date.utils.ts`             | Pure utility functions |

---

## 🧭 Feature Design Guidelines

### ✅ Small Feature without page and routes

```
features/games/
 ├── dto/
 │   └── games.dto.ts
 ├── models/
 │   └── games.model.ts
 ├── services/
 │   └── games.service.ts
 └── stores/
     └── games.store.ts
```

### ✅ Complex Feature with page and routes

```
features/home/
 ├── components/
 ├── models/
 ├── pages/
 │   └── /home-container
 │      ├── home-container.component.html
 │      ├── home-container.component.scss
 │      └── home-container.component.ts
 ├── stores/
 │   └── home.store.ts
 └── home.routes.ts
```

---

## 🧩 Shared Layer

| Folder        | Purpose                        | Examples                                 |
| ------------- | ------------------------------ | ---------------------------------------- |
| `/components` | Generic reusable UI components | `modal`, `button-primary`, `loader`      |
| `/directives` | Reusable directives            | `debounce-click`, `auto-focus`           |
| `/models`     | Global interfaces and types    | `user.model.ts`, `api-response.model.ts` |
| `/pipes`      | Utility pipes                  | `truncate`, `timeago`                    |
| `/services`   | Global service type            | `base.service.ts`                        |
| `/utils`      | Pure utility functions         | `format-date.utils.ts`                   |

---

## 🔥 Summary

| Principle                         | Best Practice                                |
| --------------------------------- | -------------------------------------------- |
| **Architecture**                  | Clean, modular, feature-based                |
| **State Management**              | Signal-based stores                          |
| **Routing**                       | Standalone + lazy loading                    |
| **Components**                    | 100% standalone                              |
| **Naming**                        | Clear, explicit, and consistent              |
| **Shared Layer**                  | Components, pipes, directives, models, utils |
| **NgModules**                     | ❌ Avoided unless required by external libs  |
| **Readability & Maintainability** | Top priority                                 |

---

📅 **Last updated:** November 2025  
🧠 **Maintainer:** GamersCommunity Frontend Team
