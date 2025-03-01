import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
//import {AutocompleteLibModule} from 'angular-ng-autocomplete'; aumnte para hacwr el buscador autocompletado
//import { AutocompleteLibModule } from 'angular-ng-autocomplete';


@NgModule({
  declarations: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  exports: [
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    //AutocompleteLibModule, // se importo aqui
    ReactiveFormsModule
  ]
})
export class SharedModule { }
