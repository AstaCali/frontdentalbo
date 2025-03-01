import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { Pagos } from "../models/pagos.model";
import { PagoProforma } from "../models/pagostratamientos.model";


const base_url = environment.serverBaseUrl;

@Injectable({
    providedIn: 'root'
})
export class PagoCotizacionService {

    constructor(private http: HttpClient) { }

    //-------OBTENER CUANTOS TRATAMIENTOS TIENE LA PROFORMA OSE LA COTIZACION-
    obtenerNamePrecioDetalleCotizacion( id : number ) {
        const url = `${ base_url }/pagocotizacion/mostrar/${ id }`;
        // return this.http.get( url, this.headers )//con token
        return this.http.get( url) // sin Token
                .pipe(
                    map((resp: any) => resp.detallesCotizacion as Pagos)
                );
        }
    //------REGISTRAR Pagos_de los Tratamientos*----
    crearPagos( formData: any, id: number){
        //console.log('crear usaurio');
        return this.http.post(`${base_url}/pagocotizacion/pagos-cotizacion/${ id }`, formData);
              // .pipe(
              //   tap( (resp: any) => {
              //     localStorage.setItem('token', resp.token);
              //   }) 
              // )
    }
    //-------RECUPERAR DATOS PARA EDITAR*---
    obtenerPagos( id : number ) {
        const url = `${ base_url }/pagocotizacion/recuperar/${ id }`;
        // return this.http.get( url, this.headers )//con token
        return this.http.get( url) // sin Token
                .pipe(
                    map((resp: any) => resp.pago)
                );
        }
    //----ACTUALIZAR PAGO---
    putPago( pago: PagoProforma ) {

        const url = `${ base_url }/pagocotizacion/${ pago.id }`;
        return this.http.put( url, pago);
    }
    //---ELIMINAR PAGO Y CAMBIA SU ESTADO DE DE QUATATISACION_DETAIL
    deletePago( id: number ) {

        const url = `${ base_url }/pagocotizacion/${ id }`;
        return this.http.delete( url );
        // return this.http.delete( url, this.headers );//--CON tOKEN
    }
}