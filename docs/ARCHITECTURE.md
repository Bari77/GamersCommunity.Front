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
 │   │   ├── services/
 │   │   ├── stores/
 │   │   └── utils/
 │   │
 │   ├── shared/
 │   │   ├── components/
 │   │   ├── directives/
 │   │   ├── pipes/
 │   │   ├── models/
 │   │   └── utils/
 │   │
 │   ├── features/
 │   │   ├── auth/
 │   │   │   ├── login/
 │   │   │   │   ├── login.component.ts
 │   │   │   │   ├── login.component.html
 │   │   │   │   └── login.component.scss
 │   │   │   ├── register/
 │   │   │   ├── stores/
 │   │   │   │   └── auth.store.ts
 │   │   │   ├── auth.routes.ts
 │   │   │   └── auth.service.ts
 │   │   ├── forum/
 │   │   ├── chat/
 │   │   └── profile/
 │   │
 │   ├── app.routes.ts
 │   ├── app.config.ts
 │   ├── app.component.ts
 │   ├── app.component.html
 │   └── app.component.scss
 │
 └── environments/
```

---

## ⚙️ Standalone Architecture

### ✅ Standalone Components

```ts
@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class LoginComponent { ... }
```

### ✅ Standalone Routes

```ts
export const authRoutes: Routes = [
    { path: "login", loadComponent: () => import("./login/login.component").then((m) => m.LoginComponent) },
    { path: "register", loadComponent: () => import("./register/register.component").then((m) => m.RegisterComponent) },
];
```

---

## ⚡ State Management with Signals

### Example of a Signal-Based Store

```ts
@Injectable({ providedIn: "root" })
export class AuthStore {
    public readonly user = computed(() => this._user());
    public readonly isLoggedIn = computed(() => !!this._user());
    private _user = signal<User | null>(null);

    login(user: User) {
        this._user.set(user);
    }

    logout() {
        this._user.set(null);
    }
}
```

---

## 📦 Naming Conventions

| Type         | File Naming                      | Example                     | Associated Class       |
| ------------ | -------------------------------- | --------------------------- | ---------------------- |
| Component    | `xxx.component.ts`               | `user-profile.component.ts` | `UserProfileComponent` |
| Directive    | `xxx.directive.ts`               | `auto-focus.directive.ts`   | `AutoFocusDirective`   |
| Pipe         | `xxx.pipe.ts`                    | `truncate.pipe.ts`          | `TruncatePipe`         |
| Service      | `xxx.service.ts`                 | `auth.service.ts`           | `AuthService`          |
| Store        | `xxx.store.ts`                   | `auth.store.ts`             | `AuthStore`            |
| Model / Type | `xxx.model.ts` or `xxx.types.ts` | `user.model.ts`             | `User`                 |
| Utility      | `xxx.utils.ts`                   | `date.utils.ts`             | Pure utility functions |

---

## 🧭 Feature Design Guidelines

### ✅ Small Feature

```
features/auth/
 ├── login/
 ├── register/
 ├── stores/
 ├── auth.routes.ts
 └── auth.service.ts
```

### ✅ Complex Feature

```
features/forum/
 ├── pages/
 ├── components/
 ├── stores/
 ├── forum.routes.ts
 └── forum.service.ts
```

---

## 🧩 Shared Layer

| Folder        | Purpose                        | Examples                                 |
| ------------- | ------------------------------ | ---------------------------------------- |
| `/components` | Generic reusable UI components | `modal`, `button-primary`, `loader`      |
| `/directives` | Reusable directives            | `debounce-click`, `auto-focus`           |
| `/pipes`      | Utility pipes                  | `truncate`, `timeago`                    |
| `/models`     | Global interfaces and types    | `user.model.ts`, `api-response.model.ts` |
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
