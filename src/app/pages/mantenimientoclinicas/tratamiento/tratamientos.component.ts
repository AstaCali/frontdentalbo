import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tratamientos',
  templateUrl: './tratamientos.component.html',
  styleUrls: ['./tratamientos.component.css']
})
export class TratamientosComponent implements OnInit {
  public titulo : string = '';
  // public tratamientoForm : Tratamiento[]=[];
  public tratamientoForm : any;
  public tratamientoSeleccionado? : Tratamiento;

  constructor(private activatedRoute: ActivatedRoute,
              private fb : FormBuilder, 
              private tratamientosService : TratamientosService,
              private router: Router,
  ){}

  ngOnInit(): void {
    //---Para obtener losa datos para editar--
    this.activatedRoute.params
    .subscribe( ({id}) => this.cargarTratamiento( id ) ); 

    this.tratamientoForm = this.fb.group({
      name_treatment :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      price :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*')]],
      discount :['', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern('[0-9]*')]],
    });

  }
  
  cargarTratamiento(id: number | string){
    //console.log('ANTES_DEL_NUEVO',id);
    if ( id === 'nuevo' ) {
      this.titulo = 'Registra Tratamiento'
      //console.log('DESPUES_DEL_NUEVO_ENTRA');
      return;
    }
    //console.log('ENTRA PARA EDITAR_RECUPERAR DATOS');
    this.titulo = 'Actualizar Tratamiento'
    this.tratamientosService.obtenerTratamiento(Number (id) )
      .subscribe( dato => {

        //console.log('DATO RECUPERADO', dato);
        this.tratamientoSeleccionado = dato;
        this.tratamientoForm.patchValue({ 
        //this.usurioForm.setValue({ 
          name_treatment: dato.name_treatment,
          price: dato.price,
          discount: dato.discount,
        });
      },
      error=>{
        //console.log(error);
        this.router.navigateByUrl(`/dashboard/tratamientos`);
        Swal.fire('Usuario no actualizado',error.error.msg)
      }
      );

  }
  guardarTratamiento(){

    if ( this.tratamientoSeleccionado){
      //console.log('CARGA QUE SE USARA PARA REGIS◘4RAR EL EDITADO', this.tratamientoSeleccionado);
    //   //--acTualizar
      const data = {
        ...this.tratamientoForm.value,
        id: this.tratamientoSeleccionado.id
      }
      //console.log('LO QUE SE ENVIARA PARA_DATA',data)
      const { name_treatment } = this.tratamientoForm.value;
      this.tratamientosService.actualizarTratamiento( data )
        .subscribe( resp =>{
          //console.log('SE ACTUALIZO',resp)
          Swal.fire('Actualizando',`${ name_treatment } actualizado correctamente`, 'success' );
          this.router.navigateByUrl(`/dashboard/tratamientos`)
        })

    } else{
      //   //--crear
      //console.log('ENVIANDO DATOS!!',this.tratamientoForm.value);
      const { name_treatment } = this.tratamientoForm.value;
      this.tratamientosService.crearTratamiento( this.tratamientoForm.value )
        .subscribe( resp => {
          //console.log('RESP:', resp);
          Swal.fire('Creado', `${ name_treatment } creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/tratamientos`)
      })
    }
  }
  //----CANCELAR PARA SALIR DEL FORMULARIO
  cancelar(){
    this.router.navigateByUrl(`/dashboard/tratamientos`);
  }

}
