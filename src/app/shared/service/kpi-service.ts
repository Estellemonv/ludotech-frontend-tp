import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Kpi } from '../model/Kpi';

@Injectable({
  providedIn: 'root',
})
export class KpiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/kpi';

  getKpi(): Observable<Kpi> {
    return this.http.get<Kpi>(this.apiUrl);
  }
}