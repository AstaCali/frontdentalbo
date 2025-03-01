import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//--MODULOS
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';


const routes: Routes = [

  // path: '/dashboar' PageRouting
  // path: '/progress' PageRouting
  // path: '/grafica1' PageRouting
  // path: '/login' AuthRouting
  // path: '/register' AuthRouting
  //----OTRO EJEMPLO PARA MEDICO PUEDE HACER--
  // path: '/medico' MedicoRouting
  // path: '/proforma' ProformaRouting

  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: '**', component: NopagefoundComponent},
]


@NgModule({
  //declarations: [],
  imports: [
    RouterModule.forRoot( routes ),//ruta principal 
    PagesRoutingModule,
    AuthRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
