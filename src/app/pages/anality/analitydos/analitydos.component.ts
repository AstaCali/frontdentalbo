import { Component, OnInit } from '@angular/core';
import { Tratamiento } from 'src/app/models/tratamientos.modelo';
import { AnalityService } from 'src/app/services/anality.service';
import { TratamientosService } from 'src/app/services/tratamientos.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-analitydos',
  templateUrl: './analitydos.component.html',
  styleUrls: ['./analitydos.component.css']
})
export class AnalitydosComponent implements OnInit {

  public tratamientoArray : Tratamiento[]= [];
  public selectedTreatment : string = '';
  public fechaFinal: string = '';
  public fehcaInicio : string = '';
  public chart: any;
  public dato_lista: any = [];

  constructor(private analityservice : AnalityService, private tratamientosService: TratamientosService){}

  ngOnInit(): void {

    this.listarTratamientos();
    
  }

  cambiarFehaInicio(event: Event){
    const input = event.target as HTMLInputElement;
    //console.log('Fecha_Inicio',input.value);

    if (input && input.value) {
      // Obtener el valor del campo de entrada (formato "yyyy-MM")
      const [year, month] = input.value.split('-');

      // Crear una nueva fecha usando el año, mes y establecer el día seleccionado
      const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(input.value.split('-')[2]));

      // Formatear la fecha en "yyyy-MM-dd"
      const formattedDate = `${year}-${('0' + month).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;

      this.fehcaInicio = formattedDate;
      console.log('Fecha_Inicio:', formattedDate);
      this.cargarAnalityDos();
    }
  }

  cambiarFechaFinal(event: Event){
    const input = event.target as HTMLInputElement;
    //console.log('Fecha_Final',input.value);
    if (input && input.value) {
      // Obtener el valor del campo de entrada (formato "yyyy-MM")
      const [year, month] = input.value.split('-');

      // Crear una nueva fecha usando el año, mes y establecer el día seleccionado
      const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(input.value.split('-')[2]));

      // Formatear la fecha en "yyyy-MM-dd"
      const formattedDate = `${year}-${('0' + month).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;

      this.fechaFinal = formattedDate;
      console.log('Fecha_Final:', formattedDate);
      this.cargarAnalityDos();
    }

  }

  cargarAnalityDos(): void{
    // cargarReportePago( termiperson: string = '', terminotreatment: string = ''): void {
  
    this.analityservice.pythonAnalityDos(this.selectedTreatment, this.fehcaInicio, this.fechaFinal)
      .subscribe(data=>{
        //this.tratamientoArray = data;
        console.log('LLEGA ANALITY_DOS',data);
        this.dato_lista = data.data_list;
        console.log('DATO_LIST_DOS',this.dato_lista);
        this.createChart(data);
      });
  }

  listarTratamientos(){
    this.tratamientosService.cargarTratamientReportPagos()
    .subscribe( data => {
      //console.log('TreamenT: ', data);
      this.tratamientoArray = data;
      console.log('LLEGA Tratamientos',this.tratamientoArray);
    })
  }

  onInputTreatmentdos(event: any): void {
    const inputText = event.target.value;
    const treatment = this.tratamientoArray.find(treatment => treatment.name_treatment === inputText);
    const treatmentInput = treatment ? treatment.name_treatment : '';
    this.selectedTreatment = treatmentInput;
    console.log('TRATAMIENTO_DADO', this.selectedTreatment);
    this.cargarAnalityDos();
    //---this.cargarReportePago('', treatmentInput);
  }
  eliminarTreatmentdos(){
    this.selectedTreatment = '';
    console.log('TRATAMIENTO: ', this.selectedTreatment);
    // Limpiar el campo de búsqueda
    const inputElement = document.getElementById('exampleDataListTratamientodos') as HTMLInputElement;
    if (inputElement) {
      inputElement.value = '';
    }
    this.cargarAnalityDos();
  }

  createChart(data: any) {
    // Si ya existe un gráfico, lo destruimos antes de crear uno nuevo
    if (this.chart) {
      this.chart.destroy();
    }

    // Formatea los datos
    const horas = data.dato.hora;
    const frecuencias = data.dato.Frecuencia;

    // Crea la gráfica de línea
    this.chart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: horas,
        datasets: [
          {
            label: data.Tratamiento,
            data: frecuencias,
            borderColor: 'blue',
            fill: false,
            tension: 0.4 
          }
        ]
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Horas' } },
          y: { title: { display: true, text: 'Frecuencia' } }
        }
      }
    });
  }

}
