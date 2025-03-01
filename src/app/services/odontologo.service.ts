import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Odontologo } from '../models/odontologo.model';
import { Persona } from '../models/persona.modelo';
import { CargarOdontologoss } from '../interfaces/cargar-dentista.interface';

const base_url = environment.serverBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class OdontologoService {

  constructor( private http: HttpClient) { }

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
  //-----------GET LISTAR ODONTOLOGO---------
  cargarOdontologo(desde: number = 0, termino: string = '') {
    const url = `${base_url}/dentists?desde=${desde}&search=${termino}`;
    return this.http.get<CargarOdontologoss>(url, this.headers).pipe(
      map((resp: any) => resp)
    );
  }
  //-----------GET LISTAR ODONTOLOGO--------- NO SE USA EStO PORAHORA SE USA LO DE ARRIBA
  cargarPersona() {

    const url = `${ base_url }/persons`;
    return this.http.get( url)
              .pipe(
                map((resp: any) => resp.person as Persona[])
              );
  }
  //-----OBTENER DENTISTA POR ID
  obtenerDentista( id : number ) {
    const url = `${ base_url }/dentists/${ id }`;
    return this.http.get( url)
              .pipe(
                map((resp: any) => resp.dentist as Odontologo)
              );
  }

  //--REGISTRAR ODONTOLOGO CON TRATAMIENTOS QUE DA.
  crearDentista( formData: any){
    //console.log('crear usaurio');
    return this.http.post(`${base_url}/dentists`, formData);
          // .pipe(
          //   tap( (resp: any) => {
          //     localStorage.setItem('token', resp.token);
          //   }) 
          // )
  }
  //-----CAMBIAR ESTADO DEL DOCTOR--
  putStateOdontologo( dato: Odontologo  ) {

    const url = `${ base_url }/dentists/state/${ dato.id }`;
    return this.http.put( url, dato, this.headers );
  }
  //----ACTUALIZAR ODONTOLOGO---
  actualizarDentis( odontologo: Odontologo  ) {

    const url = `${ base_url }/dentists/${ odontologo.id }`;
    return this.http.put( url, odontologo, this.headers );
  }
  //-----ELIMINAR DENTIStA---
  borrarDentista( dentista: any ) {

    const url = `${ base_url }/dentists/${ dentista.id }`;
    return this.http.delete( url, this.headers );
  }
  //--------------------------------------------------------------
  //---CARGAR ODONTOLO PARA LISATAR EN FULL CALENDAR---
  cargarOdontologoCalendar() {

    const url = `${ base_url }/dentists/odontologo/fullcalendar`;
    return this.http.get( url)
              .pipe(
                map((resp: any) => resp.dentist as Odontologo[])
              );
  }
}
