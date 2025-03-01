import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { RxjsComponent } from './programarcitas/rxjs/rxjs.component';

//---MANTENIMIENTO RUTA PARA LISTAR USUARIO
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { UsuarioComponent } from './mantenimientos/usuarios/usuario.component';
import { OdontologosComponent } from './mantenimientos/odontologos/odontologos.component';
import { OdontologoComponent } from './mantenimientos/odontologos/odontologo.component';
import { TratamientoComponent } from './mantenimientoclinicas/tratamiento/tratamiento.component';
//import { authGuard } from '../guards/auth.guard';
import { AuthGuard } from '../guards/auth.guard';
//--admin guar--
import { AdminGuard } from '../guards/admin.guard';

import { TratamientosComponent } from './mantenimientoclinicas/tratamiento/tratamientos.component';
import { PrimeracitaComponent } from './programarcitauno/primeracita/primeracita.component';
import { ProformadentalComponent } from './proforma/proformadental/proformadental.component';
import { MsjcitasComponent } from './programarcitauno/msjcitas/msjcitas.component';
import { ReportepagosComponent } from './reportes/reportepagos/reportepagos.component';
import { ReportestadoComponent } from './reportes/reportestado/reportestado.component';
import { AnalityabcComponent } from './anality/analityabc/analityabc.component';
import { AnalityunoComponent } from './anality/analityuno/analityuno.component';
import { AnalitydosComponent } from './anality/analitydos/analitydos.component';
import { AnalitytresComponent } from './anality/analitytres/analitytres.component';
import { AnalitycuatroComponent } from './anality/analitycuatro/analitycuatro.component';
import { AnalitycincoComponent } from './anality/analitycinco/analitycinco.component';
import { AnalityseisComponent } from './anality/analityseis/analityseis.component';
//import { CrearproformaComponent } from './proforma/crearproforma/crearproforma.component';
//import { CrudcitasComponent } from './programarcitauno/crudcitas/crudcitas.component';

const routes: Routes =[
  //---Crear rutas qeu esTaran protegidas al iniciar sesion--
  {
    path: 'dashboard',//ruta padre para que se Visualise  asi:
    component: PagesComponent,
    canActivate:[AuthGuard],
    //canActivate:[authGuard],
    //----RUTAS HIJAS--
    children:[
      { path: '', canActivate : [ AdminGuard ], component: DashboardComponent},
      { path: 'grafica1', component: Grafica1Component},
      { path: 'progress', component: ProgressComponent},
      { path: 'rxjs', component: RxjsComponent},
      { path: 'programar_cita', component: PrimeracitaComponent},
      //{ path: 'programar_citas/:id', component: CrudcitasComponent},
      //{ path: '', redirectTo: '/dashboard', pathMatch: 'full'},//si no ingreso a ninguna ruta le direcciona a dashboard
      // { path: 'proforma', component: ProformadentalComponent},// aumente el 16/04/2024
      //------------------------------PROFORMA LISTAR, CREAR COTIZACION, CREAR DEtALLE DE ES COTIZACION----
      { path: 'proforma/:termino', component: ProformadentalComponent},// aumente el 16/04/2024 Termino es como id
      // { path: 'crearproforma/:id', component: CrearproformaComponent},// aumente el 16/04/2024
      //---------------------------------------------
      //---MSJ DE CITAS PARA RECORDAR---
      { path: 'msjcitas', canActivate : [ AdminGuard ], component: MsjcitasComponent},

      //---MANTENIMIENTO RUTA PARA LISTAR USUARIO
      { path: 'usuario', component: UsuariosComponent},
      { path: 'usuario/:id', component: UsuarioComponent},

      //---MANTENIMIENTO RUTA PARA LISTAR ODONTOLOGO
      { path: 'odontologos', canActivate : [ AdminGuard ], component: OdontologosComponent},
      { path: 'odontologo/:id', canActivate : [ AdminGuard ], component: OdontologoComponent},

      //---MANTENIMIENTO RUTA PARA LISTAR ODONTOLOGO
      { path: 'tratamientos', component: TratamientoComponent},
      { path: 'tratamiento/:id', component: TratamientosComponent},
      //{ path: 'usuario/:id', component: UsuariosComponent, data: { titulo: 'Matenimiento de Medicos' }},
      //-----*--RUTA DE REPORTE--*---
      { path: 'reportepago', component: ReportepagosComponent},
      { path: 'reportepagoestado', component: ReportestadoComponent},

      //-----*--RUTA DE ANALITY REPORTE--*---
      { path: 'analityabc', component: AnalityabcComponent},
      { path: 'analityuno', component: AnalityunoComponent},
      { path: 'analitydos', component: AnalitydosComponent},
      { path: 'analitytres', component: AnalitytresComponent},
      { path: 'analityCuatro', component: AnalitycuatroComponent},
      { path: 'analityCinco', component: AnalitycincoComponent},
      { path: 'analitySeis', component: AnalityseisComponent},
    ]
  },
  //--hasta aqui--
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}