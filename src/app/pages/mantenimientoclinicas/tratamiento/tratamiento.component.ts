import { Component, OnInit } from '@angular/core';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tratamiento',
  templateUrl: './tratamiento.component.html',
  styleUrls: ['./tratamiento.component.css']
})
export class TratamientoComponent implements OnInit {

  public tratamientos : Tratamiento[] = [];

  public totalTratamiento : number = 0;
  public desde : number = 0;

  constructor( private tratamientosService: TratamientosService){}

  ngOnInit(): void {

    this.cargarTratamiento();
    
  }
  //-----LISTAR TRATAMIENTOS--
  cargarTratamiento(termino: string = ''): void {
    this.tratamientosService.cargarTratamientos(this.desde, termino)
        .subscribe(({ total, treatments }) => {
          console.log(total,treatments);
          this.totalTratamiento = total;
          this.tratamientos = treatments;
        });
  }
  cambiarPagina( valor : number){
    //console.log('cambia', valor);
    this.desde += valor; 
    if (this.desde < 0){
      this.desde = 0;
    } else if ( this.desde >= this.totalTratamiento){
      this.desde -= valor;
    }
    this.cargarTratamiento();
  }
  cambiarStado(state : Tratamiento){

    //console.log('stado',state);

    this.tratamientosService.putStateTreatmet( state )
    .subscribe( resp =>{
      //console.log('SE ACTUALIZO',resp)
      Swal.fire('Actualizando',`${ state.name_treatment } actualizado correctamente`, 'success' );
      this.cargarTratamiento();
      //this.router.navigateByUrl(`/dashboard/tratamientos`)
    })
  }
  borrarTratamiento( treatment : Tratamiento): void{
    //console.log("LLEGA PARA BORRAR", treatment);

    Swal.fire({
      title: 'Borrar Tratamiento?',
      text: `Esta a punto de eliminar${ treatment.name_treatment }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
      if (result.value) {
        
        this.tratamientosService.borrarTratamiento( treatment )
        .subscribe( resp => {
          //console.log('#-Borrado-#',resp);
          Swal.fire(
            'Tratamiento',
            // `fue eliminado correctamente`,
            `${ treatment.name_treatment } fue Borrado correctamente`,
            'success',
          );
          this.cargarTratamiento();          
        });
      }
    });
  }
}
