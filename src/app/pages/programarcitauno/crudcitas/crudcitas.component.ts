import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { format } from 'date-fns';

import { map, startWith, switchMap } from 'rxjs';

import { TipoCitas } from 'src/app/models/tipocita.model';
import { Usuario } from 'src/app/models/usuario.model';
import { Odontologo } from 'src/app/models/odontologo.model';

import { CitasService } from 'src/app/services/citas.service';
import { OdontologoService } from 'src/app/services/odontologo.service';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Citass } from 'src/app/models/citas.model';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { TratamientosService } from 'src/app/services/tratamientos.service';

@Component({
  selector: 'app-crudcitas',
  templateUrl: './crudcitas.component.html',
  styleUrls: ['./crudcitas.component.css']
})
export class CrudcitasComponent implements OnInit{

  //----ABRIL MODAL DE AÑADIR PACIENTE--
  public abrilModal : boolean = false;
  //---HAStA AQUI--

  @Input() fechaHoraSeleccionada: Date | undefined;
  @Output() cancelarFormulario = new EventEmitter<void>();
  @Output() cerrarFormularioCita = new EventEmitter<void>();
  // @Output() listarFormulario = new EventEmitter<void>();
  fechaFormateada: string | undefined;
  horaFormateada: string | undefined;

  @Input() citaSeleccionada: number = 0;// se enVia el id para editar
  // @Input() idOdontologo: number | null | undefined;
  @Input() idOdontologo: number = 0;
  public citaSeleccionado: any; //--se carga en el nuevo array/objeTo para mandar para ediTar
  // public citaSeleccionado: Citass[]=[]; //--se carga en el nuevo array/objeTo para mandar para ediTar
  public citas : Citass[]=[];

  public citaForm: any; // formulario de registro
  //public tipoCita: TipoCitas[] = [];// listado de TIPO DE CITA
  public paciente: Usuario[] = [];// listado de Usuario de personas con role "paciente"
  public dentista: Odontologo[] = [];// listado Dentista
  //-----Cargar TratamienTo----
  public tratamientos : Tratamiento[] = [];

  constructor( private fb: FormBuilder,
              private citasService : CitasService,
              private odontologoService : OdontologoService,
              public tratamientosService : TratamientosService,
              private router: Router,
              private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // console.log('Valor de citaSeleccionada en CrudcitasComponent:', this.citaSeleccionada);
    // console.log('Valor de idOdontologo en CrudcitasComponent:', this.idOdontologo);

    this.cargarUserPersonas();
    this.cargarDentistass();
    this.listarTratamientos();
    this.citaForm = this.fb.group({
      dentista_id: ['', Validators.required ],
      // person_id: [null, Validators.required ],
      person_id: ['', Validators.required ],
      //tipo_cita_id: ['', Validators.required ],
      //tiempo: ['', Validators.required ],
      motivo: ['', Validators.required ],
      fecha: ['', Validators.required ],
      hora_inicio: ['', Validators.required ],
      hora_final: ['', Validators.required ],
    });
     //---Para obtener losa datos para editar--
    // Luego, puedes llamar a la función cargarCitasGetbyID aquí
    if (this.citaSeleccionada !== 0) {//--entra adentrosi es distinto a undefinido
      console.log('es%&:', this.citaSeleccionada);
      this.cargarCitasGetbyID(this.citaSeleccionada);
    } 
    //-------------------LO QUE SE ENVIA DE FULL CALENDAR -----------------
    if (this.fechaHoraSeleccionada) {
      // Formatea la fecha y la hora seleccionada
      this.fechaFormateada = format(this.fechaHoraSeleccionada, 'yyyy-MM-dd');
      this.horaFormateada = format(this.fechaHoraSeleccionada, 'HH:mm:ss');
      //this.cita_id = this.fechaHoraSeleccionada.id;
      console.log('TIME',this.horaFormateada);
      this.citaForm.setValue({
        dentista_id:'',
        person_id:'',
        motivo : '',
        //tipo_cita_id:1,
        //tiempo: 1, // Ajusta según tus necesidades
        fecha: this.fechaFormateada,
        hora_inicio: this.horaFormateada,
        hora_final:'',
      });

      const controlHoraInicio = this.citaForm.get('hora_inicio');
      const controlTiempo = this.citaForm.get('tiempo');

      if (controlHoraInicio && controlTiempo) {
        // Observa cambios en el control hora_inicio, incluyendo el valor inicial
        controlHoraInicio.valueChanges.pipe(
          startWith(controlHoraInicio.value),
          switchMap((horaInicio: string) => {
            // Observa cambios en el control tiempo, incluyendo el valor inicial
            return controlTiempo.valueChanges.pipe(
              startWith(controlTiempo.value),
              map((duracionSeleccionada: number) => ({ horaInicio, duracionSeleccionada }))
            );
          })
        ).subscribe(({ horaInicio, duracionSeleccionada }: { horaInicio: string, duracionSeleccionada: number }) => {
          // console.log('Se ha producido un cambio en la hora de inicio:', horaInicio);
          // console.log('Valor de tiempo:', duracionSeleccionada);
          if (horaInicio !== null && duracionSeleccionada !== null && duracionSeleccionada !== undefined) {
            // Calcula la hora final sumando la duración seleccionada en minutos
            const minutos = duracionSeleccionada === 1 ? 30 : duracionSeleccionada * 60;
            const horaFinal = this.sumarMinutos(horaInicio, minutos);
      
            // Actualiza el valor del control de la hora final
            this.citaForm.patchValue({
              hora_final: horaFinal.slice(0, 5), // Solo los primeros 5 caracteres
            });
      
            // Muestra el valor de hora_final en la consola
            //console.log('Valor de hora_final después de actualizar:', this.citaForm.get('hora_final')?.value);
          }
        });
      }
    }
    //----------------------HASTA AQUI------------------------
  }

  sumarMinutos(hora: string, minutos: number): string {
    const horaDate = new Date(`1970-01-01T${hora}`);
    horaDate.setMinutes(horaDate.getMinutes() + minutos);
    return horaDate.toTimeString().slice(0, 8);
  }

  cargarUserPersonas() {

    this.citasService.cargarPersonPaciente()
      .subscribe( (data: Usuario[]) => {
        this.paciente = data;
        //console.log('LLEGA Pacientes_USERS#',this.paciente);
      })
  }
  cargarDentistass() {

    // this.odontologoService.cargarOdontologo()
    this.odontologoService.cargarOdontologoCalendar()
      .subscribe( (data: Odontologo[]) => {
        this.dentista = data;
        //console.log('LLEGA DENTISTA!!#',this.dentista);
        if(this.idOdontologo !== 0){
          //console.log('ENTRO Y LLAMA A LA FUNCION#:', this.idOdontologo);
          //this.cargaridOdontologo(this.idOdontologo);
          //console.log('cargaridOdontologo',idOdontologo);
          this.citaForm.patchValue({ 
            dentista_id: this.idOdontologo,
          });
        }
      })
  }

  guardarCita() {
    if ( this.citaSeleccionado){
      //if (this.proformaDetallSeleccionado && this.proformaDetallSeleccionado.length > 0) {
      //console.log("GUARDANDO DE LA EDITACION_PORQUE ENTRO",this.citaSeleccionado);
      //--acTualizar
      const data = {
        ...this.citaForm.value,
        id: this.citaSeleccionado.id // se lo agrega el ida para enTiar con el id de deTalle cotizacion
      }
      //console.log("#...this.citaForm.value_#PARA YA REGISTRAR",data);
      //this.cerrar();
      this.citasService.putCita( data )
      .subscribe( resp =>{
        //console.log('SE ACTUALIZO citaForm: ',resp)
        // Swal.fire('Actualizando',`${ name } actualizado correctamente`, 'success' );
        Swal.fire('Actualizando',`actualizado correctamente`, 'success' );
        this.cerrar();
      })
  
      } else{
        // console.log('Datos del paciente:');
        // console.log('Se enVia datos!!:',this.citaForm.value);
        this.fechaHoraSeleccionada = undefined;
        //const { nombre } = this.citaForm.value;
        this.citasService.crearCita( this.citaForm.value )
        .subscribe( (resp: any) => {
          // Swal.fire('Creado', `${ nombre } creado correctamente`, 'success');
          //this.cancelar();
          Swal.fire('Creado', `creado correctamente`, 'success');
          this.cerrar();
          //this.router.navigateByUrl(`/dashboard/programar_cita`)
          //this.router.navigateByUrl(`/dashboard/medico/${ resp.medico._id }`)
        })
      }
  }
  cancelar() {
    this.cancelarFormulario.emit(); // Emite el evento al hacer clic en "Cancelar"
  }

  cerrar() {
    this.cerrarFormularioCita.emit(); // Emite el evento al hacer clic en "Cancelar"
  }
 
  //----RECUPERAR DATOS DE CITAS PARA HACER EL EDITAR---
  cargarCitasGetbyID(id: number){
    // Implementa la lógica para cargar las citas por ID aquí
    // console.log('AQUI###');
    // console.log('Cargando citas para el ID!!:', id);
    if ( id === 0 ) {
      //console.log('ENTRA PAARA REGISTRAR_NO_RECUPERARDATO');
      return;
    }
    //console.log('CARGARA PARA EDITAR');

    this.citasService.obtenerCitaId(Number (id) )
    .subscribe( datocita => {
      //console.log('DATO DESPUES DEL IF', datocita);
      //console.log('Datos de la cita obtenidos:', datocita);

      //const { dentista_id, person_id} = datocita; 
      //this.citaSeleccionada = medico;
      this.citaSeleccionado = datocita;
      //console.log('SE CARGO A: citaSeleccionado', this.citaSeleccionado);
      // Asigna el tratamiento seleccionado
      // const selectedTreatment = this.tratamientos.find(t => t.name_treatment === this.citaSeleccionado.motivo);
      this.citaForm.setValue({ 
        dentista_id: datocita.dentista_id,
        person_id: datocita.person_id,
        // motivo : selectedTreatment?.name_treatment,
        motivo : this.citaSeleccionado.motivo,
        //tipo_cita_id:1,
        //tiempo: 1, // Ajusta según tus necesidades
        fecha: datocita.fecha,
        hora_inicio: datocita.hora_inicio,
        hora_final: datocita.hora_final,
      });
      // Actualiza el valor del campo de entrada de ng-autocomplete
      //this.autocompleteInput.query = this.citaSeleccionado.motivo;
    },
    error=>{
      //console.log(error);
      //this.router.navigateByUrl(`/dashboard/odontologos`);
      Swal.fire('Usuario no actualizado',error.error.msg)
    }
    );
  }
  //-----------HASTA AQUI-------------------
  //---------BORRAR CITA---
  cargarParaBorraCita() {
    if (this.citaSeleccionado && this.citaSeleccionado.id) {
      this.borrarCita(this.citaSeleccionado.id);
    } else {
      //console.log('No hay cita seleccionada para borrar.');
    }
  }
  //----por a hora el eliminar
  borrarCita(id: number) {
    this.citasService.deleteCita(id).subscribe(response => {
      //console.log('Cita eliminada:', response);
      Swal.fire('Eliminado!', 'La cita ha sido eliminada.', 'success');
      this.cerrar();
      // Aquí puedes agregar lógica adicional, como actualizar la lista de citas o navegar a otra página.
    }, error => {
      //console.log('Error al eliminar la cita:', error);
      Swal.fire('Error', 'Hubo un problema al eliminar la cita.', 'error');
    });
  }
  //-----LISTAR TRATAMIENTOS--
  listarTratamientos(){
    this.tratamientosService.cargarTratamientosCitas()
    .subscribe( data => {
      this.tratamientos = data;
      //console.log('LLEGA Tratamientos',this.tratamientos);
      //this.usuariosTemp = usuarios;
      //this.cargando = false;
    })
  }
  //---CARGA EL SELCT CON EL ODONTOLO YA SELECCIONADO CON EL CHECKBOX PARA REGISTRAR---

  //----ABRIL MODAL DE AÑADIR PACIENTE---
  abrilModalPaciente(){
    this.abrilModal = true;
  }
  cerrarModalPaciente(){
    this.abrilModal = false;
    this.cargarUserPersonas();
  }
  cancelarModalPaciente(){
    this.abrilModal = false;
  }
  //--HAStA AQUI--
  
}
