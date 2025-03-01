import { Component, OnInit } from '@angular/core';
import { AnalityService } from 'src/app/services/anality.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-analitycuatro',
  templateUrl: './analitycuatro.component.html',
  styleUrls: ['./analitycuatro.component.css']
})
export class AnalitycuatroComponent implements OnInit{

  public fechaFinal: string = '';
  public fehcaInicio : string = '';

  // Variables para almacenar los datos
  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartColors: string[] = ['#FF6384', '#36A2EB', '#FFCE56']; // Colores personalizados para cada sección
  public chart: any;
  public dato_listado : any = [];

  constructor(private analityservice : AnalityService){}

  ngOnInit(): void {
    
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
      this.cargarAnalityCuatro();
    }
  }

  // cambiarFechaFinal(event: Event){
  //   const input = event.target as HTMLInputElement;
  //   //console.log('Fecha_Final',input.value);
  //   if (input && input.value) {
  //     // Obtener el valor del campo de entrada (formato "yyyy-MM")
  //     const [year, month] = input.value.split('-');

  //     // Crear una nueva fecha usando el año, mes y establecer el día seleccionado
  //     const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(input.value.split('-')[2]));

  //     // Formatear la fecha en "yyyy-MM-dd"
  //     const formattedDate = `${year}-${('0' + month).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;

  //     this.fechaFinal = formattedDate;
  //     console.log('Fecha_Final:', formattedDate);
  //     this.cargarAnalityCuatro();
  //   }

  // }

  cargarAnalityCuatro(): void {
    this.analityservice.pythonAnalityCuatro(this.fehcaInicio)
      .subscribe((data) => {
        this.dato_listado = data.dato_list;
        console.log('DATO_LIST', this.dato_listado);
        this.pieChartLabels = data.odontologos;  // Asignar etiquetas
        this.pieChartData = data.frecuencias;     // Asignar datos

        // Crear o actualizar la gráfica
        if (this.chart) {
          this.chart.destroy();  // Destruir la gráfica si ya existe para evitar duplicados
        }
        this.createPieChart();
      }, 
      (error) => {
        console.error('Error al obtener datos', error);
      });
  }

  createPieChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('myPieChart');
    const ctx = canvas ? canvas.getContext('2d') : null;  // Verificar si el contexto existe

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.pieChartLabels,  // Etiquetas para los odontólogos
          datasets: [{
            data: this.pieChartData,   // Datos de las frecuencias
            backgroundColor: this.pieChartColors  // Colores personalizados
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
        // options: {
        //   responsive: true,
        //   plugins: {
        //     legend: {
        //       position: 'top',
        //     },
        //     tooltip: {
        //       enabled: true
        //     }
        //   }
        // }
      });
    } else {
      console.error('Error: No se pudo obtener el contexto del canvas.');
    }
  }
  // loadData(fechaInicio: string): void {
  //   this.dataService.getData(fechaInicio).subscribe(
  //     (data) => {
  //       this.pieChartLabels = data.odontologos;  // Labels para la gráfica
  //       this.pieChartData = data.frecuencias;     // Datos para la gráfica

  //       // Definir colores para cada sección
  //       this.pieChartColors = [
  //         { backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] } // Colores personalizados
  //       ];
  //     },
      // (error) => {
      //   console.error('Error al obtener datos', error);
      // }
  //   );
  // }

}
