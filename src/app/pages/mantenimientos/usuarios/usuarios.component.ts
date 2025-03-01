import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public usuario: Usuario[] = [];
  //public usuarios: any;
  public totalUsuario : number = 0;
  public desde : number = 0;

  constructor (private usarioService :UsuarioService){}

  ngOnInit(): void {
    this.cargarUsuarios('');
  }

  //--listar usuario
  cargarUsuarios(termino : string) {
    //this.cargando = true;
    this.usarioService.cargarUsuario(this.desde, termino)
      .subscribe( ({total, users}) => {
          //console.log(total, users);
          this.totalUsuario = total;
          this.usuario = users;
      })
  }
  //----BORRAR USUARIO----
  borrarUsuario( usuario : Usuario){
    //console.log("LLEGA PARA BORRAR", usuario);
    if( usuario.id === this.usarioService.id ){
      //console.log('USUARIO_DEL_ID', this.usarioService.id);
        Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
        return;
    }

    Swal.fire({
      title: '¿Borrar Usuario?',
      text: `Esta a punto de borrar a ${ usuario.person.name }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        //this.medicoService.borrarMedico( medico._id )
        this.usarioService.borrarUsuario( usuario.id )
          .subscribe( resp => {
            
            //this.cargarUsuarios();
            Swal.fire(
              'Médico borrado',
              `${ usuario.person.name } fue eliminado correctamente`,
              'success'
            );
            this.cargarUsuarios('');
            
          });

      }
    })

  }
  //----para cambiar pagina---
  cambiarPagina( valor : number){
    //console.log('cambia', valor);
    this.desde += valor; 
    if (this.desde < 0){
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuario){
      this.desde -= valor;
    }
    this.cargarUsuarios('');
  }

}
