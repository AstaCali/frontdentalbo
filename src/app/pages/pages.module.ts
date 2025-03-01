import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RouterModule } from  '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//---MODULOS IMPORTADOS DE TERCEROS QUENO HICE Y NO SON DE ANGULAR 


//--MODULOS IMPORTADOS DE LO QUE HISE
import { SharedModule } from '../shared/shared.module';
import { ComponentsModule } from '../components/components.module';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';
import { RxjsComponent } from './programarcitas/rxjs/rxjs.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { UsuarioComponent } from './mantenimientos/usuarios/usuario.component';
import { OdontologosComponent } from './mantenimientos/odontologos/odontologos.component';
import { OdontologoComponent } from './mantenimientos/odontologos/odontologo.component';
import { TratamientoComponent } from './mantenimientoclinicas/tratamiento/tratamiento.component';
import { TratamientosComponent } from './mantenimientoclinicas/tratamiento/tratamientos.component';
//-----FULLCALENDAR-----
import { FullCalendarModule } from '@fullcalendar/angular';
import { CitasComponent } from './programarcitas/citas/citas.component';
import { PrimeracitaComponent } from './programarcitauno/primeracita/primeracita.component';
import { CrudcitasComponent } from './programarcitauno/crudcitas/crudcitas.component';
import { ProformadentalComponent } from './proforma/proformadental/proformadental.component';
import { CrearproformaComponent } from './proforma/crearproforma/crearproforma.component';
import { CreardetalleproformaComponent } from './proforma/creardetalleproforma/creardetalleproforma.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { MsjcitasComponent } from './programarcitauno/msjcitas/msjcitas.component';
import { PagosdetalleprofrmComponent } from './proforma/pagosdetalleprofrm/pagosdetalleprofrm.component';
//-----HASTA AQUI------
//----*-NG2-CHART--*--
import { NgChartsModule } from 'ng2-charts';
import { ReportepagosComponent } from './reportes/reportepagos/reportepagos.component';
import { QRCodeModule } from 'angularx-qrcode';
import { PacienteuserComponent } from './programarcitauno/pacienteuser/pacienteuser.component';
import { ReportestadoComponent } from './reportes/reportestado/reportestado.component';
import { AnalityabcComponent } from './anality/analityabc/analityabc.component';
import { AnalityunoComponent } from './anality/analityuno/analityuno.component';
import { AnalitydosComponent } from './anality/analitydos/analitydos.component';
import { AnalitytresComponent } from './anality/analitytres/analitytres.component';
import { AnalitycuatroComponent } from './anality/analitycuatro/analitycuatro.component';
import { AnalitycincoComponent } from './anality/analitycinco/analitycinco.component';
import { AnalityseisComponent } from './anality/analityseis/analityseis.component';
//import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
    RxjsComponent,
    UsuariosComponent,
    UsuarioComponent,
    OdontologosComponent,
    OdontologoComponent,
    TratamientoComponent,
    TratamientosComponent,
    CitasComponent,
    PrimeracitaComponent,
    CrudcitasComponent,
    ProformadentalComponent,
    CrearproformaComponent,
    CreardetalleproformaComponent,
    MsjcitasComponent,
    PagosdetalleprofrmComponent,
    ReportepagosComponent,
    PacienteuserComponent,
    ReportestadoComponent,
    AnalityabcComponent,
    AnalityunoComponent,
    AnalitydosComponent,
    AnalitytresComponent,
    AnalitycuatroComponent,
    AnalitycincoComponent,
    AnalityseisComponent,
  ],
  exports:[
    DashboardComponent,
    ProgressComponent,
    Grafica1Component,
    PagesComponent,
  ],
  imports: [
    //--imporX4acio de ANGULAR PROPIO
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //--imporTar de angular propio de formatear fecha
    DatePipe,
    //---imporX4acio de terceros

    //--imporTacion que hice
    SharedModule,
    RouterModule,
    ComponentsModule,

    //----------FULLCALENDAR--
    FullCalendarModule,
    //BrowserModule,
    //FullCalendarModule,
    //NgbModalModule,
    //FormsModule,
    //------HASTA AQUI--------
    AutocompleteLibModule,
    //----NG CHAR-----
    NgChartsModule,
    //---QR IMAGEN GENERAR---
    QRCodeModule,

  ]
})
export class PagesModule { }
