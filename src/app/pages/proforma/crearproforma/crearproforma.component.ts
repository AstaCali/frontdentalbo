import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalProformaService } from 'src/app/services/proforma-modal.service';
import { ProformaService } from 'src/app/services/proforma.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crearproforma',
  templateUrl: './crearproforma.component.html',
  styleUrls: ['./crearproforma.component.css']
})
export class CrearproformaComponent implements OnInit {
  idCrearProforma: number = 0; // Por ejemplo, el ID que deseas enviar
  //idCrearProforma: any=[]; // Por ejemplo, el ID que deseas enviar
  @Output() enviarDatos: EventEmitter<number> = new EventEmitter<number>();//--
  

  @Output() cancelarFormulario = new EventEmitter<void>();
  @Output() cerrarFormulario = new EventEmitter<void>();
  @Input() idSeleccionado: number | undefined;
  public proformaForm : any; // para registrar formulario
  public proformaSeleccionado : any;//--se usapara el editar lo que se recpera se almacena ai.

  constructor( public modalProformaService : ModalProformaService,
              private fb : FormBuilder,
              private proformaService: ProformaService
  ){}

  ngOnInit(): void {
    // console.log('Inicializando CrearProformaComponent');
    // console.log('Valor de ID_PERSONA en ProformaDentalComponent:', this.idSeleccionado);
    //----DATOS APRA REGISTRAR--
    this.proformaForm = this.fb.group({
      person_id: [this.idSeleccionado, Validators.required],
      titulo   :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\-_.,;:!¡¿?@#$%&*()+=\s]*')]],
      // detalles: this.fb.array([]) pattern('[0-9]*')]]
    });
  }

  cancelar() {
    this.cancelarFormulario.emit(); // Emite el evento al hacer clic en "Cancelar"
  }
  //--cerrar al registrar y refresca para mosTrar lo regisX4rado en al Vista
  cerrar() {
    this.cerrarFormulario.emit(); // Emite el evento al hacer clic en "Cancelar"
  }
  //----GUARDAR CREACION PROFORMA--
  guardarProforma(){

    if ( this.proformaSeleccionado){
      //console.log("SI HA SELECCION");

    } else{
      //--crear
        //console.log('ENVIANDO DATOS_PROFORMA:!!',this.proformaForm.value);
        //const { name } = this.usurioForm.value;
        //--crear- DenTista con sus roles de tratamiento
        this.proformaService.crearProforma( this.proformaForm.value )
        .subscribe( resp => {
          //console.log('RESP:', resp);
          this.idCrearProforma = resp.id;
          //console.log('ID DE LA NUEVA COTIZACIÓN:', this.idCrearProforma);
          Swal.fire('Creado', ` creado correctamente`, 'success');
          //this.cerrar();
          this.enviarInformacion();
        })
    }
  }
  //------------------------
  enviarInformacion() {
    //const datos = 'Datos a enviar';
    this.enviarDatos.emit(this.idCrearProforma);
    this.cerrar();
  }

}
