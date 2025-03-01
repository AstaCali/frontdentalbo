import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';
import { UsuarioService } from '../services/usuario.service';

//declare function customInitFunctions(): void;// FUNCIONA POR EL MOMENTO
declare function customInitFunctions():void;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: []
})
export class PagesComponent implements OnInit{

  constructor(private sidebarService: SidebarService){}

  ngOnInit(): void {
    customInitFunctions();
    this.sidebarService.cargarMenu();
    //console.log('CARGA DEL MENU LLEGA',this.sidebarService.menu);
  }

}
