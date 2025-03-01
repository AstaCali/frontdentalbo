import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";

const base_url = environment.serverBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class PersonUserService {

  constructor( private http : HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  //---PARA REGISTRAR PERSONA_USUARIO CON EMAIL EN EL MENU AGENDAR CITA 
  userperson( formData: any){
    //console.log('crear usaurio');
    return this.http.post(`${base_url}/persons/personuser`, formData, this.headers)
  }

  //-----------GET LISTAR TRATAMIENTOS PARA reporTe DE PAGO EN BUSQUEDA -*---------
  cargarPersonReportPagos() {

    const url = `${ base_url }/persons/reporte/pagos`;
    return this.http.get( url, this.headers)
              .pipe(
                map((resp: any) => resp.pacientperson)
              );
  }

}