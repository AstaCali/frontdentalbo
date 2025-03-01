import { Component, OnInit } from '@angular/core';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { ImpresionService } from 'src/app/services/impresion.service';
import { ReportePagosService } from 'src/app/services/reporte.service';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import { PersonUserService } from 'src/app/services/userperson.service';

@Component({
  selector: 'app-reportepagos',
  templateUrl: './reportepagos.component.html',
  styleUrls: ['./reportepagos.component.css']
})
export class ReportepagosComponent implements OnInit{

  public reportePagosArray : any []= [];

  public currentDate?: Date | undefined;

  public titulo_fecha?: string; 

  //public mes: string = ''; // Variable para almacenar el mes actual
  public mes: number | undefined; // Variable para almacenar el mes actual
   
  //public currentDate: Date = new Date(); // Variable para la fecha actual

  public totalReportePago : number = 0;
  public desde : number = 0;

  public tratamientoArray : Tratamiento[]= [];

  public selectedTreatment : string = '';

  public personArray : any[]= [];

  public selectedPerson : string = '';

  constructor( private reportePagosService : ReportePagosService, 
              private tratamientosService: TratamientosService,
              private  personUserService : PersonUserService,
              private impresionService : ImpresionService
  ){}

  ngOnInit(): void {

    //this.cargarReportePago();
    this.listarTratamientos();
    this.listarPerson();
    this.fechaActual();
    
  }

  // cargarReportePago(desde?: number, todayDate?: Date): void{
  cargarReportePago(): void{
  // cargarReportePago( termiperson: string = '', terminotreatment: string = ''): void {

    this.reportePagosService.reportePago(this.desde, this.currentDate, this.mes, this.selectedPerson, this.selectedTreatment)
    // this.reportePagosService.reportePago(this.desde, this.currentDate, this.mes, termiperson, terminotreatment)
      .subscribe(({ total, reportpagos }) => {
        //console.log(total,reportpagos);
        this.totalReportePago = total;
        this.reportePagosArray = reportpagos;
        this.calcularTotalDiscountedPrice();
      });
  }

  //----*--FECHA DE HOY--*---

  fechaActual() {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const today = new Date();
    this.currentDate = today;
    this.titulo_fecha = today.toLocaleDateString('en-US', options);
    this.mes = undefined;
    //console.log('MES', this.mes);
    this.cargarReportePago();
  }

  actualMes(): void {
    // const today = new Date();
    // const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Obtén el mes actual como número y ajusta el formato a dos dígitos
    //this.mes = month;
    const today = new Date();
    this.mes = today.getMonth() + 1; // Obtén el mes actual (1-12)
    this.currentDate = undefined;
    //console.log('HOY', this.currentDate);
    //console.log('MES', this.mes);
    this.cargarReportePago();
  }


  cambiarPagina( valor : number){
    //console.log('cambia', valor);
    this.desde += valor; 
    if (this.desde < 0){
      this.desde = 0;
    } else if ( this.desde >= this.totalReportePago){
      this.desde -= valor;
    }
    //this.fechaActual();
    this.cargarReportePago();
  }

  //---CALCULAR--
  //-----SUMAR EL TOTAL DE LOS PRECIOS DE LOS TRATAMIENTOS DE CADA PROFORMA--
  totalDiscountedPrice: number = 0;

  //----CALCULARLOS EL TOTAL, EL ACUENTA Y SALDO
  calcularTotalDiscountedPrice() {
    // Calcula la suma de los 'discounted_price' de todos los elementos en 'detallproformas'
    this.totalDiscountedPrice = this.reportePagosArray.reduce((total: any, items: { monto: any; }) => total + items.monto, 0);
    //console.log('ToTal: ', this.totalDiscountedPrice);
    // this.totalMonto = this.detallproform.reduce((total: any, items: { pagocotizacion: { monto: any; }; }) => total + (items.pagocotizacion ? items.pagocotizacion.monto : 0), 0);
    // this.totalSaldo = this.totalDiscountedPrice - this.totalMonto;
  }

  listarTratamientos(){
    this.tratamientosService.cargarTratamientReportPagos()
    .subscribe( data => {
      //console.log('TreamenT: ', data);
      this.tratamientoArray = data;
      //console.log('LLEGA Tratamientos',this.tratamientoArray);
    })
  }
  listarPerson(){
    this.personUserService.cargarPersonReportPagos()
    .subscribe( data => {
      //console.log('person: ', data);
      this.personArray = data;
      // console.log('LLEGA Tratamientos',this.tratamientoArray);
    })
  }


  onInputPerson(event: any): void {
    const inputText = event.target.value;
    const person = this.personArray.find(person => (person.name + ' ' + person.last_name) === inputText);
    const personInput = person ? `${person.name} ${person.last_name}` : '';
    this.selectedPerson = personInput;
    this.cargarReportePago();
    //this.cargarReportePago(this.selectedPerson,'');
    // this.cargarReportePago(personInput, '');
  }

  onInputTreatment(event: any): void {
    const inputText = event.target.value;
    const treatment = this.tratamientoArray.find(treatment => treatment.name_treatment === inputText);
    const treatmentInput = treatment ? treatment.name_treatment : '';
    this.selectedTreatment = treatmentInput;
    this.cargarReportePago();
    //this.cargarReportePago('', treatmentInput);
  }
  // eliminarPerson(){
  //   this.selectedPerson = '';
  //   console.log('Person: ', this.selectedPerson);
  // }
  eliminarPerson() {
    this.selectedPerson = '';
    //console.log('Person: ', this.selectedPerson);
    // Limpiar el campo de búsqueda
    const inputElement = document.getElementById('exampleDataListpersonpag') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }

    // Restablecer los filtros en la vista o cualquier acción adicional que necesites realizar
    // Por ejemplo, podrías actualizar los datos filtrados en tu tabla
    //this.filtrarPersonas('');
    this.cargarReportePago();
  }

  eliminarTreatment(){
    this.selectedTreatment = '';
    //console.log('TRATAMIENTO: ', this.selectedTreatment);
    // Limpiar el campo de búsqueda
    const inputElement = document.getElementById('exampleDataListpagos') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }

    // Restablecer los filtros en la vista o cualquier acción adicional que necesites realizar
    // Por ejemplo, podrías actualizar los datos filtrados en tu tabla
    //this.filtrarPersonas('');
    this.cargarReportePago();
  }

  onImprimir(){
    //console.log('IMPRIMIR');
    const encabezado = ['Paciente', 'Fecha', 'Tratamiento', 'Tipo Pago', 'Precio Final', 'Pagos', 'Saldo']

    const cuerpo = this.reportePagosArray.map((item) => {
      return {
        name: `${item.Quote_detail.Quotation.Person.name} ${item.Quote_detail.Quotation.Person.last_name}`,
        fecha_pago: new Date(item.fecha_pago).toLocaleDateString('es-ES', { month: 'short', year: 'numeric', day: 'numeric' }),
        name_treatment: item.Quote_detail.Treatment.name_treatment,
        tipo_pago: item.tipo_pago,
        discounted_price: item.Quote_detail.discounted_price,
        monto: item.monto
      };
    });

    const titulo = 'Reporte de Pagos';
     //console.log('ENVIA: ', cuerpo);

    this.impresionService.imprimirReportPagos(encabezado, cuerpo, titulo, false);
  }

}
