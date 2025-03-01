import { Component, OnInit } from '@angular/core';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { ImpresionService } from 'src/app/services/impresion.service';
import { ReportePagosService } from 'src/app/services/reporte.service';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import { PersonUserService } from 'src/app/services/userperson.service';

@Component({
  selector: 'app-reportestado',
  templateUrl: './reportestado.component.html',
  styleUrls: ['./reportestado.component.css']
})
export class ReportestadoComponent implements OnInit {

  public reportePagosEstadoArray : any []= [];

  public currentDate?: Date | undefined;

  public titulo_fecha?: string; 

  public mes: number | undefined; // Variable para almacenar el mes actual

  public totalReportePagoEstado : number = 0;
  public desde : number = 0;

  public tratamientoArray : Tratamiento[]= [];

  public selectedPerson : string = '';

  public selectedTreatment : string = '';

  public personArray : any[]= [];

  constructor( private reportePagosService : ReportePagosService,
              private tratamientosService: TratamientosService,
              private  personUserService : PersonUserService,
              private impresionService : ImpresionService
   ){}

  ngOnInit(): void {

    this.listarPerson();
    this.listarTratamientos();
    this.fechaActual();
    
  }

  cargarReportePagoEstado(): void {

    this.reportePagosService.reportePagoEstado(this.desde, this.currentDate, this.mes, this.selectedPerson, this.selectedTreatment)
      .subscribe(({ total, reportestado }) => {
        //console.log(total,reportestado);
        this.totalReportePagoEstado = total;
        this.reportePagosEstadoArray = reportestado;
       
      });
  }

  fechaActual() {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const today = new Date();
    this.currentDate = today;
    this.titulo_fecha = today.toLocaleDateString('en-US', options);
    this.mes = undefined;
    //console.log('MES', this.mes);
    this.cargarReportePagoEstado();
  }

  actualMes(): void {

    const today = new Date();
    this.mes = today.getMonth() + 1; // Obtén el mes actual (1-12)
    this.currentDate = undefined;
    // console.log('HOY', this.currentDate);
    // console.log('MES', this.mes);
    this.cargarReportePagoEstado();
  }

  cambiarPagina( valor : number){
    //console.log('cambia', valor);
    this.desde += valor; 
    if (this.desde < 0){
      this.desde = 0;
    } else if ( this.desde >= this.totalReportePagoEstado){
      this.desde -= valor;
    }
    //this.fechaActual();
    this.cargarReportePagoEstado();
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
    this.cargarReportePagoEstado();
  }

  onInputTreatment(event: any): void {
    const inputText = event.target.value;
    const treatment = this.tratamientoArray.find(treatment => treatment.name_treatment === inputText);
    const treatmentInput = treatment ? treatment.name_treatment : '';
    this.selectedTreatment = treatmentInput;
    this.cargarReportePagoEstado();
    //this.cargarReportePago('', treatmentInput);
  }

  //----IMPRIMIR--
  onImprimir(){
    //console.log('IMPRIMIR');
    const encabezado = ['Fecha Cambio de estado', 'Medico Comicionista', 'Paciente', 'Tratamiento', 'Precio Total', 'Saldo', 'Estado']

    const cuerpo = this.reportePagosEstadoArray.map((item) => {
      return {
        fecha_pago: new Date(item.fecha_pago).toLocaleDateString('es-ES', { month: 'short', year: 'numeric', day: 'numeric' }),
        medico_comicionista:'',
        name: `${item.Quote_detail.Quotation.Person.name} ${item.Quote_detail.Quotation.Person.last_name}`,
        name_treatment: item.Quote_detail.Treatment.name_treatment,
        discounted_price: item.Quote_detail.discounted_price,
        saldo:0,
        tipo_pago: item.tipo_pago,
        //monto: item.monto
      };
    });

    const titulo = 'Reporte de Pagos Estdos';
    //console.log('ENVIA: ', cuerpo);

    this.impresionService.imprimirReportEstado(encabezado, cuerpo, titulo, false);
  }

}
