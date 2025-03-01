import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DetalleProforma } from 'src/app/models/detalleproforma.model';
import { Diente } from 'src/app/models/diente.model';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { ProformaDetalleService } from 'src/app/services/proformadetalle.service';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creardetalleproforma',
  templateUrl: './creardetalleproforma.component.html',
  styleUrls: ['./creardetalleproforma.component.css']
})
export class CreardetalleproformaComponent implements OnInit {

  @Output() cancelarFormularioDetall = new EventEmitter<void>();
  @Output() cerrarFormularioDetall = new EventEmitter<void>();
  @Input() selectedIDcotizacion: number | undefined;
  @Input() selectedIDcotizacionDetalle: number | undefined; //---ID PARA EDITAR

  public tratamientos : Tratamiento[] = [];
  public dientes : Diente[] = [];

  keyword = 'name_treatment';
  keywords = 'number_tooth';

  public proformaDetallForm : any;//--al macena el formulario para registrar
  //public proformaDetallSeleccionado : DetalleProforma[] =[];//--se usapara el editar lo que se recpera se almacena ai.
  public proformaDetallSeleccionado : any;
  //public usuarioSeleccionado: any;
  //----ALMACENAR PARA RECUPERAR PARA MOSTRAR--
  selectedTreatmentName: string = '';
  //proformaDetallSeleccionado: any;
  @ViewChild('autocompleteInput', { static: true }) autocompleteInput: any;
  @ViewChild('dienteAutocompleteInput', { static: true }) dienteAutocompleteInput: any;
  selectedDienteName: string = '';

  constructor( public tratamientosService : TratamientosService,
              private fb : FormBuilder,
              private proformaDetalleService: ProformaDetalleService
  ){}

  ngOnInit(): void {
    //console.log('Valor de ID_COTIZACION en ProformaDentalComponent:', this.selectedIDcotizacion);
    //console.log('Valor de ID_COTIZACION_Detalle en selectedIDcotizacionDetalle:', this.selectedIDcotizacionDetalle);
    this.listarTratamientos();
    this.listarDientes();
    if (this.selectedIDcotizacionDetalle !== undefined) {
      this.cargarProformaDetall(this.selectedIDcotizacionDetalle);
    }

    this.proformaDetallForm = this.fb.group({
      quotation_id: [this.selectedIDcotizacion, Validators.required],
      treatment_id: ['', Validators.required],
      diente_id: ['', Validators.required],
      discounted_price: ['', Validators.required],
      price_without_discount: ['', Validators.required],
      // titulo   :['', [Validators.required, Validators.pattern('[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\-_.,;:!¡¿?@#$%&*()+=\s]*')]],
      // detalles: this.fb.array([]) pattern('[0-9]*')]]
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
  listarDientes(){
    this.tratamientosService.cargarDientes()
    .subscribe( data => {
      this.dientes = data;
      //console.log('LLEGA DIENTE',this.dientes);
      //this.usuariosTemp = usuarios;
      //this.cargando = false;
    })
  }
  //------lo selccionado del lisTado del buscador--
  selectEvent(item : any) {
    console.log("SELECCIONO#:",item);
    // do something with selected item
     // Actualizar el valor del campo de entrada de precio en el formulario
     //this.selectedTreatmentName = item.name_treatment;//---USAR EN CASO QUE SALGA ERROR--PARA MOSTRAR LO RECUPERADO
     this.proformaDetallForm.patchValue({
      treatment_id: item.id,
      discounted_price: item.price,
      price_without_discount: item.discount
    });
  }
  selectDienteEvent(items : any) {
    //console.log("SELECCIONO_DIENTE#:",items);
    // do something with selected item
     // Actualizar el valor del campo de entrada de precio en el formulario
     this.proformaDetallForm.patchValue({
      //discounted_price: item.price,
      diente_id: items.id
    });
  }
  cancelar() {
    this.cancelarFormularioDetall.emit(); // Emite el evento al hacer clic en "Cancelar"
    // this.selectedIDcotizacionDetalle =0;
  }
  //--cerrar al registrar y refresca para mosTrar lo regisX4rado en al Vista
  cerrar() {
    this.cerrarFormularioDetall.emit(); // Emite el evento al hacer clic en "Cancelar"
  }
    //----GUARDAR CREACION PROFORMA--
  guardarProformaDetall(){

    if ( this.proformaDetallSeleccionado){
    //if (this.proformaDetallSeleccionado && this.proformaDetallSeleccionado.length > 0) {
      //console.log("GUARDANDO DE LA EDITACION_PORQUE ENTRO",this.proformaDetallSeleccionado);
      //--acTualizar
      const data = {
        ...this.proformaDetallForm.value,
        id: this.proformaDetallSeleccionado.id // se lo agrega el ida para enTiar con el id de deTalle cotizacion
      }
      //console.log("#...this.proformaDetallForm.value_#PARA YA REGISTRAR",data);
     //this.cerrar();
      this.proformaDetalleService.putDetalleCotizacion( data )
      .subscribe( resp =>{
        //console.log('SE ACTUALIZO proformaDetallForm: ',resp)
        // Swal.fire('Actualizando',`${ name } actualizado correctamente`, 'success' );
        Swal.fire('Actualizando',`actualizado correctamente`, 'success' );
        this.cerrar();
      })

    } else{
      //--crear
        //console.log('ENVIANDO DATOS_PROFORMA:!!',this.proformaDetallForm.value);
        //const { name } = this.usurioForm.value;
        // //--crear- DenTista con sus roles de tratamiento
        this.proformaDetalleService.crearProformaDetall( this.proformaDetallForm.value )
        .subscribe( resp => {
          //console.log('RESP:', resp);
          Swal.fire('Creado', ` creado correctamente`, 'success');
          this.cerrar();
          //this.router.navigateByUrl(`/dashboard/odontologos`)
        })
    }
  }
  //-----CARGAR DETALLE_TRATAMIENTO PARA RECUPERAR_DATOS--
  cargarProformaDetall(id : number){
    //console.log('ANTES_DEL_NUEVO',id);
    if ( id === 0 ) {
      //console.log('ENTRA PAARA REGISTRAR_NO_RECUPERARDATO');
      return;
    }
    //console.log('CARGARA PARA EDITAR');
    this.proformaDetalleService.obtenerDetalleTratament(Number (id) )
    .subscribe( datos => {
      //console.log('DATO DESPUES DEL IF_RECUPERAR#', datos);
        // if ( !datouser ) {
        //   //console.log('DATO EN EL IF!', datouser);
        //   this.router.navigateByUrl(`/dashboard/usuario`);
        //   return;
        // }

      //console.log('DATO RECUPERADO', datos);
        // const { email, password,role: {id}} = datouser;
        // console.log('DATO ESPECIFICO', email, password,id);
      this.proformaDetallSeleccionado = datos;
      //console.log('SE CARGO A: proformaDetallSeleccionado', this.proformaDetallSeleccionado);
      // Asigna el tratamiento seleccionado
      const selectedTreatment = this.tratamientos.find(t => t.id === this.proformaDetallSeleccionado.treatment_id);
      // Asigna el diente seleccionado
      const selectedDiente = this.dientes.find(d => d.id === this.proformaDetallSeleccionado.diente_id);
      if (selectedTreatment && selectedDiente) {
        this.selectedTreatmentName = selectedTreatment.name_treatment;
        this.selectedDienteName = selectedDiente.number_tooth;
        this.proformaDetallForm.patchValue({ 
          //---quotitation_id : no le recupero porque siempre esta cargado con el id quotation_id: [this.selectedIDcotizacion, Validators.required],
          treatment_id: selectedTreatment.id,
          diente_id: selectedDiente.id,
          discounted_price: datos.discounted_price,
          price_without_discount: datos.price_without_discount,
        });
        // Actualiza el valor del campo de entrada de ng-autocomplete
        this.autocompleteInput.query = this.selectedTreatmentName;
        this.dienteAutocompleteInput.query = this.selectedDienteName;
      }
    },
    error=>{
      //console.log(error);
      // this.router.navigateByUrl(`/dashboard/usuario`);
      Swal.fire('Usuario no actualizado',error.error.msg)
    }
    );
  }
}
