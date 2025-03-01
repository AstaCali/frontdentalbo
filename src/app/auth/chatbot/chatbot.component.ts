import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatbotService } from 'src/app/services/chatbot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  //@ViewChild('messageContainer') private messageContainer: ElementRef;
  @ViewChild('messageContainer', { static: false }) private messageContainer!: ElementRef;

  message = '';
  chatHistory: any[] = [];
  state: any = {};

  constructor(private chatbotService: ChatbotService){}

  ngOnInit(): void {
    
  }

  // sendMessages() {
  //   if (this.message.trim() !== '') {
  //     // Mostrar el mensaje del usuario inmediatamente
  //     const userMessage = { role: 'user', content: this.message };
  //     this.chatHistory.push(userMessage);
  
  //     // Crear una copia del historial de chat sin el mensaje recién añadido
  //     const tempChatHistory = [...this.chatHistory];
  //     tempChatHistory.pop();
  
  //     // Enviar el mensaje al servicio y esperar la respuesta
  //     this.chatbotService.sendMessage(this.message, tempChatHistory, this.state)
  //       .subscribe(response => {
  //         console.log('RESPONDIDO', response);
  
  //         // Actualizar el chatHistory con el historial de chat del backend
  //         this.chatHistory = response.chat_history;

  //         this.scrollDown(); // Scroll automático al final del contenedor de mensajes
  
  //         // Actualizar el estado del chatbot
  //         const newState = {
  //           hora_inicio: response.state.hora_inicio,
  //           last_name: response.state.last_name,
  //           name: response.state.name,
  //           celular: response.state.celular,
  //           email: response.state.email
  //           // Puedes añadir más campos según sea necesario
  //         };
  //         console.log('STATE: ', newState);
  
  //         // Verificar si todos los campos necesarios están presentes en newState
  //         if (newState.name && newState.last_name && newState.celular && newState.hora_inicio && newState.email) {
  //           // Llamar a la función guardarChat con los datos capturados
  //           this.guardarChat(newState.name, newState.last_name, +newState.celular, newState.hora_inicio, newState.email);
  
  //           // Limpiar el campo de entrada después de enviar el mensaje
  //           this.message = '';
  //         } else {
  //           console.log('Aún falta capturar todos los campos en newState.');
  //           this.message = '';
  //         }
  
  //         // Actualizar el estado del chatbot con el estado completo recibido
  //         this.state = response.state;
  //       }, error => {
  //         console.error('Error al enviar el mensaje', error);
  //       });
  //   }
  // }

  sendMessages() {
    if (this.message.trim() !== '') {
      const userMessage = { role: 'user', content: this.message };
      this.chatHistory.push(userMessage);

      const tempChatHistory = [...this.chatHistory];
      tempChatHistory.pop();

      this.chatbotService.sendMessage(this.message, tempChatHistory, this.state)
        .subscribe(response => {

          console.log('RESPONDIDO', response);
          // Actualizar el chatHistory con el historial de chat del backend
          this.chatHistory = response.chat_history;

          // Scroll automático al final del contenedor de mensajes
          this.scrollDown();

          // Actualizar el estado del chatbot
          const newState = {
            //hora_inicio: response.state.hora_inicio,
            hora_inicio: response.state.hora,
            last_name: response.state.last_name,
            name: response.state.name,
            // celular: response.state.celular,
            celular: response.state.phone,
            email: response.state.email
            // Puedes añadir más campos según sea necesario
          };
          console.log('STATE: ', newState);

          // Verificar si todos los campos necesarios están presentes en newState
          if (newState.name && newState.last_name && newState.celular && newState.hora_inicio && newState.email) {
            // Llamar a la función guardarChat con los datos capturados
            //this.guardarChat(newState.name, newState.last_name, +newState.celular, newState.hora_inicio, newState.email);
            this.guardarChat(newState.name, newState.last_name, newState.celular, newState.hora_inicio, newState.email);

            // Limpiar el campo de entrada después de enviar el mensaje
            this.message = '';
          } else {
            console.log('Aún falta capturar todos los campos en newState.');
            this.message = '';
          }

          // Actualizar el estado del chatbot con el estado completo recibido
          this.state = response.state;
        }, error => {
          console.error('Error al enviar el mensaje', error);
        });
    }
  }

  // private scrollDown(): void {
  //   try {
  //     this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
  //   } catch(err) { }
  // }

  //----CREAR CITA POR CHATBOT--
  
  private scrollDown(): void {
    try {
      // Esperar un breve momento para que el DOM actualice con los nuevos mensajes
      setTimeout(() => {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      }, 0);
    } catch(err) { }
  }

  guardarChat(name: string, last_name: string, celular: number, hora_inicio: string, email: string) {
    // Crear el objeto formData con los datos necesarios
    console.log('daTos_enviado: ', name, last_name, celular, hora_inicio, email);
    const formData = {
      name,
      last_name,
      celular,
      hora_inicio,
      email
    };
  
    // Llamar al servicio para crear la cita
    this.chatbotService.crearCitaChat(formData)
    .subscribe(response => {
      console.log('Respuesta del backend:', response);
      // Aquí puedes manejar la respuesta del backend según tus necesidades
      // Por ejemplo, mostrar un mensaje de éxito al usuario
      alert('Cita creada exitosamente');
    }, error => {
      console.error('Error al crear la cita:', error);
      // Aquí puedes manejar el error y mostrar un mensaje adecuado al usuario
      alert('Error al crear la cita. Por favor, intenta nuevamente.');
    });
  }

  // guardarChat(name:string, last_name: string, celular:number, hora_inicio: string){
  //   console.log('daTos_enviado: ', name, last_name, celular, hora_inicio);
  // }
  // guardarTratamiento(){

  //     //   //--crear
  //     // console.log('ENVIANDO DATOS!!',this.tratamientoForm.value);
  //     // const { name_treatment } = this.tratamientoForm.value;
  //     // this.tratamientosService.crearTratamiento( this.tratamientoForm.value )
  //     //   .subscribe( resp => {
  //     //     console.log('RESP:', resp);
  //     //     Swal.fire('Creado', `${ name_treatment } creado correctamente`, 'success');
  //     //     this.router.navigateByUrl(`/dashboard/tratamientos`)
  //     // })
  // }
}
