import { Component, OnInit } from '@angular/core';
//import { QRCodeModule } from 'angularx-qrcode';
import { CitassMsj } from 'src/app/models/msjcitas.model';
import { CitasService } from 'src/app/services/citas.service';
import { WhatsappQrService } from 'src/app/services/whatsapp.service';
import Swal from 'sweetalert2';

//import { QRCodeErrorCorrectionLevel } from "qrcode";



@Component({
  selector: 'app-msjcitas',
  templateUrl: './msjcitas.component.html',
  styleUrls: ['./msjcitas.component.css'],
})
export class MsjcitasComponent implements OnInit {

  public citasMsj : CitassMsj[] = [];
  public totalCitasMsj : number = 0;
  public desde : number = 0;
  public fechaInicio: Date | null = null;
  public currentDate?: string;
  //----GENERAR QR--
  public abrirModal = false;
  public titulomessage : string = '';
  public qrCodeData : string = '';
  //errorCorrection = QRCodeErrorCorrectionLevel
  //---HASTA AQUI---

  constructor(private citasService: CitasService, private whatsappQrService: WhatsappQrService){}

  ngOnInit(): void {
    //this.cargarCitasMsj();
    this.fechaActual();
  }

  fechaActual() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    this.currentDate = `${year}-${month}-${day}`;
    const todayDate = new Date(this.currentDate);
    this.cargarCitasMsj('', todayDate);
  }
  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.value) {
      const selectedDate = new Date(input.value);
      //console.log('Fecha seleccionada:', selectedDate);
      // Llamar a cargarCitasMsj con la fecha seleccionada
      this.cargarCitasMsj('', selectedDate);
    }
  }
  cargarCitasMsj(termino: string = '', fechaInicio?: Date): void {
    this.citasService.cargarCitaMsj(this.desde, termino, fechaInicio)
      .subscribe(({ total, msjcitas }) => {
        //console.log('MSJ_Carga', total, msjcitas);
        this.totalCitasMsj = total;
        this.citasMsj = msjcitas;
        this.cargarQenerarQR();
      });
  }

  cambiarPagina( valor : number){
    //console.log('cambia', valor);
    this.desde += valor; 
    if (this.desde < 0){
      this.desde = 0;
    } else if ( this.desde >= this.totalCitasMsj){
      this.desde -= valor;
    }
    this.cargarCitasMsj();
  }
  //----ENVIAR MENSAJE UNO POR UNO
  enviarMsj(citassMsj: any): void {
    //console.log("msj_se_enviara", citassMsj);
    this.citasService.enviarMsjs([citassMsj])
      .subscribe(response => {
        //console.log('Respuesta del servidor:', response);
        Swal.fire('Enviado',`enviado correctamente`, 'success' );
        this.cargarCitasMsj();
        //this.toggleButtonState();
      }, error => {
        //console.error('Error al enviar mensajes:', error);
      });
  }
  //-- ENVIAR MENSAJE GLOBAL--
  enviarMsjGlobla(){

    //console.log("msj_global_se_enviara", this.citasMsj);
    this.citasService.enviarMsjs(this.citasMsj)
      .subscribe(resp =>{
        //console.log('Respuesta del servidor:', resp);
        Swal.fire('Enviado',`enviado MSJ correctamente`, 'success' );
        this.cargarCitasMsj();
      }, error => {
        //console.error('Error al enviar mensajes:', error);
      });
  }

  //----GENERAR QR--
  cargarQenerarQR(){
    //console.log('GENERAR_QR');
    this.whatsappQrService.cargarQr()
    .subscribe((resp) => {
      //console.log('GENERAR_QR', resp);
      this.titulomessage = resp.msg;
      this.qrCodeData = resp.qr;
      //console.log('QR', this.qrCodeData);
    });
  }

}
