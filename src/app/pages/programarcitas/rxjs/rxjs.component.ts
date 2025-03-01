import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';

// import  interactionPlugin  from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid'; //--MUESTRA EL MES CON CUADROS. MONDTH
import timeGridPlugin from '@fullcalendar/timegrid';//---MUESTRA LA SEMANA y EL DIA CON HORAS. WEEK y DAY
import interactionPlugin  from '@fullcalendar/interaction';

import { Citass } from 'src/app/models/citas.model';
import { CitasService } from 'src/app/services/citas.service';
import { format } from 'date-fns';
// import listPlugin from '@fullcalendar/list'; //----MUESTRA LA LISTA DE REGISTRO UN BOTON SE CREA

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnInit{

  public citas : Citass[]=[];
  @Input() fechaHoraSeleccionada: Date | undefined; 
  @ViewChild('calendar') calendar!: ElementRef;
  eventoSeleccionado: any;

  constructor ( private citasService : CitasService){}

  ngOnInit(): void {

    //this.cargarCitass();
    //this.mapearCitasParaFullCalendar();
  }

  mapearCitasParaFullCalendar() {
    //console.log('MAPEO_CITAS', this.citas[0]);
    const eventos = this.citas.map(cita => ({
      title: `${cita.person.name}T${cita.person.last_name}`,
      date: `${cita.fecha}T${cita.hora_inicio}`,
      start: `${cita.fecha}T${cita.hora_inicio}`,
      //title: `${cita.fecha} - ${cita.hora_inicio} a ${cita.hora_final}`,
      //date: `${cita.fecha}T${cita.hora_inicio}`,
    }));
    //console.log('Eventos mapeados para FullCalendar:', eventos);

    this.calendarOptions.events = eventos;
  }
  //----------------"############################"-------------
  events: any = [ 
    // { title: 'Present', date: '2023-11-15T11:30:00', color: '#0@@OFF'}, 
    { title: 'Present', start: '2023-11-15T11:30:00'},
    // { title: 'Present’, date: '2022-03-83', color: '#FF000Q" ),
  ];
  abrilModal = false;
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    
    // plugins: [interactionPlugin, dayGridPlugin,timeGridPlugin,listPlugin,],
    plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin],
    //events: this.events,
    //events: this.mapearCitasParaFullCalendar(),
    // headerToolbar: {
    //   left: 'prev,next,today',
    //   center: 'title',
    //   right: 'dayGridMonth,timeGridWeek,timeGridDay'
    // },
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),  // Agrega esta línea para manejar eventos MOSTAR LOS DATOS YA CREADOE EN FULLCALENDAR
  };
  //-----------ENVIAR PARA ABRIR UN MODAL----
  handleDateClick(info: any) {
    //console.log('handleDateClick ejecutado');
    this.fechaHoraSeleccionada = info.date;
    //console.log('fechaHoraSeleccionada', this.fechaHoraSeleccionada);
    this.abrilModal = true;
    //console.log('ABRIRMODAL', this.abrilModal);
    //---------
  }
  handleEventClick(info: any) {
    // La información del evento seleccionado estará en info.event
    const eventoSeleccionado = info.event;

    // Puedes acceder a los datos del evento, por ejemplo, el título y la fecha
    const title = eventoSeleccionado.title;
    const date = eventoSeleccionado.start;
    // Haz lo que necesites con la información del evento
    //console.log('Evento seleccionado:', title, date);
  }
  //---MODAL CERRADO DEL FORMULARIO--
  closeForm() {
    this.abrilModal = false;
  }
  cancelarFormulario() {
    this.abrilModal = false; // Cierra el formulario sin guardar
  }
}

