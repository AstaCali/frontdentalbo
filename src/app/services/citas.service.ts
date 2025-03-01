import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Citass } from '../models/citas.model';
import { TipoCitas } from '../models/tipocita.model';
import { Usuario } from '../models/usuario.model';
import { CargarCitasMsj } from '../interfaces/cargar-citasmsj.interface';
import { CitassMsj } from '../models/msjcitas.model';

const base_url = environment.serverBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class CitasService {

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
  //---######################--CRUD CITAS----###########################--
  //-----------GET LISTAR ODONTOLOGO---------
  cargarCitas(id: number): Observable<Citass[]> {
    const url = `${base_url}/citas/citasid/${id}`;
    return this.http.get(url).pipe(
      map((resp: any) => resp.citas as Citass[])
    );
  }
  // cargarCitas( id: number ){

  //   const url = `${ base_url }/citas/citasid/${ id }`;
  //   //return this.http.get( url, this.headers )//--con Token 
  //   return this.http.get( url) //---sin Token
  //             .pipe(
  //               map((resp: any) => resp.citas as Citass)
  //               //map( (resp: {ok: boolean, medico: Medico }) => resp.medico )
  //             );
  // }
  //---------CiTas Por ID----
  obtenerCitaId( id: number ) {

    const url = `${ base_url }/citas/${ id }`;
    //return this.http.get( url, this.headers )//--con Token 
    return this.http.get( url) //---sin Token
              .pipe(
                map((resp: any) => resp.cita as Citass)
                //map( (resp: {ok: boolean, medico: Medico }) => resp.medico )
              );
  }
  //--REGISTRAR PRIMERA CITA --
  crearCita( formData: any){

    const url = `${ base_url }/citas`;
    return this.http.post( url, formData, this.headers );
  }
  //-----EDITAR CITA---
    //----Editar cotizacion Detalle---
  putCita( cita: Citass  ) {

    const url = `${ base_url }/citas/${ cita.id }`;
    return this.http.put( url, cita, this.headers );
  }
  //----ELIMINAR CITA--
  deleteCita( id: number ) {

    const url = `${ base_url }/citas/${ id }`;
    return this.http.delete( url, this.headers );
  }
  //------MSJCITAS LISTAR PARA ENVIAR MENSAJE DE RECORDATORIA WHATSAPP--
  // cargarCitaMsj(desde: number = 0, termino: string = '', fechaInicio?: Date) {

  //   const url = `${ base_url }/citas/msjcita/web?desde=${desde}&search=${termino}&fechaInicio=${fechaInicio}`;
  //   return this.http.get<CargarCitasMsj>( url, this.headers )
  //         .pipe(
  //           // map((resp: any) => resp.users as Usuario[])
  //           map((resp: any) => resp)
  //         );
  // }
  cargarCitaMsj(desde: number = 0, termino: string = '', fechaInicio?: Date) {
    let url = `${ base_url }/citas/msjcita/web?desde=${desde}&search=${termino}`;
    
    if (fechaInicio) {
      const formattedDate = fechaInicio.toISOString().split('T')[0]; // Formatea la fecha a YYYY-MM-DD
      url += `&fechaInicio=${formattedDate}`;
    }
    
    console.log('URL:', url); // Depuración de la URL
  
    return this.http.get<CargarCitasMsj>(url, this.headers)
      .pipe(
        map((resp: any) => resp)
      );
  }
  //-----*-ENVIAR MENSAJE CON EL BUttON-*--

  enviarMsjs(detalle: any[]): Observable<any> {
    const url = `${base_url}/citas/send`;
    return this.http.post(url, { detalles: detalle });
  }
  //---######################--HASTA AQUI----###########################--

  //-----------GET LISTAR TIPO DE CITA ---------
  cargarTipoCitas() {
    const url = `${ base_url }/citas/tipo/cita`;
    return this.http.get( url)
              .pipe(
                map((resp: any) => resp.tipocita as TipoCitas[])
              );
  }
   //-----------GET LISTAR DE USAURIO A PERSONAS CON ROLE "paciente"---------
   cargarPersonPaciente() {
    const url = `${ base_url }/users/persons/paciente`;
    return this.http.get( url)
              .pipe(
                map((resp: any) => resp.pacientes as Usuario[])
              );
  }
}
