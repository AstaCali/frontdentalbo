import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { RegisterFormUsuario } from '../interfaces/user-register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Usuario } from '../models/usuario.model';
import { Role } from '../models/roles.model';
import { CargarUsuarioss } from '../interfaces/cagar-usuario.interface';

const base_url = environment.serverBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;
  //public usuario: Usuario = new Usuario(0, '', '', '', null); 

  constructor( private htt: HttpClient, private router :Router) 
  {}

  // crearUsuario( formData: any){
  //   console.log('crear usaurio');
  // }
  //------------UNIR RESPOUEStA DE resp de token y menu---
  guardarLocalStorage ( token: string, menu: any ){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }
  //---------HASTA AQUI--------
  crearUsuario( formData: RegisterFormUsuario){
    //console.log('crear usaurio');
    return this.htt.post(`${base_url}/users`, formData)
          .pipe(
            tap( (resp: any) => {
              localStorage.setItem('token', resp.token); //----#-ES◘4A POR VERCE SI ME SALE ERROR COLOCAR LO DE ABAJO
              // this.guardarLocalStorage(resp.token, resp.menu);
            }) 
          )
  }
  
  login( formData: any){
    //login( formData: LoginForm){
    //console.log('crear usaurio');
    return this.htt.post(`${base_url}/auth/login`, formData)
            .pipe(
              tap( (resp: any) => {
                // localStorage.setItem('token', resp.token);
                // localStorage.setItem('menu', resp.menu);
                localStorage.setItem('token', resp.token);
              }) 
            )
  }

  validarToken() : Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.htt.get(`${base_url}/auth/renew`, {
      headers:{
        'x-token': token
      }
    }).pipe(
      tap( (resp:any)=>{
        //console.log(resp);
        const {
          role,
          person,
          email,
          id,
          odontologoId,
          //role_id
        } = resp.usuario;
        this.usuario = new Usuario(id,email,'',role,person,odontologoId); 
        //this.usuario.imprimirUsuario();
        // localStorage.setItem('token', resp.token);
        // localStorage.setItem('menu', resp.menu);
        this.guardarLocalStorage(resp.token, resp.menu);
      }),
      map( resp => true),
      // catchError( error =>{
      //   console.log(error);
      //  return of (false);})
      catchError( error => of (false))// atrapa el error cuando no esTa auThenticado.Y envia un nuevo Obser♂8ol no auPenX4icado ose false.
    );
  }

  logout(){
    localStorage.removeItem('token');
    //---ELIMINAR MENU
    localStorage.removeItem('menu');
    this.router.navigateByUrl('/login');
  }

  //----------------------------------DeTe aqui DRUD USAURIO--------------
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
  //----para garar e id de usuario--
  get id(): number {
    return this.usuario.id || 0;
  }
  //----para agarar el name del rol--
  get name(): string {
    return this.usuario.role.name || '';
  }
  //-----------GET LISTAR USUARIO---------
  cargarUsuario(desde: number = 0, termino: string = '') {

    const url = `${ base_url }/users?desde=${desde}&search=${termino}`;
    return this.htt.get<CargarUsuarioss>( url, this.headers )
              .pipe(
                // map((resp: any) => resp.users as Usuario[])
                map((resp: any) => resp)
              );
  }
  //-----OBTENER USAURIO POR ID
  obtenerUsuario( id : number ) {
    const url = `${ base_url }/users/${ id }`;
    return this.htt.get( url, this.headers )
              .pipe(
                map((resp: any) => resp.user as Usuario)
              );
  }
  //-----Eliminar usuario--
  borrarUsuario( id: number ) {

    const url = `${ base_url }/users/${ id }`;
    return this.htt.delete( url, this.headers );
  }
  //----ACTUALIZAR USUARIO---
  actualizarUsuario( usuario: Usuario  ) {

    const url = `${ base_url }/users/${ usuario.id }`;
    return this.htt.put( url, usuario, this.headers );
  }
  //---LISTAR ROLES---
  cargarRoles() {
    const url = `${ base_url }/roles`;
    return this.htt.get( url, this.headers )
              .pipe(
                map((resp: any) => resp.roles as Role[])
              );
  }

  //------REGISTRAR Pagos_de los Tratamientos*----
  cambiarPasswor(userId: number, passwordData: { currentPassword: string; newPassword: string; confirmPassword: string }): Observable<any> {
    return this.htt.put(`${base_url}/auth/resetPass/${userId}`, passwordData);
  }
}
