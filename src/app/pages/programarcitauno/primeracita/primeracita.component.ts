import { Component, EventEmitter, Input, OnInit, Output, OnDestroy,ChangeDetectorRef } from '@angular/core';
//import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';

import { CitasService } from 'src/app/services/citas.service';

import { Citass } from 'src/app/models/citas.model';

import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid'; //--MUESTRA EL MES CON CUADROS. MONDTH
import timeGridPlugin from '@fullcalendar/timegrid';//---MUESTRA LA SEMANA y EL DIA CON HORAS. WEEK y DAY
import interactionPlugin  from '@fullcalendar/interaction';
//import esLocale from '@fu';
import esLocale from '@fullcalendar/core/locales/es'; // Importa el idioma español
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Odontologo } from 'src/app/models/odontologo.model';
import { OdontologoService } from 'src/app/services/odontologo.service';

@Component({
  selector: 'app-primeracita',
  templateUrl: './primeracita.component.html',
  styleUrls: ['./primeracita.component.css']
})
export class PrimeracitaComponent implements OnInit {

  // public citas : Citass[]=[];
  public citas : Citass[]=[];
  public dentista : Odontologo[]=[];
  // selectedDentistaId: number | null = null;
  selectedDentistaId: number = 0;
  @Input() fechaHoraSeleccionada: Date | undefined; 
  //--PARA ENVIAR EL ID DEL DOCTOR--
  //---AUMENTE DESTE AUI--
  public rol_usuario : any;
  public rol_usuario_dos : string = '';//--para usar para ber si puede seleccionar oTro checkbok 
  public id_person_usuario : number =0;

  constructor ( private citasService : CitasService,
                private usuarioService : UsuarioService,
                private odontologoService: OdontologoService
                //private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.cargarOdontologCalendar();
    //this.cargarCitass();    
  }

  //-------------CARGAR ODONTOLOGO PARA FULL_CALENDAR------------------
  cargarOdontologCalendar() {
    //console.log('LLEGA EVENTS',this.events);
    this.odontologoService.cargarOdontologoCalendar()
      .subscribe( data => {
        this.dentista = data;
        // console.log('LLEGA DENTISTA',this.dentista);
        // console.log('LLEGA DENTISTA odontologoId',this.usuarioService.usuario.odontologoId);
        this.rol_usuario_dos = this.usuarioService.usuario.role.name;
        //console.log('LLEGA DENTISTA rol_usuario_dos',this.rol_usuario_dos);
        this.onSelectDentista(this.usuarioService.usuario.odontologoId);
    })
  }
  
  getColor(index: number): string {
    // const colors = ['text-info', 'text-success', 'text-warning'];
    const colors = ['text-info', 'text-success', 'text-warning','text-danger'];
    return colors[index % colors.length];
  }
  onSelectDentista(id: number) {
    if (this.selectedDentistaId === id) {
      this.selectedDentistaId = 0; // Deselect if the same checkbox is clicked again
      //console.log('ID_DENTISTA_en IF:', this.selectedDentistaId);
      this.cargarCitass(this.selectedDentistaId);
    } else {
      this.selectedDentistaId = id;
      //console.log('ID_DENTISTA_EN_ELSE:', this.selectedDentistaId);
      this.cargarCitass(this.selectedDentistaId);
    }
  }
  //-------------LISTAR CITAS PROGRAMADAS------------------
  cargarCitass(idOdontologo : number) {
    //console.log('LLEGA EVENTS',this.events);
    this.citasService.cargarCitas(idOdontologo)
      .subscribe( data => {
        this.citas = data;
        //console.log('LLEGA Citas',this.citas);
        // Llama a la función después de que los datos estén disponibles
        this.mapearCitasParaFullCalendar();
    })
  }

  mapearCitasParaFullCalendar() {
    this.rol_usuario = this.usuarioService.usuario.role.name;
    this.id_person_usuario = this.usuarioService.usuario.person.id;
    //console.log('ROL_DEL USUARIO:-',this.rol_usuario,'-ID-',this.id_person_usuario);

    const eventos = this.citas.map(cita => ({
      title: (this.rol_usuario === 'ADMINISTRADOR' || this.rol_usuario === 'ODONTOLOGO' || this.rol_usuario === 'SECRETARIA' || cita.person.id === this.id_person_usuario)
        ? `${cita.person.name} ${cita.person.last_name}`
        : 'Cita Programada',
      // date: `${cita.fecha}T${cita.hora_inicio}`,
      // start: `${cita.fecha}T${cita.hora_final}`,
      start: `${cita.fecha}T${cita.hora_inicio}`,
      end: `${cita.fecha}T${cita.hora_final}`,
      id: `${cita.id}`
    }));
    //console.log('Eventos mapeados para FullCalendar:', eventos);

    this.calendarOptions.events = eventos;
    // this.cdr.detectChanges(); // Detectar cambios manualmente
  }
  //-----------HASTA AQUI------------------
  //----------CALENDAR-------------
  abrilModal = false;
  calendarVisible = true;//--PARA INICIALIZAR MOSTRANDO EL FULLCALENDAR
  // calendarOptions: CalendarOptions = {}; // Inicializa como un objeto vacío
  // eventos = []; // Tus eventos
  calendarOptions: CalendarOptions = {
    //themeSystem: 'bootstrap', // Utiliza el tema bootstrap
    // plugins: [interactionPlugin, dayGridPlugin,timeGridPlugin,listPlugin,],
    plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin],
    //events: this.events,
    //events: this.mapearCitasParaFullCalendar(),
    initialView: 'timeGridDay', // Configura la vista inicial como 'dayGridDay'
    headerToolbar: {
      start: 'prev,next today',
      center: 'title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [], // Inicialmente vacío, se llenará en `mapearCitasParaFullCalendar`
    //aspectRatio: 1.35, // Puedes ajustar este valor según tus necesidades
    editable: true,
    dateClick: this.enviarDatosFormulario.bind(this),//--PARA REGISTRAR SE LLAMA A ESTA FUNCION
    //eventClick: this.handleEventClick.bind(this),
    eventClick: this.handleEventClick.bind(this),  // Agrega esta línea para manejar eventos MOSTAR LOS DATOS YA CREADOE EN FULLCALENDAR
    eventDrop: this.handleEventDrop.bind(this), // Manejador de eventos para el arrastre de eventos
    allDaySlot: false, // Ocultar la opción "all-day"
    expandRows: true,
    slotMinTime: '08:00:00', // Tiempo mínimo del día
    slotMaxTime: '20:00:00', // Tiempo máximo del día
    slotLabelFormat: {
      hour: 'numeric',
      //minute: '2-digit',
      hour12: true
    },
    height: 'auto', // Ajusta la altura automáticamente
    aspectRatio: 1.35, // Ajusta la relación de aspecto según tus necesidades
    contentHeight: 'auto', // Ajusta la altura del contenido automáticamente
    stickyHeaderDates: true, // Encabezado pegajoso para una mejor experiencia móvil
    scrollTime: '08:00:00', // Hora inicial al cargar el calendario
    //dayMinWidth: 150 // Ajusta el ancho mínimo del día para asegurar que se vea correctamente en pantallas pequeñas
    locale: esLocale, // Configura el idioma a español
  };
  //-----HASTAAQUI-----------------------
  //----------------ENVIO DE DATOS AL DAR CLICK EN UNA HORA Y FECHA DE FULL CALENDAR----
  
  enviarDatosFormulario(info: any) {
    //console.log('handleDateClick ejecutado');
    this.fechaHoraSeleccionada = info.date;
    //console.log('fechaHoraSeleccionada', this.fechaHoraSeleccionada);
    this.abrilModal = true;
    //console.log('ABRIRMODAL', this.abrilModal);
    //---------
  }
  //--------------------HASTA AQUI------------------------
  //---MODAL CERRADO DEL FORMULARIO--
  closeForm() {
    this.abrilModal = false;
  }

  cancelarFormularioCita() {
    this.abrilModal = false; // Cierra el formulario sin guardar
    this.selectedIDCita = 0;
  }
  cerrarFormularioCita() {
    this.abrilModal = false; // Cierra el formulario sin guardar
    this.cargarCitass(this.selectedDentistaId);
    this.selectedIDCita = 0;
    //this.cargarProformaPersonas(this.personaID);

  }
  
  //--------------------HASTA AQUI------------------------

  citaId: number = 0;
  selectedIDCita: number = 0;
  //---PARA AGARAR EL ID PARA RECUPERAR DATOS y LUEGO USAR PARA EDITAR--
  handleEventClick(event: any): void {
    const citaId = event.event.id;
    //console.log('CITA_SELECCIONADA!!!', citaId);
  
    // Encuentra la cita seleccionada
    // const citaSeleccionada = this.citas.find(cita => cita.id === citaId);
    const citaSeleccionada = this.citas.find(cita => cita.id === parseInt(citaId, 10));
    //console.log('citaSeleccionada', citaSeleccionada);
  
    // Verifica si el usuario es un "PACIENTE" y si la cita no le pertenece
    if (this.rol_usuario === 'PACIENTE' && citaSeleccionada?.person.id !== this.id_person_usuario) {
      //console.log('El paciente no puede abrir el modal para citas de otros pacientes.');
      // console.log('citaSeleccionada', citaSeleccionada);
      return; // No abre el modal
    }
  
      // Si el usuario es "ADMINISTRADOR" o "ODONTOLOGO" o el "PACIENTE" abre su propia cita
    if (this.rol_usuario === 'ADMINISTRADOR' || this.rol_usuario === 'ODONTOLOGO' || this.rol_usuario === 'SECRETARIA'|| citaSeleccionada?.person.id === this.id_person_usuario) {
      this.citaId = citaId;  // Actualiza directamente la propiedad citaId
      //this.seleccionarCita.emit(citaId);
      //console.log('Evento emitido correctamente', citaId);
      this.selectedIDCita = citaId
      this.abrilModal = true;
      //console.log('ABRIRMODAL###', this.abrilModal);
    }
  }
  //----///AGARAR DATOS CUANDO LO MUEVO PARA CAMBIAR DE HORA INICIO Y FINAL--
  handleEventDrop(dropInfo: any): void {
    const citaId = dropInfo.event.id;
    const nuevaHoraInicio = dropInfo.event.start;
    const nuevaHoraFinal = dropInfo.event.end;
    
    // console.log('Evento arrastrado a una nueva posición.');
    // console.log('ID de la cita:', citaId);
    // console.log('Nueva hora de inicio:', nuevaHoraInicio);
    // console.log('Nueva hora final:', nuevaHoraFinal);
    
  }
}
