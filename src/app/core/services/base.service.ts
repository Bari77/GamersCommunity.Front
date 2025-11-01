import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { DtoConvertibleClass } from "@shared/models/base-model";
import { environment } from "environments/environment";
import { map, Observable } from "rxjs";

export abstract class BaseService {
    private readonly http: HttpClient = inject(HttpClient);

    public constructor(private baseUrlService: string) {}

    protected get<Tdto, Tmodel>(modelClass: DtoConvertibleClass<Tdto, Tmodel>, url: string): Observable<Tmodel> {
        return this.http.get<Tdto>(this.getURL(url)).pipe(map((dto) => modelClass.fromDto(dto)));
    }

    protected getAll<Tdto, Tmodel>(modelClass: DtoConvertibleClass<Tdto, Tmodel>, url: string): Observable<Tmodel[]> {
        return this.http.get<Tdto[]>(this.getURL(url)).pipe(map((dtos) => dtos.map((dto) => modelClass.fromDto(dto))));
    }

    protected post<Tdto, Tmodel>(
        modelClass: DtoConvertibleClass<Tdto, Tmodel>,
        url: string,
        body: any,
    ): Observable<Tmodel> {
        return this.http.post<Tdto>(this.getURL(url), body).pipe(map((dto) => modelClass.fromDto(dto)));
    }

    protected put<Tdto, Tmodel>(
        modelClass: DtoConvertibleClass<Tdto, Tmodel>,
        url: string,
        body: any,
    ): Observable<Tmodel> {
        return this.http.put<Tdto>(this.getURL(url), body).pipe(map((dto) => modelClass.fromDto(dto)));
    }

    protected delete(url: string): Observable<void> {
        return this.http.delete<void>(this.getURL(url));
    }

    private getURL(url: string): string {
        return environment.apiUrl + "/" + this.baseUrlService + "/" + url;
    }
}
