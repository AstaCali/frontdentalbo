import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const base_ia_url = environment.chataBotIA;

const base_url = environment.serverBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  constructor(private http: HttpClient){}

  sendMessage(message: string, chatHistory: any[], state: any) {
      return this.http.post<any>(base_ia_url, { prompt: message, chat_history: chatHistory, state });
  }

  //---crear cita por chatbot--
  crearCitaChat( formData: any){
    //console.log('crear usaurio');
    return this.http.post(`${base_url}/citas/citabot`, formData)
  }

}