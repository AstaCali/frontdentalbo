import { Component, OnInit } from '@angular/core';
import { Odontologo } from 'src/app/models/odontologo.model';
import { Usuario } from 'src/app/models/usuario.model';
import { OdontologoService } from 'src/app/services/odontologo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-odontologos',
  templateUrl: './odontologos.component.html',
  styleUrls: ['./odontologos.component.css']
})
export class OdontologosComponent implements OnInit{

  public odontologos : Odontologo[]=[];
  public totalDentista : number = 0;
  public desde : number = 0;

  public usuarioTemp : Usuario[]=[];//para sacar el id del user 

  constructor(private odontologoService : OdontologoService,
              private usuarioService: UsuarioService
  ){}

  ngOnInit(): void {

    this.cargarDentista('');
  }
  //-----LISTAR ODONTOLOGO-CON BUSCADOR--
  cargarDentista( termino : string){
    //this.cargando = true;
    //console.log('LLEGA DENTISTA BUSCAR!!!#',termino);
    this.odontologoService.cargarOdontologo(this.desde, termino)
      .subscribe( ({total, dentis}) => {
        //console.log(total, dentis);
        this.totalDentista = total;
        this.odontologos = dentis;
        // console.log('LLEGA DENTISTA!!!#',this.odontologos);
        //this.usuariosTemp = usuarios;
        //this.cargando = false;
    })
  }
  cambiarStado(state : Odontologo){
    //console.log('stado',state);
    Swal.fire({
      title: 'Cambiar Estado?',
      text: `Esta a punto de Cambiar estado ${ state.person.name } ${state.person.last_name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Cambiar'
    }).then((result) => {
      if (result.value) {
        
        this.odontologoService.putStateOdontologo( state )
        .subscribe( resp => {
          //console.log('#--#',resp);
          Swal.fire(
            'Estado',
            // `fue eliminado correctamente`,
            `${ state.person.name } fue Actualizado correctamente`,
            'success',
          );
          this.cargarDentista('');
          //this.cerrar();
          
        });
        //this.cerrar();
      }
    });
  }
  //-----ELIMINAR DENTISTA--
  borrarDentista( dentista : Odontologo): void{
    //console.log("LLEGA PARA BORRAR", dentista);
    if( dentista.users.id === this.usuarioService.id ){
      //console.log('USUARIO_DEL_ID', this.usuarioService.id);
       Swal.fire('Error', 'No puede borrarse a si mismo', 'error');
       return;
    }
    // console.log('Esto no se tiene que ver');
    // return;
    Swal.fire({
      title: 'Borrar Odontologo?',
      text: `Esta a punto de eliminar${ dentista.person.name } ${dentista.person.last_name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {
        
        this.odontologoService.borrarDentista( dentista )
        .subscribe( resp => {
          //console.log('#-Borrado-#',resp);
          Swal.fire(
            'Dentista',
            // `fue eliminado correctamente`,
            `${ dentista.person.name } fue Borrado correctamente`,
            'success',
          );
          this.cargarDentista('');          
        });
      }
    });
  }

  cambiarPagina( valor : number){
    this.desde += valor; 
    if (this.desde < 0){
      this.desde = 0;
    } else if ( this.desde >= this.totalDentista){
      this.desde -= valor;
    }
    this.cargarDentista('');
  }

}
