import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PagoCotizacionService } from 'src/app/services/pagoscotizacio.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pagosdetalleprofrm',
  templateUrl: './pagosdetalleprofrm.component.html',
  styleUrls: ['./pagosdetalleprofrm.component.css']
})
export class PagosdetalleprofrmComponent implements OnInit {

  @Output() cancelarPago = new EventEmitter<void>();
  @Output() cerrarPago = new EventEmitter<void>();
  // @Input() selectedIDPagoMosTrar: number | undefined;
  public pagoSeleccionado : any; //--PARA ALMACENAR LO RECUPERADO PARA LUEGO USAR EN GUARDAR
  @Input() selectedIDPagoMosTrar: number = 0;
  @Input() selectedIDPagoPut: number = 0;
  public NameTratament : string = '';
  public PriceTratament : string = '';
  public pagosForm : any;
  public titulo : string = '';

  constructor(private pagoCotizacionService: PagoCotizacionService,
              private fb : FormBuilder,
  ){}

  ngOnInit(): void {

    console.log('Valor de selectedIDPagoMosTrar:', this.selectedIDPagoMosTrar);
    console.log('Valor de selectedIDPagoPut:', this.selectedIDPagoPut);
    // this.listarTratamientos();
    // this.listarDientes();
    if (this.selectedIDPagoMosTrar !== 0) {
      this.cargarNamePrice(this.selectedIDPagoMosTrar);
    }
    this.cargarPago(this.selectedIDPagoPut);
    // else{
    //   this.cargarPago(this.selectedIDPagoPut);
    // }
    this.pagosForm = this.fb.group({
      monto: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo_pago: ['Efectivo', Validators.required],
      fecha_pago: ['', Validators.required],
    });
    
  }

  //---para caragr el nombre y precio en la Vista del formulario de REGISTRO--*--
  cargarNamePrice(idNamePrice : number){

    console.log('idNamePrice: ', idNamePrice);
    this.pagoCotizacionService.obtenerNamePrecioDetalleCotizacion( idNamePrice)

    .subscribe(datos => {
      if (Array.isArray(datos)) {
        console.log('datos es un array. Primer elemento:', datos[0]);
        this.NameTratament = datos[0].name_treatment;
        this.PriceTratament = datos[0].discounted_price;
      }
      // if (Array.isArray(datos)) {
      //   // Si datos es un array, verifica la estructura de sus elementos
      //   console.log('datos es un array. Primer elemento:', datos[0]);
      //   if (datos.length > 0 && datos[0].name_treatment) {
      //     this.NameTratament = datos[0].name_treatment;
      //     console.log('name:', this.NameTratament);
      //   } else {
      //     console.error('El primer elemento del array datos no tiene la propiedad name_treatment.');
      //   }
      // } else if (datos && datos.name_treatment) {
      //   // Si datos es un objeto
      //   this.NameTratament = datos.name_treatment;
      //   console.log('name:', this.NameTratament);
      // } else {
      //   console.error('El objeto datos no tiene la propiedad name_treatment o es undefined.');
      //   console.log('datos:', datos);  // Añade este log para ver el objeto completo
      // }
    }, error => {
      console.error('Error al recuperar los datos:', error);
    });

  }
  //-----RECUPERAR DATO DE PAGO_TRATAMIENTO PARA EDITAR--
  cargarPago(id : number){
    console.log('ANTES_DEL_NUEVO',id);
    if ( id === 0 ) {
      console.log('ENTRA PAARA REGISTRAR_NO_RECUPERARDATO');
      this.titulo= 'Adicionar Pago';
      return;
    }
    console.log('CARGARA PARA EDITAR');
    this.titulo= 'Editar Pago';
    this.pagoCotizacionService.obtenerPagos( id )
      .subscribe( datos => {

        console.log('DATO RECUPERADO_EDITAR', datos);
        //     // const { email, password,role: {id}} = datouser;
        //     // console.log('DATO ESPECIFICO', email, password,id);
        this.pagoSeleccionado = datos;
        console.log('SE CARGO A: pagoSeleccionado', this.pagoSeleccionado);

        // Verificar la estructura de datos
        // console.log('Datos.monto:', datos.monto);
        // console.log('Datos.descripcion:', datos.descripcion);
        // console.log('Datos.fecha_pago:', datos.fecha_pago);
        this.NameTratament = datos.name_treatment;
        this.PriceTratament = datos.price;

        this.pagosForm.patchValue({ 
          //---quotitation_id : no le recupero porque siempre esta cargado con el id quotation_id: [this.selectedIDcotizacion, Validators.required],
          //id: datos.id,
          monto: datos.monto,
          descripcion: datos.descripcion,
          fecha_pago: datos.fecha_pago,
        });
      },
      error=>{
        console.log(error);
        // this.router.navigateByUrl(`/dashboard/usuario`);
        // //Swal.fire('Usuario no actualizado',error.error.msg)
      }
      );
  }
  //----GUARDAR CREACION PROFORMA--
  guardarPago(){

    if ( this.pagoSeleccionado){
    //if (this.proformaDetallSeleccionado && this.proformaDetallSeleccionado.length > 0) {
      //console.log("GUARDAR LO EDITADO_PORQUE ENTRO",this.pagoSeleccionado);
      //--acTualizar
      const data = {
        ...this.pagosForm.value,
        id: this.pagoSeleccionado.id // se lo agrega el ida para enTiar con el id de deTalle cotizacion
      }
      //console.log("#...this.pagosForm.value_#PARA YA REGISTRAR",data);
      //this.cerrar();
      this.pagoCotizacionService.putPago( data )
        .subscribe( (resp: any) =>{
          //console.log('SE ACTUALIZO pagosForm: ',resp)
          // Swal.fire('Actualizando',`${ name } actualizado correctamente`, 'success' );
          Swal.fire('Actualizando',`actualizado correctamente`, 'success' );
          this.cerrar();
        })

    } else{
      //console.log('ENVIANDO DATOS_Pagos:!!',this.pagosForm.value, this.selectedIDPagoMosTrar);
      //--crear
          // if (this.selectedIDPagoMosTrar !== undefined) {
      this.pagoCotizacionService.crearPagos(this.pagosForm.value, this.selectedIDPagoMosTrar)
        .subscribe(resp => {
          //console.log('RESP:', resp);
          Swal.fire('Creado', 'Creado correctamente', 'success');
          this.cerrar();
        });
    }
  }

  cancelar() {
    this.cancelarPago.emit(); // Emite el evento al hacer clic en "Cancelar"
  }
  //--cerrar al registrar y refresca para mosTrar lo regisX4rado en al Vista
  cerrar() {
    this.cerrarPago.emit(); // Emite el evento al hacer clic en "Cancelar"
  }

}
