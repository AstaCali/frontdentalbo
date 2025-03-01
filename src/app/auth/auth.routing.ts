import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PaginawebComponent } from './paginaweb/paginaweb.component';
import { ChatbotComponent } from './chatbot/chatbot.component';


const routes: Routes =[
  //---Crear rutas qeu NO esTaran protegidas al iniciar sesion--
  //{ path: 'dentalBo_web', component: PaginawebComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  //--hasta aqui--
  //{ path: 'chat', component: ChatbotComponent},
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class AuthRoutingModule {}