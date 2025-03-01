import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { Persona } from "../models/persona.modelo";
import { Proforma } from "../models/proforma.model";
import { DetalleProforma } from "../models/detalleproforma.model";

const base_url = environment.serverBaseUrl;

@Injectable({
    providedIn: 'root'
})
export class ProformaService {

  constructor(private http: HttpClient) { }

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
  //-----OBTENER Persona POR ID
  obtenerDatoPersona( id : number ) {
      const url = `${ base_url }/persons/${ id }`;
      return this.http.get( url, this.headers )
              .pipe(
                  map((resp: any) => resp.person as Persona)
              );
  }
  //---OBTENER LAS PROFORMA(Titulo de la coTizacion) QUE TIENE ESA PERSONA DEVUELVE UN ARRAY--
  obtenerCotizacionDePersona( id : number ) {
    const url = `${ base_url }/cotizacion/${ id }`;
    return this.http.get( url, this.headers )
            .pipe(
                map((resp: any) => resp.cotizacion as Proforma)
            );
  }
  //-------OBTENER CUANTOS TRATAMIENTOS TIENE LA PROFORMA OSE LA COTIZACION-
  obtenerDetalleCotizacion( id : number ) {
    const url = `${ base_url }/cotizacion/detallecoti/${ id }`;
    return this.http.get( url, this.headers )
            .pipe(
                map((resp: any) => resp.detallesCotizacion as DetalleProforma)
            );
  }
  //------REGISTRAR NUEVA COTIZACION/PROFORMA EL TI◘4ULO--
  crearProforma( formData: any){

    const url = `${ base_url }/cotizacion`;
    // return this.http.post( url, formData, this.headers );
    return this.http.post( url, formData, this.headers )
          .pipe(
            map((resp: any)=> resp.cotizacion)
          );
  }

}