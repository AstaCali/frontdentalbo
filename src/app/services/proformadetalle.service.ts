import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { DetalleProforma } from "../models/detalleproforma.model";

const base_url = environment.serverBaseUrl;

@Injectable({
    providedIn: 'root'
})
export class ProformaDetalleService {

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

  //---CREAR DETALLE DE CADA PROFORMA--
  crearProformaDetall( formData: any){

    const url = `${ base_url }/cotizacion/cotizaciondetall`;
    return this.http.post( url, formData, this.headers );
  }
  //------CARGAR GET_BY_ID PARA RECUPERAR DATOS DEL TRATAMIENTO DE ESA PROFORMA PARA LUEGO USARLO EN EDITAR--
  obtenerDetalleTratament( id : number ) {
    const url = `${ base_url }/cotizacion/listarDetallesCotizacionById/${ id }`;
    return this.http.get( url, this.headers )
            .pipe(
                map((resp: any) => resp.detallesCotizacionById as DetalleProforma)
            );
  }
  //----Editar cotizacion Detalle---
  putDetalleCotizacion( cotizacionDetalle: DetalleProforma  ) {

    const url = `${ base_url }/cotizacion/${ cotizacionDetalle.id }`;
    return this.http.put( url, cotizacionDetalle, this.headers );
  }
  //----ELIMINAR COTIZACION DETALLE--
  deleteDetalleCotizacion( id: number ) {

    const url = `${ base_url }/cotizacion/detallesCotizacion/${ id }`;
    return this.http.delete( url, this.headers );
  }

}
