import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalleProforma } from 'src/app/models/detalleproforma.model';
import { Persona } from 'src/app/models/persona.modelo';
import { Proforma } from 'src/app/models/proforma.model';
import { BuscadorService } from 'src/app/services/buscador.service';
import { ImpresionService } from 'src/app/services/impresion.service';
import { PagoCotizacionService } from 'src/app/services/pagoscotizacio.service';
import { ModalProformaService } from 'src/app/services/proforma-modal.service';
import { ProformaService } from 'src/app/services/proforma.service';
import { ProformaDetalleService } from 'src/app/services/proformadetalle.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proformadental',
  templateUrl: './proformadental.component.html',
  styleUrls: ['./proformadental.component.css']
})
// export class ProformadentalComponent {

// }
export class ProformadentalComponent implements OnInit {
  //lastSelectedIndex: number = -1;
  perfil: any; //--NO ES UN ARRAY
  //public perfil: Persona[] = [];
  personaID = 0;
  // public items : any = [];
   public items : any = [];
  itemsToShow: { id: number; person_id: number; users_id: number; titulo: string; total: number; }[] = [];
  startIndex = 0;
  selected = -1;
  selectedPos = 0;//--PARA QUE SE MANTENGA
  selectedItemTitulo: string = '';
  selectedItemFecha: string = '';
  selectedIDcotizacion: number = 0;
  // public detallproform: DetalleProforma[] = [];
  public detallproform: any = [];
  abrilModalcrear: boolean = false;
  abrilModalcrearDetall: boolean = false;
  selectedIDcotizacionDetalle: number = 0;
  //perfi: Persona = new Persona();
  idCrearProforma: number = 0;
  //----para pagos---
  abrilModalPagos: boolean = false;
  //idPagoMostrar: number = 0;
  selectedIDPagoMosTrar:number = 0;//--alamaceno el id
  selectedIDPagoPut:number = 0;//--alamaceno el id del Pago
  //public objDatoPagos: any;// enViar el 
  public idroleName : string ='';//--para usar en desbiliTar funciones al pacienTe

  constructor( private activatedRoute : ActivatedRoute,
               private busquedaService : BuscadorService,
               private proformaService : ProformaService,
               private cdr: ChangeDetectorRef,
               private modalProformaService: ModalProformaService,
               private proformaDetalleService: ProformaDetalleService,
               private impresionService : ImpresionService,
               private pagoCotizacionService : PagoCotizacionService,
               private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    
    this.idroleName = this.usuarioService.usuario.role.name;
    const idPersonados = this.usuarioService.usuario.person.id; // Método para obtener el ID de la persona, si es necesario
    //console.log('role Y idperson', this.idroleName, idPersonados);
    if (this.idroleName === 'PACIENTE') {
      this.busquedaGlobales(idPersonados);
      //console.log('ENTRA_PARA_PACIENTE');
    } else {
      this.activatedRoute.params.subscribe(({ termino }) => {
        this.busquedaGlobales(termino);
      });
    }
  }

  busquedaGlobales( termino: number){

    //console.log("ID--:",termino)
    //AUMENTE PARA QUE CUANDO BUSQUE INICIALISE DE 0,
    this.selectedPos=0;
    this.proformaService.obtenerDatoPersona(termino)
      .subscribe( resp =>{
        this.perfil = resp;
        //console.log("LLEGAS ESTOS DATOS AL BUSCAR",this.perfil);
        this.personaID = resp.id;
        //console.log("LLEGAS ESTOS DATOS AL BUSCAR DEL ID_PERSONA",this.personaID);
        this.cargarProformaPersonas(this.personaID);
      });
  }
  //----CARGAR CUANTAS COTIZACIONES TIENE CADA PERSONA ---
  cargarProformaPersonas(personaID : number){
    //console.log("cargarProformaPersonas personaID--:",personaID)
    this.proformaService.obtenerCotizacionDePersona(personaID)
    .subscribe( resp =>{
      //console.log('llega', resp);
      this.items = resp;
      //console.log("Tiene personaID2 ESTA CANtIDAD--:",this.items)
      this.showItems();
      this.handleClick(this.selected);
    },
    error=>{
      console.log(error);
      //this.router.navigateByUrl(`/dashboard/tratamientos`);
      //Swal.fire('Usuario no actualizado',error.error.msg)
    }
  );
  }
  //----LISTAR DE UNA COTIZACION CUANTOS TRATAMIENTOS TIENE---
  cargarDetalleProformaPersona(cotizacionID : number){
    //console.log("#-DETALLE DE COTIZACION_ID-#:",cotizacionID)
    this.proformaService.obtenerDetalleCotizacion(cotizacionID)
    .subscribe( resp =>{
      this.detallproform = resp;
      //console.log("cargarDetalleProformaPersona personaID--:",this.detallproform);
      this.calcularTotalDiscountedPrice();
      // console.log('#LLEGA_DATELLE:', resp);
    },
    error=>{
      //console.log(error);
      //this.router.navigateByUrl(`/dashboard/tratamientos`);
      Swal.fire('No Tiene ninguna Proforma',error.error.msg)
    }
  );
  }
  //-----SUMAR EL TOTAL DE LOS PRECIOS DE LOS TRATAMIENTOS DE CADA PROFORMA--
  totalDiscountedPrice: number = 0;
  // Suponiendo que 'detallproformas' es la lista de elementos que estás mostrando en tu listado
  totalMonto: number = 0;
  totalSaldo: number = 0;

  //----CALCULARLOS EL TOTAL, EL ACUENTA Y SALDO
  calcularTotalDiscountedPrice() {
    this.totalDiscountedPrice = this.detallproform.reduce((total: number, item: { discounted_price?: number }) => 
      total + (item.discounted_price || 0), 0
    );
    this.totalMonto = this.detallproform.reduce(
      (total: number, item: { pagocotizacion?: { monto: number }[] }) => 
      total + (item.pagocotizacion?.reduce(
          (sum: number, pago: { monto: number }) => sum + (pago.monto || 0), 0
      ) || 0), 0
    );

    this.totalSaldo = this.totalDiscountedPrice - this.totalMonto;
  }
  //---listado de cotizacion--

  showItems() {
    //console.log('Showing items from', this.startIndex, 'to', this.startIndex + 3);
    const endIndex = Math.min(this.startIndex + 3, this.items.length);
    const tempItemsToShow = this.items.slice(this.startIndex, endIndex);
    this.itemsToShow = [...tempItemsToShow];

    // //---------AQUI PARA MANTENER EN LA SELECCION QUE ESTE EL ID_COTIZACION---
    //-----------------HASTA AQUI----------------

    // Inicializamos selected después de asignar itemsToShow
    //this.selected = 0;
    if (this.idCrearProforma !== 0) {
      this.selectedPos = this.items.findIndex((item: Proforma) => item.id === this.idCrearProforma);
      //console.log(`El id ${this.idCrearProforma} se encuentra en la posición ${this.selectedPos} del array.`);
    //if (this.idCrearProforma !== 0 && this.items.some((item: Proforma) => item.id === this.idCrearProforma)) {
      //console.log(`El id ${cotizacionGetBy} se encuentra en la posición ${selectedPos} del array.`);
      this.selected = this.selectedPos;
      //console.log('ENTRO_CON_EL ID_REGISTRADO',this.selected);
      this.idCrearProforma =0;
      //this.cdr.detectChanges(); // Forzar la actualización de la vista
    } else {
      //console.log(`El id ${cotizacionGetBy} no se encuentra en el array.`);
      this.selected = this.selectedPos;
      //this.cdr.detectChanges(); // Forzar la actualización de la vista
    }
    // this.selected = this.selectedPos;

    this.cdr.detectChanges(); // Forzar la actualización de la vista
  }

  previous() {
    // this.startIndex -= 3;
    // this.showItems();
    //console.log("Previous clicked");
    if (this.startIndex - 3 >= 0) {
      this.startIndex -= 3;
      //console.log("New startIndex:", this.startIndex);
      this.showItems();
    }
  }

  next() {
    //console.log("Next clicked");
    if (this.startIndex + 3 < this.items.length) {
      this.startIndex += 3;
      //console.log("New startIndex:", this.startIndex);
      this.showItems();
      this.selected = -1; // Reiniciar selected cuando se cambia de página
    }
  }
  //-----
  // selected = -1;
  // selectedItemName: string = '';
  handleClick(index: number) {
    // Puedes hacer lo que necesites con el objeto seleccionado aquí
    this.selected = index;
    //this.lastSelectedIndex = index;
    //console.log('%MUESTRA_1:%', this.selected);
    const selectedItem = this.items[index];
    this.selectedItemTitulo = selectedItem?.titulo; 
    this.selectedItemFecha = selectedItem?.fecha; 
    //this.selectedIDcotizacion = selectedItem?.id; 
    this.selectedIDcotizacion = selectedItem?.id ?? 0;
    // console.log("QUE MUES◘4RAAQUI",selectedItem);
    // console.log('IDCOtIZACION', this.selectedIDcotizacion);
    //---------AQUI PARA MANTENER EN LA SELECCION QUE ESTE EL ID_COTIZACION---
    // const selectedPos = this.items.findIndex((item: Proforma) => item.id === this.selectedIDcotizacion);
    this.selectedPos = this.items.findIndex((item: Proforma) => item.id === this.selectedIDcotizacion);
    //console.log(`El id ${this.selectedIDcotizacion} se encuentra en la posición ${this.selectedPos} del array.`);
    //----------------------
    //this.idCrearProforma=0;
    this.cargarDetalleProformaPersona(this.selectedIDcotizacion);
  }
  //------------#-MODAL DE CREAR TiTULO DE PROFORMA--#
  abrirModal(){
    //console.log("ABRIO_MODAL_SIUU");
    // this.modalProformaService.abrirModal();
    this.abrilModalcrear = true;
  }
  cancelarFormulario() {
    this.abrilModalcrear = false; // Cierra el formulario sin guardar
    //this.busquedaGlobales(t);
    //this.citaId = undefined;
  }
  cerrarFormulario() {
    this.abrilModalcrear = false; // Cierra el formulario sin guardar
    //this.cargarProformaPersonas(this.personaID);
    this.activatedRoute.params
      .subscribe( ({termino}) => this.busquedaGlobales( termino ));
  }
  //---------#-MODAL DE CREARDETALLE OSEA AÑADIR TRATAMIENTOS A LA PROFORMA--
  abrirModalDetalle(){
    //console.log("ABRIO_MODAL_DETALLE_SIUU");
    // this.modalProformaService.abrirModal();
    this.abrilModalcrearDetall = true;
  }
  cancelarFormularioDetall() {
    this.abrilModalcrearDetall = false; // Cierra el formulario sin guardar
    this.selectedIDcotizacionDetalle =0;
    //this.busquedaGlobales(t);
    //this.citaId = undefined;
  }
  cerrarFormularioDetall() {
    this.abrilModalcrearDetall = false; // Cierra el formulario sin guardar
    this.cargarProformaPersonas(this.personaID);
    // this.activatedRoute.params
    //   .subscribe( ({termino}) => this.busquedaGlobales( termino ));
  }
  editarDetalle(idDetallProfor : number){

    //console.log('ID_PARA EDItAR_LLEGA',idDetallProfor);
    this.selectedIDcotizacionDetalle = idDetallProfor
    this.abrilModalcrearDetall = true;

  }
  //--------DATO DEL ID DEL CREAR PROFORMA--
  manejarDatosRecibidos(datos: number) {
    //console.log("#-Datos recibidos-#:", datos);
    // Haz algo con los datos recibidos
    this.idCrearProforma = datos;
  }
  //---------BORRAR DETALLE COTIZACION--
  // borrarDetalleCotizacion( detalleProforma : DetalleProforma){ detallproformas.name_treatment
  borrarDetalleCotizacion( detalleProforma : any){

    Swal.fire({
      title: '¿Borrar Tratamiento de Cotizacion?',
      text: `Esta a punto de borrar a ${ detalleProforma.name_treatment }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        //this.medicoService.borrarMedico( medico._id )
        this.proformaDetalleService.deleteDetalleCotizacion( detalleProforma.id )
          .subscribe( resp => {
            
            //this.cargarUsuarios();
            Swal.fire(
              'Tratamiento de Cotizacion borrado',
              `${ detalleProforma.name_treatment} fue eliminado correctamente`,
              'success'
            );
            this.cargarProformaPersonas(this.personaID);
            
          },
          error=>{
            //console.log('EL MSJ',error);
            //this.router.navigateByUrl(`/dashboard/usuario`);
            Swal.fire('Tratamiento de Cotizacion no actualizado',error.error.msg)
          }
        );

      }
    })

  }

  //---------#-MODAL DE CREARDETALLE OSEA AÑADIR TRATAMIENTOS A LA PROFORMA--
  abrirModalPago(idPagoMosTrar : number){
    //console.log("ABRIO_MODAL_Pago_SIUU");
    // this.modalProformaService.abrirModal();
    //console.log('ID_PARA_MosTar el name y precio',idPagoMosTrar);
    this.selectedIDPagoMosTrar = idPagoMosTrar
    this.abrilModalPagos = true;

  }
  cancelarPago() {
    this.abrilModalPagos = false; // Cierra el formulario sin guardar
    this.selectedIDPagoMosTrar = 0;
    this.selectedIDPagoPut = 0;
    //this.busquedaGlobales(t);
    //this.citaId = undefined;
  }
  cerrarPago() {
    this.abrilModalPagos = false; // Cierra el formulario sin guardar
    this.cargarProformaPersonas(this.personaID);
    this.selectedIDPagoMosTrar = 0;
    this.selectedIDPagoPut = 0;
    // this.activatedRoute.params
    //   .subscribe( ({termino}) => this.busquedaGlobales( termino ));
  }
  editarPago(idPago : number){

    //console.log('ID_PARA EDItAR_Pago_LLEGA',idPago);
    this.selectedIDPagoPut = idPago;
    this.abrilModalPagos = true;

  }
  //---*--BORRAR_PAGO-*--
  deletePago( pago : any){
    //console.log('DATO_PARA_BORRAR', pago);
    Swal.fire({
      title: '¿Borrar Pago Cotizacion?',
      text: `Esta a punto de borrar`,
      // text: `Esta a punto de borrar a ${ pago. }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.value) {
        
        //this.medicoService.borrarMedico( medico._id )
        this.pagoCotizacionService.deletePago( pago.id )
          .subscribe( resp => {
            
            //this.cargarUsuarios();
            Swal.fire(
              'Tratamiento de Cotizacion borrado',
              // `${ detalleProforma.name_treatment} fue eliminado correctamente`,
              `fue eliminado correctamente`,
              'success'
            );
            this.cargarProformaPersonas(this.personaID);
            
          },
          error=>{
            //console.log('EL MSJ',error);
            //this.router.navigateByUrl(`/dashboard/usuario`);
            Swal.fire('Pago Cotizacion no Eliminado',error.error.msg)
          }
        );

      }
    })

  }

  //---------IMPRIMIR REPORTE DE PROFORMA----
  onImprimir(){

    const encabezado = ["Tratamiento", "Diente" ,"Precio Total (Bs)", "Fecha"];
    // Formatear los datos para incluir solo los campos necesarios en el orden deseado
    const cuerpo = this.detallproform.map((item: { name_treatment: any; discounted_price: any; fecha: any; diente: number }) => [
      item.name_treatment,
      item.diente,
      item.discounted_price,
      new Date(item.fecha).toLocaleDateString('es-ES', { month: 'short', year: 'numeric',day: 'numeric' }),
      //item.estato
    ]);
  
    //console.log("DATO PARA IMPRIMIR", cuerpo);
    // const cuerpo = ["PROFILAXIS -SARRO-FLUORIZACION", "100", "abr. 04, 2024"];

    // Datos del paciente
    const paciente = {
      // nombre: "OLGA CALLISAYA QUISPE",
      // edad: "18 Años",
      // fecha: "May. 07, 2024",
      // fechaNacimiento: "Enero 28, 2006" `Fecha de Nac.: ${paciente.fechaNacimiento}`
      //nombre: this.perfil.name,
      nombre:`${this.perfil.name} ${this.perfil.last_name}`,
      edad: " ",
      fecha: " ",
      fechaNacimiento: " ",
      tratamiento: this.selectedItemTitulo
    };

    const total = this.totalDiscountedPrice; // Calcula el total
    const saldo = this.totalSaldo; // Ajusta según sea necesario

    this.impresionService.imprimir(encabezado, cuerpo, paciente, total ,saldo ,false);
    // this.impresionService.imprimir(encabezado, cuerpo, "LisTado de proforma", paciente, total ,saldo ,true);
  }
}
