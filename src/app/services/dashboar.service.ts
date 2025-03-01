import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/environments/environment";

// const base_analisis_url = environment.padanalisis;

const base_analisis_url = environment.analitypanda;

const base_url = environment.serverBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  //private apiUrl = `${base_url}/pagocotizacion/analisis`;

  constructor(private http: HttpClient){}

  cargarAnalisis(year?: string, month?: string, day?: string): Observable<any> {
      //let params = new HttpParams(); // Inicializa HttpParams correctamente

      let url = `${ base_url }/pagocotizacion/analisis?`;
  
      // Agrega los parámetros condicionalmente
      if (year) {
        //params = params.set('year', year);
        url += `&year=${year}`;
      }
      if (month) {
        //params = params.set('month', month);
        url += `&month=${month}`;
      }
      if (day) {
        //params = params.set('day', day);
        url += `&day=${day}`;
      }
      return this.http.get<any>(url)
        .pipe(
          map((resp: any) => resp)
        );
  }

  pythonAnalisis(year?: string, month?: string, day?: string): Observable<any[]> {
      // let url = base_analisis_url;
      let url = `${ base_analisis_url }/tratamientos-mas-demandados?`;
      
      if (year || month || day) {
        url += '?';
        if (year) {
          //const formattedDate = year.toISOString().split('T')[0]; // Formatea la fecha a YYYY-MM-DD
          url += `&year=${year}`;
        }
        if (month) {
          url += `&month=${month}`;
        }
        if (day) {
          url += `&day=${day}`;
        }
      }
  
      return this.http.get<any[]>(url);
  }
}