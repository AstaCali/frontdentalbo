import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  //styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{

  public usuario : Usuario;
  // menuItems: any[];
  constructor( public sidebarService : SidebarService,
              private usarioService : UsuarioService){
    this.usuario = usarioService.usuario;
    //console.log('LLEGA SIDEBAR:',this.usuario);
  }

  ngOnInit(): void {
    //this.sidebarService.cargarMenu();
  }

}
