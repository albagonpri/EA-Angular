import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organizacion } from '../models/organizacion.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrganizaciones(): Observable<Organizacion[]> {
    return this.http.get<Organizacion[]>(`${this.baseUrl}/organizations`);
  }

  getOrganizacionById(id: string): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.baseUrl}/organizations/${id}`);
  }

  createOrganizacion(name: string, country: string): Observable<Organizacion> {
    return this.http.post<Organizacion>(`${this.baseUrl}/organizations`, {
      name,
      country,
      users: []
    });
  }

  updateOrganizacion(
    id: string,
    payload: { name?: string; country?: string; users?: string[] }
  ): Observable<Organizacion> {
    return this.http.put<Organizacion>(`${this.baseUrl}/organizations/${id}`, payload);
  }

  updateNombreOrganizacion(id: string, name: string): Observable<Organizacion> {
    return this.updateOrganizacion(id, { name });
  }

  updateUsuariosOrganizacion(id: string, users: string[]): Observable<Organizacion> {
    return this.updateOrganizacion(id, { users });
  }

  deleteOrganizacion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/organizations/${id}`);
  }
}