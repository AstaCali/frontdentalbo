import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  canActivate(
    //route: ActivatedRouteSnapshot,
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

        return this.usuarioService.validarToken()
          .pipe(
            tap( estaAutenticado =>{
              if(!estaAutenticado){
                // this.router.navigateByUrl('/login'); //-- aqui da si no tiene token lo dirigira a la naVegacio
                //--ESCRIE EL SItIO WEB y LO DICCIONARA AQUI SI NO EStAN LOGEAO
                //this.router.navigateByUrl('/dentalBo_web');
                this.router.navigateByUrl('/login');
              }
            })
          ) // Cambia esto según tus necesidades de autorización.
    }
  
}
