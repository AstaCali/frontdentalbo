import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate{

  constructor( private usuarioService: UsuarioService,
                private router : Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot, 
    // state: RouterStateSnapshot): boolean{ 
    state: RouterStateSnapshot): boolean{ 


      const userRole = this.usuarioService.name;

      if (userRole === 'ADMINISTRADOR' || userRole === 'SECRETARIA') {
        //console.log('NAME_ROLE_GUARD', userRole);
        return true;
      } else {
        //console.log('NAME_ROLE_GUARD', userRole);
        this.router.navigateByUrl('/dashboard/programar_cita');
        return false;
      }
      // if(this.usuarioService.name === 'ADMINISTRADOR' || 'SECRETARIA'){
      //   console.log('NAME_ROLE_GUARDA', this.usuarioService.name);
      //   return true
      // }else{
      //   console.log('NAME_ROLE_GUARDA', this.usuarioService.name);
      //   this.router.navigateByUrl('/dashboard/programar_cita');
      //   return false
      // }
      // console.log('AdminGuard')
      // return ( this.usuarioService.name ===  'ADMINISTRADOR') ? true : false;
    
  }
}

// export const adminGuard: CanActivateFn = (route, state) => {
//   return true;
// };
