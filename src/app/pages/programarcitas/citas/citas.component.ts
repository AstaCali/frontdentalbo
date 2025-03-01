import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {

  @Input() fechaHoraSeleccionada: Date | undefined;
  @Output() cancelarFormulario = new EventEmitter<void>();
  fechaFormateada: string | undefined;
  horaFormateada: string | undefined;
  public citaForm: any;

  
  constructor( private fb: FormBuilder) { }

  ngOnInit(): void {

    this.citaForm = this.fb.group({
      tiempo: ['', Validators.required ],
      fecha: ['', Validators.required ],
      hora_inicio: ['', Validators.required ],
      hora_final: ['', Validators.required ],
    });
    if (this.fechaHoraSeleccionada) {
      // Formatea la fecha y la hora seleccionada
      this.fechaFormateada = format(this.fechaHoraSeleccionada, 'yyyy-MM-dd');
      this.horaFormateada = format(this.fechaHoraSeleccionada, 'HH:mm:ss');
      //console.log('TIME',this.horaFormateada);
  
      this.citaForm.setValue({
        fecha: this.fechaFormateada,
        hora_inicio: this.horaFormateada,
        tiempo: 1, // Ajusta según tus necesidades
        hora_final: '', // Puedes establecer un valor predeterminado si es necesario
      });

      const controlHoraInicio = this.citaForm.get('hora_inicio');
      const controlTiempo = this.citaForm.get('tiempo');

      if (controlHoraInicio && controlTiempo) {
        // Observa cambios en el control hora_inicio, incluyendo el valor inicial
        controlHoraInicio.valueChanges.pipe(
          startWith(controlHoraInicio.value),
          switchMap((horaInicio: string) => {
            // Observa cambios en el control tiempo, incluyendo el valor inicial
            return controlTiempo.valueChanges.pipe(
              startWith(controlTiempo.value),
              map((duracionSeleccionada: number) => ({ horaInicio, duracionSeleccionada }))
            );
          })
        ).subscribe(({ horaInicio, duracionSeleccionada }: { horaInicio: string, duracionSeleccionada: number }) => {
          // console.log('Se ha producido un cambio en la hora de inicio:', horaInicio);
          // console.log('Valor de tiempo:', duracionSeleccionada);
          if (horaInicio !== null && duracionSeleccionada !== null && duracionSeleccionada !== undefined) {
            // Calcula la hora final sumando la duración seleccionada en minutos
            const minutos = duracionSeleccionada === 1 ? 30 : duracionSeleccionada * 60;
            const horaFinal = this.sumarMinutos(horaInicio, minutos);
      
            // Actualiza el valor del control de la hora final
            this.citaForm.patchValue({
              hora_final: horaFinal.slice(0, 5), // Solo los primeros 5 caracteres
            });
      
            // Muestra el valor de hora_final en la consola
            //console.log('Valor de hora_final después de actualizar:', this.citaForm.get('hora_final')?.value);
          }
        });
      }
    }
  }
  sumarMinutos(hora: string, minutos: number): string {
    const horaDate = new Date(`1970-01-01T${hora}`);
    horaDate.setMinutes(horaDate.getMinutes() + minutos);
    return horaDate.toTimeString().slice(0, 8);
  }
  nombre: string = '';
  edad: number = 0;
  email: string = '';

  guardarPaciente() {
    // Aquí puedes implementar la lógica para guardar el paciente en tu sistema
    // Por ejemplo, puedes enviar los datos a un servicio o realizar cualquier otra acción necesaria
    // console.log('Datos del paciente:');
    // console.log('Nombre:', this.nombre);
    // console.log('Edad:', this.edad);
    // console.log('Email:', this.email);
    // console.log('Fecha y Hora Seleccionadas:', this.fechaHoraSeleccionada);

    // Limpia los campos del formulario después de guardar
    this.nombre = '';
    this.edad = 0;
    this.email = '';
    this.fechaHoraSeleccionada = undefined;
  }
  cancelar() {
    this.cancelarFormulario.emit(); // Emite el evento al hacer clic en "Cancelar"
  }

}
