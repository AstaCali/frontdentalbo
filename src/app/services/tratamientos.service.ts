import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tratamiento } from '../models/tratamientos.modelo';
import { Diente } from '../models/diente.model';
import { CargarTratamiento } from '../interfaces/cargar-treatment.interface';

const base_url = environment.serverBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class TratamientosService {

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
  //-----------GET LISTAR TRATAMIENTOS PARA MOSTRAR EN REGISTRO DE CITAS Y AL AÑADIR TRATAMIENTO A LA PROFORMA---------
  cargarTratamientosCitas() {

    const url = `${ base_url }/treatments/citas`;
    return this.http.get( url, this.headers)
              .pipe(
                map((resp: any) => resp.treatment as Tratamiento[])
              );
  }
  //---------#-PARA EL MENU DE TRATAMIENTOS CRUD--#----------------------------
  cargarTratamientos(desde: number = 0, termino: string = '') {

    const url = `${ base_url }/treatments?desde=${desde}&termino=${termino}`;
    return this.http.get<CargarTratamiento>( url, this.headers)
              .pipe(
                //map((resp: any) => resp.treatment as Tratamiento[])
                map((resp: any) => resp)
              );
  }

  //-----REGISTRAR TRATAMIENTO---
  crearTratamiento( formData: Tratamiento){
    //console.log('crear usaurio');
    return this.http.post(`${base_url}/treatments`, formData, this.headers)
  }

   //-----OBTENER TRATAMIENTO POR ID
   obtenerTratamiento( id : number ) {
    const url = `${ base_url }/treatments/${ id }`;
    return this.http.get( url)
              .pipe(
                map((resp: any) => resp.treatment as Tratamiento)
              );
  }

  //----EDITAR TRATAMIENTO---
  actualizarTratamiento( dato: Tratamiento ) {

    const url = `${ base_url }/treatments/${ dato.id }`;
    return this.http.put( url, dato, this.headers );
  }
  //-----CAMBIAR ESTADO DEL TraTamienTo--
  putStateTreatmet( dato: Tratamiento  ) {

    const url = `${ base_url }/treatments/state/${ dato.id }`;
    return this.http.put( url, dato, this.headers );
  }
  borrarTratamiento( dato: Tratamiento ) {

    const url = `${ base_url }/treatments/${ dato.id }`;
    return this.http.delete( url, this.headers );
  }

  //-------DIENTES------
  cargarDientes() {

    const url = `${ base_url }/treatments/dientes/tooth`;
    return this.http.get( url)
              .pipe(
                map((resp: any) => resp.diente as Diente[])
              );
  }

  //-----------GET LISTAR TRATAMIENTOS PARA reporTe DE PAGO EN BUSQUEDA -*---------
  cargarTratamientReportPagos() {

    const url = `${ base_url }/treatments/reporte/pago`;
    return this.http.get( url, this.headers)
              .pipe(
                map((resp: any) => resp.treatment as Tratamiento[])
              );
  }
}
