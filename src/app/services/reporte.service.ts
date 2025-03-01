import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
//import { CargarPagos } from "../interfaces/cargar-reportepago.interface";

const base_url = environment.serverBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class ReportePagosService {

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

    //---REPORTE DE PAGOS 

    reportePago(desde: number = 0, fechaInicio?: Date, mes?: number,  searchTerm: string = '', treatmentTerm: string = '') {
        let url = `${base_url}/reportes?desde=${desde}&searchTerm=${searchTerm}&treatmentTerm=${treatmentTerm}`;
    
        if (fechaInicio) {
            const formattedDate = fechaInicio.toISOString().split('T')[0]; // Formatea la fecha a YYYY-MM-DD
            url += `&fechaInicio=${formattedDate}`;
        }

        if (mes) {
            url += `&mes=${mes.toString().padStart(2, '0')}`; // Añade el mes formateado a la URL
        }
    
        return this.http.get<any>(url)
            .pipe(
                map((resp: any) => resp)
            );
    }
    //----reporte de estado de pago
    reportePagoEstado(desde: number = 0, fechaInicio?: Date, mes?: number, searchTerm: string = '', treatmentTerm: string = '') {
        let url = `${base_url}/reportes/estado?desde=${desde}&searchTerm=${searchTerm}&treatmentTerm=${treatmentTerm}`;
    
        if (fechaInicio) {
            const formattedDate = fechaInicio.toISOString().split('T')[0]; // Formatea la fecha a YYYY-MM-DD
            url += `&fechaInicio=${formattedDate}`;
        }

        if (mes) {
            url += `&mes=${mes.toString().padStart(2, '0')}`; // Añade el mes formateado a la URL
        }
    
        return this.http.get<any>(url)
            .pipe(
                map((resp: any) => resp)
            );
    }

}