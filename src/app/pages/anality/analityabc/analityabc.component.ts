// import { Component, OnInit } from '@angular/core';
// import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
// import { AnalityService } from 'src/app/services/anality.service';

// interface BubbleData {
//   x: number;
//   y: number;
//   r: number;
//   backgroundColor: string;
// }

// @Component({
//   selector: 'app-analityabc',
//   templateUrl: './analityabc.component.html',
//   styleUrls: ['./analityabc.component.css']
// })
// export class AnalityabcComponent implements OnInit {
//   public bubbleChartOptions: ChartConfiguration['options'] = {
//     scales: {
//       x: {
//         ticks: {
//           callback: (tickValue: string | number) => {
//             if (typeof tickValue === 'number') {
//               return this.tratamientos[tickValue]; // Mapear el índice al nombre del tratamiento
//             }
//             return ''; // Devolver vacío si no es un número
//           }
//         },
//       },
//       y: {
//         min: 0,
//         max: 100,
//         ticks: {
//           callback: (tickValue: string | number) => {
//             if (typeof tickValue === 'number') {
//               return `${tickValue}%`;  // Mostrar valor en porcentaje
//             }
//             return ''; // Si no es número, retornar vacío
//           }
//         },
//       },
//     },
    
//   };

//   public bubbleChartType: ChartType = 'bubble';
//   public bubbleChartLegend = true;
//   public tratamientos: string[] = []; // Array para almacenar nombres de tratamientos
//   public bubbleChartData: ChartData<'bubble'> = {
//     labels: [],  // Las etiquetas del eje X
//     datasets: [{
//       label: 'Tratamientos',
//       data: [],  // Datos llenos dinámicamente
//       backgroundColor: [],
//       borderColor: 'rgba(0,0,0,0.1)',
//       hoverBackgroundColor: 'rgba(0,0,0,0.3)',
//       hoverBorderColor: 'rgba(0,0,0,0.2)'
//     }]
//   };

//   constructor(private analityservice: AnalityService) {}

//   ngOnInit(): void {
//     this.fetchData();
//   }

//   fetchData(): void {
//     this.analityservice.cargarABC().subscribe((data: any) => {
//       console.log('ANALITY_ABC', data);
//       const tratamientos = data.Tratamientos;
//       const porcentajes = data['Porcentaje Acumulado'];
//       const frecuencias = data.Frecuencias;
//       const clasificaciones = data['Clasificación ABC'];

//       // Colores según clasificación ABC
//       const coloresABC = {
//         'A': 'blue',
//         'B': 'green',
//         'C': 'red'
//       };

//       // Crear dataset para el gráfico de burbujas
//       const dataset: BubbleData[] = tratamientos.map((tratamiento: string, index: number) => ({
//         x: index,  // Usamos el índice como posición en el eje X
//         y: porcentajes[index],  // Porcentaje acumulado en el eje Y
//         r: frecuencias[index] * 5,  // Tamaño de la burbuja
//         backgroundColor: coloresABC[clasificaciones[index] as keyof typeof coloresABC]  // Color según clasificación
//       }));

//       // Asignar los nombres de los tratamientos
//       this.tratamientos = tratamientos;

//       // Asignar los datos al gráfico
//       this.bubbleChartData.labels = tratamientos; // Asigna nombres a las etiquetas del eje X
//       this.bubbleChartData.datasets[0].data = dataset.map((d: BubbleData) => ({
//         x: d.x,
//         y: d.y,
//         r: d.r
//       }));
//       this.bubbleChartData.datasets[0].backgroundColor = dataset.map((d: BubbleData) => d.backgroundColor);
//     });
//   }
// }

// #########################

import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType, TooltipItem } from 'chart.js'; // Importar TooltipItem desde Chart.js
import { AnalityService } from 'src/app/services/anality.service';

interface BubbleData {
  x: number;
  y: number;
  r: number;
  backgroundColor: string;
}

@Component({
  selector: 'app-analityabc',
  templateUrl: './analityabc.component.html',
  styleUrls: ['./analityabc.component.css']
})
export class AnalityabcComponent implements OnInit {
  public bubbleChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {
        ticks: {
          callback: (tickValue: string | number) => {
            if (typeof tickValue === 'number') {
              return this.tratamientos[tickValue]; // Mapear el índice al nombre del tratamiento
            }
            return ''; // Devolver vacío si no es un número
          }
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: (tickValue: string | number) => {
            if (typeof tickValue === 'number') {
              return `${tickValue}%`;  // Mostrar valor en porcentaje
            }
            return ''; // Si no es número, retornar vacío
          }
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return this.tratamientos[index]; // Mostrar el nombre del tratamiento
          },
          label: (tooltipItem: TooltipItem<'bubble'>) => { // Asegúrate de que el tipo se ajuste al gráfico de burbujas
            const bubbleData = tooltipItem.raw as BubbleData; // Hacemos un casting a BubbleData
            const rValue = bubbleData.r; // Obtener el tamaño de la burbuja (frecuencia)
            return `Frecuencia: ${rValue}`; // Mostrar la frecuencia
          }
        }
      }
    }
  };

  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartLegend = true;
  public tratamientos: string[] = []; // Array para almacenar nombres de tratamientos
  public bubbleChartData: ChartData<'bubble'> = {
    labels: [],  // Las etiquetas del eje X
    datasets: [{
      label: 'TratamientosS',
      data: [],  // Datos llenos dinámicamente
      backgroundColor: [],
      borderColor: 'rgba(0,0,0,0.1)',
      hoverBackgroundColor: 'rgba(0,0,0,0.3)',
      hoverBorderColor: 'rgba(0,0,0,0.2)'
    }]
  };

  constructor(private analityservice: AnalityService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  //------------------------
  // public bubbleChartOptions: ChartConfiguration['options'] = {
  //   scales: {
  //     x: {
  //       ticks: {
  //         callback: (tickValue: string | number) => {
  //           if (typeof tickValue === 'number') {
  //             return this.tratamientos[tickValue]; // Mapear el índice al nombre del tratamiento
  //           }
  //           return ''; // Devolver vacío si no es un número
  //         }
  //       },
  //     },
  //     y: {
  //       min: 0,
  //       max: 100,
  //       ticks: {
  //         callback: (tickValue: string | number) => {
  //           if (typeof tickValue === 'number') {
  //             return `${tickValue}%`;  // Mostrar valor en porcentaje
  //           }
  //           return ''; // Si no es número, retornar vacío
  //         }
  //       },
  //     },
  //   },
  //   plugins: {
  //     tooltip: {
  //       callbacks: {
  //         title: (tooltipItems) => {
  //           const index = tooltipItems[0].dataIndex;
  //           return this.tratamientos[index]; // Mostrar el nombre del tratamiento
  //         },
  //         label: (tooltipItem: TooltipItem<'bubble'>) => { // Asegúrate de que el tipo se ajuste al gráfico de burbujas
  //           const bubbleData = tooltipItem.raw as BubbleData; // Hacemos un casting a BubbleData
  //           const rValue = bubbleData.r; // Obtener el tamaño de la burbuja (frecuencia)
  //           return `Frecuencia: ${rValue}`; // Mostrar la frecuencia
  //         }
  //       }
  //     }
  //   }
  // };
  // public bubbleChartData: ChartData<'bubble'> = {
  //   labels: [],  // Las etiquetas del eje X
  //   datasets: [{
  //     label: 'TratamientosS',
  //     data: [],  // Datos llenos dinámicamente
  //     backgroundColor: [],
  //     borderColor: 'rgba(0,0,0,0.1)',
  //     hoverBackgroundColor: 'rgba(0,0,0,0.3)',
  //     hoverBorderColor: 'rgba(0,0,0,0.2)'
  //   }]
  // };
  //---------------------

  fetchData(): void {
    this.analityservice.cargarABC().subscribe((data: any) => {
      console.log('ANALITY_ABC', data);
      const tratamientos = data.Tratamientos;
      const porcentajes = data['Porcentaje Acumulado'];
      const frecuencias = data.Frecuencias;
      const clasificaciones = data['Clasificación ABC'];

      // Colores según clasificación ABC
      const coloresABC = {
        'A': 'blue',
        'B': 'green',
        'C': 'red'
      };

      // Crear dataset para el gráfico de burbujas
      const dataset: BubbleData[] = tratamientos.map((tratamiento: string, index: number) => ({
        x: index,  // Usamos el índice como posición en el eje X
        y: porcentajes[index],  // Porcentaje acumulado en el eje Y
        // r: frecuencias[index],  // Tamaño de la burbuja
        r: frecuencias[index] * 4,  // Tamaño de la burbuja
        backgroundColor: coloresABC[clasificaciones[index] as keyof typeof coloresABC]  // Color según clasificación
      }));

      // Asignar los nombres de los tratamientos
      this.tratamientos = tratamientos;

      // Asignar los datos al gráfico
      this.bubbleChartData.labels = tratamientos; // Asigna nombres a las etiquetas del eje X
      this.bubbleChartData.datasets[0].data = dataset.map((d: BubbleData) => ({
        x: d.x,
        y: d.y,
        r: d.r
      }));
      this.bubbleChartData.datasets[0].backgroundColor = dataset.map((d: BubbleData) => d.backgroundColor);
    });
  }
}

