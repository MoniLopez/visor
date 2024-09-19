import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceDatosService {

  constructor(private http: HttpClient) { }

  getTextFileInscripcion(): Observable<string> {
    return this.http.get('Inscripciones.txt', { responseType: 'text' });
  }

  getTextFileApendice(): Observable<string> {
    return this.http.get('Apendices.txt', { responseType: 'text' });
  }

}
