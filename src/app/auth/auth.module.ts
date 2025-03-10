import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PaginawebComponent } from './paginaweb/paginaweb.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { RenamepassComponent } from './renamepass/renamepass.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    PaginawebComponent,
    ChatbotComponent,
    RenamepassComponent,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AuthModule { }
