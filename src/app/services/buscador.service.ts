import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs";
import { environment } from "src/environments/environment";
import { Persona } from "../models/persona.modelo";

const base_url = environment.serverBaseUrl;

@Injectable({
    providedIn: 'root'
  })
  export class BuscadorService {

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
  busquedaGlobal( termino: string ) {

      const url = `${ base_url }/persons/general/${ termino }`;
      return this.http.get( url, this.headers );
  
  }
  //-----listar persona---para el buscador genral
  cargarPersona() {
    const url = `${ base_url }/persons`;
    return this.http.get( url, this.headers )
              .pipe(
                map((resp: any) => resp.person as Persona[])
              );
  }

  }