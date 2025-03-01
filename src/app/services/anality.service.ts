import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const base_url_anality = environment.analitypanda;

@Injectable({
  providedIn: 'root'
})
export class AnalityService {

  constructor(private http: HttpClient){}

  cargarABC() {
    const url = `${ base_url_anality }/analityabc`;
    return this.http.get( url)
              .pipe(
                map((resp: any) => resp)
              );
  }
  //----TRATAMIENTO X EPOCA DEL AÑO--------

  pythonAnalityUno(nombreTratamiento: string, fechaInicio: string, fechaFinal: string): Observable<any> {
    const url = `${base_url_anality}/analityuno?nombre_tratamiento=${nombreTratamiento}&fecha_inicio=${fechaInicio}&fecha_final=${fechaFinal}`;
    return this.http.get<any>(url);
  }
  //-----TRTAMIENTO X HORA-----

  pythonAnalityDos(motivo: string, fechaInicio: string, fechaFinal: string): Observable<any> {
    const url = `${base_url_anality}/analitydos?motivo=${motivo}&fecha_inicio=${fechaInicio}&fecha_final=${fechaFinal}`;
    return this.http.get<any>(url);
  }

    //-----TRTAMIENTO X HORA-----

  pythonAnalityTres(fechaInicio: string): Observable<any> {
    const url = `${base_url_anality}/analitytres?fecha_inicio=${fechaInicio}`;
    return this.http.get<any>(url);
  }

  //-----Reporte de Citas por Dentista-----

  // pythonAnalityCuatro(fechaInicio: string, fechaFinal: string): Observable<any> {
  pythonAnalityCuatro(fechaInicio: string): Observable<any> {
    // const url = `${base_url_anality}/analitycuatro?fecha_inicio=${fechaInicio}&fecha_final=${fechaFinal}`;
    const url = `${base_url_anality}/analitycuatro?fecha_inicio=${fechaInicio}`;
    return this.http.get<any>(url);
  }

  //-----Reporte de Citas Canceladas o No-----

  pythonAnalityCinco(fechaInicio: string, fechaFinal: string): Observable<any> {
    const url = `${base_url_anality}/analitycinco?fecha_inicio=${fechaInicio}&fecha_final=${fechaFinal}`;
    return this.http.get<any>(url);
  }

    //----INGRESO POR TRATAMIENTO X FECHAS DE RANGO--------

  pythonAnalitySeis(nombreTratamiento: string, fechaInicio: string, fechaFinal: string): Observable<any> {
    const url = `${base_url_anality}/analityseis?nombre_tratamiento=${nombreTratamiento}&fecha_inicio=${fechaInicio}&fecha_final=${fechaFinal}`;
    return this.http.get<any>(url);
  }

}
