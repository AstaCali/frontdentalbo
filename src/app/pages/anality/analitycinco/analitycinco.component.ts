import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AnalityService } from 'src/app/services/anality.service';

@Component({
  selector: 'app-analitycinco',
  templateUrl: './analitycinco.component.html',
  styleUrls: ['./analitycinco.component.css']
})
export class AnalitycincoComponent implements OnInit{

  public fechaFinal: string = '';
  public fehcaInicio : string = '';
  public pieChart: any;
  public etiquetas: string[] = [];
  public frecuencias: number[] = [];

  constructor(private analityservice : AnalityService){}

  ngOnInit(): void {
    
  }

  cargarAnalityCinco(){
    
    this.analityservice.pythonAnalityCinco(this.fehcaInicio, this.fechaFinal).subscribe(data =>{
      if (data.ok) {
        this.etiquetas = data.etiquetas;
        this.frecuencias = data.frecuencias;
        // Crear o actualizar la gráfica
        if (this.pieChart) {
          this.pieChart.destroy();  // Destruir la gráfica si ya existe para evitar duplicados
        }
        this.crearGrafico();
      }
    });
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
      this.cargarAnalityCinco();
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
      this.cargarAnalityCinco();
    }

  }

  crearGrafico() {
    this.pieChart = new Chart('myPieChart', {
      type: 'pie',
      data: {
        labels: this.etiquetas,
        datasets: [{
          data: this.frecuencias,
          // backgroundColor: ['#FF6384', '#36A2EB'], // Colores para las secciones
          backgroundColor: ['#36A2EB','#FF6384'], // Colores para las secciones
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

}
